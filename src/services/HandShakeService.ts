import { bool } from 'aws-sdk/clients/signer';

import DynamoDB from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk/global';

import Peer from 'simple-peer';
import PeerService from './PeerService';

import retry from 'async-retry';

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

    let otherPlayerState: PlayerTableData = { char: -1 };

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

    handshakeUntilConnected(
      matchid,
      otherColor,
      ps,
      (otherState: PlayerTableData) => {
        otherPlayerState = otherState;
      },
      stopFlag
    ).catch(e => {
      const retryError = e.toString().indexOf('retry') !== -1;
      // if(retryError) throw new Error('retry');
      /// stopFlag.flag = true;
      reject('retry');
      console.log('handshakeUntilConnected ended with', e);
      return;
    });

    // set timeout for all of handshaking
    let _to = setTimeout(() => {
      if (stopFlag.flag) return;
      console.log('webrtc onConnection timeout');
      /// stopFlag.flag = true;
      reject('retry');
      // throw new Error('retry');
    }, 1000 * 64);

    try {
      console.time('WAITING');
      await ps.onConnection();
    } catch (e) {
      console.error(e);
      reject('webrtc failed');
    } finally {
      console.timeEnd('WAITING');
    }
    if (_to) clearTimeout(_to);

    console.log(mycolor + ' rtc elected', stopFlag.flag);
    if (stopFlag.flag) return reject('stopFlag');
    /// stopFlag.flag = true;
    // await delay(1000); // delay ensure relay? Maybe not needed
    console.warn('-- finished --');

    return resolve({ peer: ps, otherPlayerState });
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
// TODO fix global state
// et lastValue: any = 0;
async function readMatchWait(
  matchid: string,
  team: 'blue' | 'red',
  stopFlag: StopFlag,
  lastIndex: LastIndex
): Promise<DBState | null> {
  // if (stopSync) return null;
  await delay(3100); // 1s to rtc proc, 2 for batch save
  return await retry(
    async bail => {
      if (stopFlag.flag) {
        // bail('stopSync');
        return null;
        // return;
      }
      const match: HandShakeCallback = await readMatch(matchid);
      // if (stopFlag.flag) return null; // needed?
      const teamkey = team + 'keyi';

      const statekey = team + 'state';
      const keyval = match[teamkey];

      // console.log('recalling state from other:', statekey, match[statekey]);

      if (!keyval || keyval.length <= lastIndex.val) {
        // keyval !== '{"renegotiate":true}' ||
        console.log('key not set yet', teamkey);
        // return;
        // throw new Error('key not set yet ' + teamkey);
        throw new Error('retry');
        /// return await readMatchWait(matchid, team);
      }

      const spliceSize = lastIndex.val;
      lastIndex.val = keyval.length; // save total length before splice
      console.log('lastValue', lastIndex.val, spliceSize);
      if (spliceSize > 0) keyval.splice(0, spliceSize); // mutates in-place

      // const keyval2 = keyval.map(k=>JSON.parse(k));// .map(v => );

      let stateval = null; // JSON.parse(match[statekey]);
      try {
        // console.log('match[statekey]',match[statekey]);
        stateval = JSON.parse(match[statekey]);
      } catch (err) {
        console.error('couldnt parse other player');
        bail(new Error('couldnt parse other player'));
        return null;
      }

      return { key: keyval, state: stateval };
    },
    {
      retries: 3, // 4
      factor: 1.0,
      maxTimeout: 5900,
      minTimeout: 5900
    }
  );
}

interface PlayerTableData {
  char: number;
}

async function handshakeUntilConnected(
  matchid: string,
  team: 'blue' | 'red',
  ps: PeerService,
  onState: (state: PlayerTableData) => void,
  stopFlag: StopFlag
) {
  let stateFetched = false;
  const lastValue = { val: 0 };
  return await retry(
    async bail => {
      if (stopFlag.flag) {
        return 'stopSync'; // bail(new Error('stopSync'));
      }
      console.log('handshakeUntilConnected');

      let result: any = null;
      try {
        result = await readMatchWait(matchid, team, stopFlag, lastValue);
      } catch (e) {
        const retryError = e.toString().indexOf('retry') !== -1;
        // console.log(JSON.stringify(e), typeof e, );
        if (retryError) {
          console.log('readMatchWait failed');
          bail(new Error('readMatchWait failed'));
          return; // 'retry';
        } else {
          console.log('readMatchWait aborted with:', e);
          bail(new Error('error'));
          return;
        }
      } finally {
      }

      if (!result) {
        return bail('ended'); // just end
      }
      /// if (stopFlag.flag) return 'stopSync'; // bug?

      const { key, state } = result;
      // let ks = key.reduce((acc, x) => acc.concat(x), []); // .filter((v, i, a) => a.indexOf(v) === i); // no longer using SETs
      // console.log('===key', JSON.stringify(key));
      key.forEach(batch => batch.forEach(msg => ps.giveResponse(msg)));
      if (onState && !stateFetched) onState(state); // relay other character state into store
      stateFetched = true;

      throw new Error('retry');
    },
    {
      retries: 10, // use same as above with multiplier per handshake re-negotitation, min 6
      factor: 1.0,
      maxTimeout: 500,
      minTimeout: 500
    }
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
  const stateStr = JSON.stringify(state);

  console.log(
    matchid,
    'saving to key',
    teamkey + '==', //  + key,
    'state: ',
    statekey + '==' + stateStr
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
        Value: stateStr
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
