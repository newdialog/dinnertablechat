import DynamoDB from 'aws-sdk/clients/dynamodb';
import PeerService from './PeerService';
import { from, defer, throwError, of, interval, fromEvent } from 'rxjs';
import {
  // delay as delayRx,
  map,
  filter,
  // retry as retryRx,
  tap,
  concatMap,
  timeout,
  takeUntil,
  throttleTime,
  last,
  bufferTime,
  combineLatest,
  flatMap
} from 'rxjs/operators';
import { retryBackoff } from 'backoff-rxjs';
import { refreshCredentials } from './AuthService';

const whenFlag = (obj: StopFlag) =>
  interval(1000).pipe(
    filter(x => obj.flag === true),
    tap(x => console.log('rx StopFlag'))
  );

export interface StopFlag {
  flag: boolean;
}

// If leader, send out WEBRTC connection string
// If other, wait to recieve leader msg
// Or, for now, all parties create connection string and elected leader is the one accepted, via otherData on Queue.
export interface SyncCallback {
  user: string;
  team: 'blue' | 'red';
  leader: boolean;
  match: string;
}

export interface HandShakeCallback {
  redkey: string;
  bluekey: string;
  id: string;
}

export async function sync(userid: string) {
  await init();

  const params = {
    Key: {
      user: userid
    },
    TableName: 'dtc_sync'
  };

  let ticket: any;
  try {
    ticket = await docClient.get(params).promise();
  } catch (e) {
    console.error('e', e);
    throw e;
  }

  console.log('HS sync:', params, ticket.Item);

  if (!ticket.Item) return null;
  // throw new Error('no entry in dynamo: sns_to_pubsub');
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
  // : Promise<{ peer: PeerService; otherPlayerState: any }> {
  // return new Promise(async (resolve, reject) => {
  const ps = new PeerService(stream);
  // ====
  const mycolor = isLeader ? 'red' : 'blue';
  const otherColor = isLeader ? 'blue' : 'red';
  console.log('handshake', 'for:' + mycolor, ' other:' + otherColor);

  // const savedState = { flag: false };
  const stopFlag: StopFlag = unloadFlag; // { stop: false };
  const cbs = {
    onError(e: any) {
      console.error('webrtc error', e);
      // reject('webrtc');
      throw new Error('webrtc');
    }
  };

  // ({ matchid, team:mycolor, key:x.data, state })
  const saveSignal$ = fromEvent<{ data: any }>(ps, 'signal').pipe(
    map(x => x.data),
    tap(x => console.log('rx batch buffer')),
    bufferTime(250),
    filter(xs => xs.length > 0),
    // tap(xs => console.log('rx batch signal', JSON.stringify(xs))),
    flatMap(xs => from(updateMatch(matchid, mycolor, xs, state))),
    tap(x => console.log('rx batch sent'))
  );

  try {
    await ps.init(isLeader, cbs); // await is important
  } catch (e) {
    console.error('ps init error:', e);
    throw e;
  }

  if (!stopFlag.flag) console.log('started listening, isLeader', isLeader);
  else {
    console.log('cancelled listening, isLeader', isLeader);
    return;
  }

  const updates$ = getPartnerUpdates(matchid, otherColor).pipe(
    // throttleTime(3000, undefined, throttleConfig),
    tap(x => x.key.forEach(batch => batch.forEach(msg => ps.giveResponse(msg))))
  );

  const pr = updates$
    .pipe(
      combineLatest(saveSignal$, (x, _) => x),
      takeUntil(defer(() => ps.onConnection())),
      takeUntil(whenFlag(stopFlag)),
      timeout(24000),
      last(),
      map(x => ({ peer: ps, otherPlayerState: x.state }))
    )
    .toPromise();

  // pr.catch(r => console.error('err', r));

  // const upResult = await pr;

  return pr; // { peer: ps, otherPlayerState: upResult.state };

  /*
      .subscribe({
        error: e => {
          console.log('rx e', e);
          // if(e.name === 'EmptyError') return; // silently fail when stream exists
          // reject('' + e);
          throw new Error('' + e)
        },
        next: d => {
          console.log('rx done', d);
          resolve({ peer: ps, otherPlayerState: d.state });
        },
        complete: () => console.log('rx completed')
      });
      */
  //});
}

async function readMatch(matchid: string): Promise<HandShakeCallback> {
  const params2 = {
    Key: {
      id: matchid
    },
    TableName: 'match'
  };

  let ticket2: any;
  try {
    ticket2 = await docClient.get(params2).promise();
  } catch (e) {
    console.error('HS readMatch err', e);
    throw e;
  }
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

function getPartnerUpdates(matchid: string, team: 'blue' | 'red') {
  let lastIndex = 0;
  const teamkey = team + 'keyi';
  const statekey = team + 'state';
  console.log('rx handshakeUntilConnected', matchid, team);

  return interval(3000).pipe(
    tap(x => console.log('rx readMatchWait (re)start')),
    concatMap(x => defer(() => readMatch(matchid))),
    map(match => {
      const keyval = match[teamkey] as Array<any>;
      // console.log('rx getPartnerUpdates keyval', keyval, JSON.stringify(match));
      const stateval = match[statekey];
      if (stateval) stateval!.guest = match[team + 'guest'];
      return { key: keyval, state: stateval };
    }),
    filter(x => x.key.length > lastIndex),
    map(x => {
      /*if (x.key.length <= lastIndex) {
        console.log('getPartnerUpdates: found no update yet');
        return throwError(new Error('retry')); // throw if no new data from DB
      }*/
      console.log('getPartnerUpdates: found updates', x.key.length - lastIndex);
      if (lastIndex > 0) x.key.splice(0, lastIndex);
      lastIndex = x.key.length; // update the lastIndex to what was read

      // x.key = x.key.map(b => JSON.parse(b));
      return x; // just return
    }),
    // retryBackoff({ maxRetries: 5, maxInterval: 5000, initialInterval: 3000 }),
    tap(x => console.log('rx tap: getPartnerUpdates', x.key.length, x.key))
  );
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
    throw new Error('updateMatch no key provided');
    /// return;
  }

  const teamkey = team + 'keyi';
  const statekey = team + 'state';
  // const stateStr = JSON.stringify(state);

  console.log(
    matchid,
    'batchSize: ' + key.length,
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
          key // .map(k => JSON.stringify(key))
        ] /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
      },
      [statekey]: {
        Action: 'PUT',
        Value: state
      }
    },
    TableName: 'match'
  };

  // console.log('rx save data', JSON.stringify(params2));
  await docClient
    .update(params2)
    .promise()
    .catch(e => {
      console.error('docClient updateMatch err', e);
      throw e;
    });
  // console.log('ut2,', ticket2);
  return true;
}

let docClient: DynamoDB.DocumentClient;
export async function init() {
  if (docClient) return;
  let cr: any;

  try {
    cr = await refreshCredentials();
    console.log('cr', cr);
    docClient = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
      ...cr
    });
  } catch (e) {
    console.error('failed to connect to db', e);
    throw e;
  }

  return docClient;
}
