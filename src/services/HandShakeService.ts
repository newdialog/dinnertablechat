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
  stop: boolean;
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
  console.log('t,', ticket.Item);

  if (!ticket.Item) throw new Error('no entry in dynamo: sns_to_pubsub');

  // const matchid = ticket.Item!.match;
  // ===
  return ticket.Item! as SyncCallback;
}

export async function handshake(
  matchid: string,
  isLeader: boolean,
  state: any,
  stream: MediaStream
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
    const stopFlag: StopFlag = { stop: false };
    const cbs = {
      onSignal: async (sigdata: string) => {
        if(stopFlag.stop) return;
        // console.log('onSignal gen:', mycolor, sigdata);
        await updateMatchBatch(matchid, mycolor, sigdata, state, savedState);
        // console.log('wrote state, isLeader', isLeader);
        // savedState.flag = true;
      },
      onError(e) {
        console.log('webrtc error', e);
        reject('webrtc');
      }
    };
    ps.init(isLeader, cbs);

    let otherPlayerState: PlayerTableData = { char: -1 };

    // wait 3s (for leader, wait until blue heard, for blue wait until red msg)
    if (isLeader) {
      try {
        await delayFlag(savedState);
      } catch (e) {
        reject('retry');
        return;
      }
      await delay(1000 * 5); // now wait for client
    } else await delay(1000 * 5); // hope leader has written state
    console.log('started listening, isLeader', isLeader);
    // try {
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
      reject('retry');
      console.log('handshakeUntilConnected ended with', e);
      return;
    });

    try {
      setTimeout(() => {
        if (stopFlag.stop) return;
        console.log('webrtc onConnection timeout');
        stopFlag.stop = true;
        reject('retry');
        // throw new Error('retry');
      }, 1000 * 60 * 2);
    } catch (e) {
      throw new Error(e);
      return;
    }
    await ps.onConnection();
    stopFlag.stop = true;

    console.log(mycolor + ' rtc elected');

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
  val:number;
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
  return await retry(
    async bail => {
      if (stopFlag.stop) {
        bail('stopSync');
        return;
      }
      const match: HandShakeCallback = await readMatch(matchid);
      const teamkey = team + 'key' + 'i'; // TODO refactor i

      const statekey = team + 'state';
      const keyval = match[teamkey];

      // console.log('recalling state from other:', statekey, match[statekey]);

      if (!keyval || keyval.length <= lastIndex.val) {
        // keyval !== '{"renegotiate":true}' ||
        // await delay(3000);
        console.log('key not set yet', teamkey);
        // return;
        // throw new Error('key not set yet ' + teamkey);
        // await delay(2000);
        throw new Error('retry');
        /// return await readMatchWait(matchid, team);
      }

      const spliceSize = lastIndex.val;
      lastIndex.val = keyval.length; // save total length before splice
      console.log('lastValue', lastIndex.val, spliceSize);
      if(spliceSize > 0) keyval.splice(0, spliceSize); // mutates in-place
      
      // const keyval2 = keyval.map(k=>JSON.parse(k));// .map(v => );

      let stateval = null; // JSON.parse(match[statekey]);
      try {
        // console.log('match[statekey]',match[statekey]);
        stateval = JSON.parse(match[statekey]);
      } catch (err) {
        console.error('couldnt parse other player');
        bail(new Error('couldnt parse other player'));
        return;
      }

      return { key: keyval, state: stateval };
    },
    {
      retries: 4,
      factor: 1.1,
      maxTimeout: 6000,
      minTimeout: 6000
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
  const lastValue = {val:0};
  return await retry(
    async bail => {
      if (stopFlag.stop) {
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
          return bail(new Error('error'));
        }
      } finally {
        
      }

      /* if (!result) {
        console.log('handshakeUntilConnected ended');
        return bail(new Error('ended')); // just end
      }*/
      const { key, state } = result;
      // let ks = key.reduce((acc, x) => acc.concat(x), []); // .filter((v, i, a) => a.indexOf(v) === i); // no longer using SETs
      // console.log('===key', JSON.stringify(key));
      key.forEach( batch => batch.forEach( msg => ps.giveResponse(msg)) );
      if (onState && !stateFetched) onState(state);
      stateFetched = true;

      throw new Error('retry');
    },
    {
      retries: 3 * 2 * 1, // use same as above with multiplier per handshake re-negotitation, min 6
      factor: 1.1,
      maxTimeout: 5000 / 2,
      minTimeout: 5000 / 2
    }
  );
}

let lastBatch:any[] = [];
async function updateMatchBatch(
  matchid: string,
  team: 'blue' | 'red',
  key: string,
  state: any,
  savedFlag: {flag:boolean} // TODO refactor
) {
  // console.log('RAW KEY', key)
  if(lastBatch.length===0) setTimeout(async ()=>{
    await updateMatch(lastBatch[0].matchid, lastBatch[0].team, lastBatch.map((x)=>x.key), lastBatch[0].state);
    lastBatch = [];
    savedFlag.flag = true;
  }, 3000);
  lastBatch.push({matchid, team, key, state});
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

  const teamkey = team + 'key' + 'i'; // TODO: concat

  const statekey = team + 'state';
  const stateStr = JSON.stringify(state);

  console.log(matchid, 'saving to key', teamkey +'=='+ key, 'state: ', statekey+'=='+stateStr);
  const params2: DynamoDB.DocumentClient.UpdateItemInput = {
    Key: {
      id: matchid
    },
    AttributeUpdates: {
      [teamkey]: {
        Action: 'ADD', // ADD | PUT | DELETE,
        Value: [key] /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
      },
      [statekey]: {
        Action: 'PUT',
        Value: stateStr
      }
    },
    TableName: 'match'
  };
  console.log(JSON.stringify(params2));
  const ticket2 = await docClient.update(params2).promise();
  // console.log('ut2,', ticket2);
  return ticket2;
}

// Ensure any last minute sync messages are processed
/* function stopSyncing() {
  // await delay(3000);
  stopSync = true;
}*/

let docClient: DynamoDB.DocumentClient;
export function init(): void {
  if (!docClient)
    docClient = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10'
    });
}
