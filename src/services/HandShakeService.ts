import { bool } from 'aws-sdk/clients/signer';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import PeerService from './PeerService';
import retry from 'async-retry';
import { iif, from, defer, pipe, throwError, of, interval } from 'rxjs';
import {
  delay as delayRx,
  map,
  filter,
  retryWhen,
  retry as retryRx,
  tap,
  distinctUntilChanged,
  catchError,
  defaultIfEmpty,
  concatMap,
  timeout,
  takeUntil,
  takeWhile,
  mapTo,
  take,
  switchMap,
  debounce,
  throttle,
  throttleTime
} from 'rxjs/operators';
import { retryBackoff } from 'backoff-rxjs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const delayFlag = async (obj: { flag: boolean }) =>
  await retry(
    async bail => {
      if (obj.flag) return true;
      else throw new Error('retry');
    },
    {
      retries: 10,
      factor: 1,
      maxTimeout: 2000,
      minTimeout: 2000
    }
  );

function delayAttempts(delay: number = 3000, max: number = 3) {
  return retryWhen(errors =>
    errors.pipe(
      // Use concat map to keep the errors in order and make sure they
      // aren't executed in parallel
      concatMap((e, i) =>
        // Executes a conditional Observable depending on the result
        // of the first argument
        iif(
          () => i > max,
          // If the condition is true we throw the error (the last error)
          throwError(e),
          // Otherwise we pipe this back into our stream and delay the retry
          of(e).pipe(delayRx(delay))
        )
      )
    )
  );
}

interface StopFlag {
  flag: boolean;
}

// If leader, send out WEBRTC connection string
// If other, wait to recieve leader msg
// Or, for now, all parties create connection string and elected leader is the one accepted, via otherData on Queue.
export interface SyncCallback {
  user: string;
  team: 'blue' | 'red';
  leader: bool;
  match: string;
}

export interface HandShakeCallback {
  redkey: string;
  bluekey: string;
  id: string;
}

export async function sync(userid: string) {
  init();

  const params = {
    Key: {
      user: userid
    },
    TableName: 'dtc_sync'
  };
  const ticket = await docClient.get(params).promise();
  console.log('t,', params, ticket.Item);

  if (!ticket.Item) return null;
  //throw new Error('no entry in dynamo: sns_to_pubsub');
  else if (!ticket.Item!.match) return null; //  throw new Error('no match record');

  // const matchid = ticket.Item!.match;
  // ===
  return ticket.Item! as SyncCallback;
}

export async function handshake(
  matchid: string,
  isLeader: boolean,
  state: any,
  stream: MediaStream,
  unloadFlag: { flag: boolean }
) {
  return new Promise(async (resolve, reject) => {
    // const matchid = ticket.Item!.match;
    // ===
    const ps = new PeerService(stream);
    // ====
    const mycolor = isLeader ? 'red' : 'blue';
    const otherColor = isLeader ? 'blue' : 'red';
    console.log('handshake', 'for:' + mycolor, ' other:' + otherColor);

    const savedState = { flag: false };
    const stopFlag: StopFlag = unloadFlag; // { stop: false };
    const batchCache: { cache: any[] } = { cache: [] };
    const cbs = {
      onSignal: (sigdata: string) => {
        // if (stopFlag.flag) return; // disable as later signal possible, better to destory peer
        // console.log('onSignal gen:', mycolor, sigdata);
        updateMatchBatch(
          matchid,
          mycolor,
          sigdata,
          state,
          savedState,
          batchCache
        );
        // console.log('wrote state, isLeader', isLeader);
        // savedState.flag = true;
      },
      onError(e) {
        console.log('webrtc error', e);
        reject('webrtc');
      }
    };

    await ps.init(isLeader, cbs); // await is important
    if (!ps._peer) throw new Error('no _peer');

    // let otherPlayerState: PlayerTableData = { char: -1 };

    // wait 3s (for leader, wait until blue heard, for blue wait until red msg)
    if (isLeader) {
      try {
        await delayFlag(savedState);
      } catch (e) {
        reject('retry');
        return;
      }
      // await delay(1000 * 4); // now wait for client
    } // else await delay(1000); // hope leader has written state

    if (!stopFlag.flag) console.log('started listening, isLeader', isLeader);
    else {
      console.log('cancelled listening, isLeader', isLeader);
      return;
    }

    let otherState = null;
    handshakeUntilConnected(matchid, otherColor, ps)
      .pipe(
        throttleTime(3000),
        takeUntil(defer(() => ps.onConnection())),
        takeUntil(
          defer(() =>
            interval(1000).pipe(
              mapTo(stopFlag.flag),
              filter(x => x === true)
            )
          )
        ),
        timeout(64000)
      )
      .subscribe({
        error: e => reject(e),
        next: d => (otherState = d.state),
        complete: () => resolve({ peer: ps, otherPlayerState: otherState })
      });
  });
}

async function readMatch(matchid: string): Promise<HandShakeCallback> {
  const params2 = {
    Key: {
      id: matchid
    },
    TableName: 'match'
  };
  const ticket2 = await docClient.get(params2).promise();
  // console.log('t2,', ticket2.Item);

  return ticket2.Item! as HandShakeCallback;
}

export interface DBState {
  key: string;
  state: string[][];
}

interface LastIndex {
  val: number;
}

interface PlayerTableData {
  char: number;
}

function handshakeUntilConnected(
  matchid: string,
  team: 'blue' | 'red',
  ps: PeerService
) {
  let lastIndex = 0;
  const teamkey = team + 'keyi';
  const statekey = team + 'state';
  console.log('rx handshakeUntilConnected');

  return defer(() => readMatch(matchid))
    .pipe(
      tap(x => console.log('rx readMatchWait (re)start')),
      map(match => {
        const keyval = match[teamkey] as Array<any>;
        const stateval = match[statekey];
        stateval!.guest = match[team + 'guest'];
        return { key: keyval, state: stateval };
      }),
      concatMap(x => {
        if (x.key.length <= lastIndex) return throwError('retry'); // throw if no new data from DB

        if (lastIndex > 0) x.key.splice(0, lastIndex);
        lastIndex = x.key.length; // update the lastIndex to what was read
        return of(x); // just return
      }),
      retryBackoff({ maxRetries: 5, maxInterval: 5000, initialInterval: 4000 }),
      // catchError(x => throwError('ended')),
      tap(x => console.log('rx tap', x.key.length))
    )
    .pipe(
      tap(x =>
        x.key.forEach(batch => batch.forEach(msg => ps.giveResponse(msg)))
      )
    );
}

// let calls = 0;
// let batchNum = 0;
async function updateMatchBatch(
  matchid: string,
  team: 'blue' | 'red',
  key: string,
  state: any,
  savedFlag: { flag: boolean }, // TODO refactor
  lastBatchRef: { cache: any[] }
) {
  // console.log('batch ' + batchNum, 'calls', calls++);
  let lastBatch = lastBatchRef.cache;
  // console.log('RAW KEY', key)
  if (lastBatch.length === 0)
    setTimeout(async () => {
      const lastBatchClone = lastBatch.concat([]);
      const lbc0 = lastBatchClone[0];
      lastBatchRef.cache = [];
      // batchNum++;

      await updateMatch(
        lbc0.matchid,
        lbc0.team,
        lastBatchClone.map(x => x.key),
        lbc0.state
      );
      savedFlag.flag = true;
    }, 1000);
  lastBatch.push({ matchid, team, key, state });
}

async function updateMatch(
  matchid: string,
  team: 'blue' | 'red',
  key: string[],
  state: any
) {
  if (!matchid) throw new Error('no matchid provided');
  if (!key) {
    console.log('updateMatch cancel, no key');
    return;
  }

  const teamkey = team + 'keyi';

  const statekey = team + 'state';
  // const stateStr = JSON.stringify(state);

  console.log(
    matchid,
    'saving to key',
    teamkey + '==', //  + key,
    'state: ',
    statekey + '==' + state
  );
  const params2: DynamoDB.DocumentClient.UpdateItemInput = {
    Key: {
      id: matchid
    },
    AttributeUpdates: {
      [teamkey]: {
        Action: 'ADD', // ADD | PUT | DELETE,
        Value: [
          key
        ] /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
      },
      [statekey]: {
        Action: 'PUT',
        Value: state
      }
    },
    TableName: 'match'
  };
  /// console.log(JSON.stringify(params2));
  const ticket2 = await docClient.update(params2).promise();
  // console.log('ut2,', ticket2);
  return ticket2;
}

let docClient: DynamoDB.DocumentClient;
export function init(): void {
  if (!docClient)
    docClient = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10'
    });
}
