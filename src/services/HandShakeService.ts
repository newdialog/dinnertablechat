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
      retries: 8,
      factor: 1,
      maxTimeout: 1000,
      minTimeout: 1000
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
    const cbs = {
      onSignal: async (sigdata: string) => {
        // console.log('onSignal gen:', mycolor, sigdata);
        await updateMatch(matchid, mycolor, sigdata, state);
        console.log('wrote state, isLeader', isLeader);
        savedState.flag = true;
      }
    };
    ps.init(isLeader, cbs);

    let otherPlayerState: PlayerTableData = { char: -1 };

    let stopFlag: StopFlag = { stop: false };

    // wait 3s (for leader, wait until blue heard, for blue wait until red msg)
    if (isLeader) await delayFlag(savedState);
    else await delay(5000); // hope leader has written state
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
  state: any;
}

// TODO fix global state
let lastValue: any = null;
async function readMatchWait(
  matchid: string,
  team: 'blue' | 'red',
  stopFlag: StopFlag
): Promise<DBState | null> {
  // if (stopSync) return null;
  return await retry(
    async bail => {
      if (stopFlag.stop) {
        bail(new Error('stopSync'));
        return;
      }
      const match: HandShakeCallback = await readMatch(matchid);
      const teamkey = team + 'key';

      const statekey = team + 'state';
      const keyval = match[teamkey];

      // console.log('recalling state from other:', statekey, match[statekey]);

      if (!keyval || keyval === '-' || keyval === lastValue) {
        lastValue = keyval;
        // keyval !== '{"renegotiate":true}' ||
        // await delay(3000);
        console.log('key not set yet', teamkey);
        // return;
        // throw new Error('key not set yet ' + teamkey);
        // await delay(2000);
        throw new Error('retry');
        /// return await readMatchWait(matchid, team);
      }

      let stateval = null; // JSON.parse(match[statekey]);
      try {
        stateval = JSON.parse(match[statekey]);
      } catch (err) {
        console.error('couldnt parse other player');
        bail(new Error('couldnt parse other player'));
        return;
      }

      return { key: keyval, state: stateval };
    },
    {
      retries: 2,
      factor: 1.25,
      maxTimeout: 3500,
      minTimeout: 3500
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
  return await retry(
    async bail => {
      if (stopFlag.stop) return 'stopSync'; // bail(new Error('stopSync'));
      console.log('handshakeUntilConnected');

      let result: any = null;
      try {
        result = await readMatchWait(matchid, team, stopFlag);
      } catch (e) {
        const retryError = e.toString().indexOf('retry') !== -1;
        // console.log(JSON.stringify(e), typeof e, );
        if (retryError) {
          console.log('RETRY error');
          bail(new Error('retry'));
          return; // 'retry';
        } else {
          console.log('readMatchWait aborted with:', e.Error);
          return bail(new Error('error'));
        }
      } finally {
        lastValue = null;
      }

      /* if (!result) {
        console.log('handshakeUntilConnected ended');
        return bail(new Error('ended')); // just end
      }*/
      const { key, state } = result;
      ps.giveResponse(key);
      if (onState && !stateFetched) onState(state);
      stateFetched = true;

      throw new Error('retry');
    },
    {
      retries: 2,
      factor: 1.25,
      maxTimeout: 3000,
      minTimeout: 3000
    }
  );
}

async function updateMatch(
  matchid: string,
  team: 'blue' | 'red',
  key: string,
  state: any = {}
) {
  if (!matchid) throw new Error('no matchid provided');

  const teamkey = team + 'key';

  const statekey = team + 'state';
  const stateStr = state ? JSON.stringify(state) : '{}';

  console.log('saving to key', teamkey, 'state: ', statekey, stateStr);
  const params2: DynamoDB.DocumentClient.UpdateItemInput = {
    Key: {
      id: matchid
    },
    AttributeUpdates: {
      [teamkey]: {
        Action: 'PUT', // ADD | PUT | DELETE,
        Value: key /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
      },
      [statekey]: {
        Action: 'PUT',
        Value: stateStr
      }
    },
    TableName: 'match'
  };
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
