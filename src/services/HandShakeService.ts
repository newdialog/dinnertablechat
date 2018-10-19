import { bool } from 'aws-sdk/clients/signer';

import DynamoDB from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk/global';

import Peer from 'simple-peer';
import PeerService from './PeerService';

import retry from 'async-retry';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
  // const matchid = ticket.Item!.match;
  // ===
  const ps = new PeerService(stream);
  // ====
  const mycolor = isLeader ? 'red' : 'blue';
  const otherColor = isLeader ? 'blue' : 'red';
  console.log('handshake', 'for:' + mycolor, ' other:' + otherColor);

  const cbs = {
    onSignal: async (sigdata: string) => {
      console.log('onSignal gen:', mycolor, sigdata);
      await updateMatch(matchid, mycolor, sigdata, state);
    }
  };
  ps.init(isLeader, cbs);

  const otherPlayerState = (await handshakeUntilConnected(
    matchid,
    otherColor,
    ps
  )) as PlayerTableData;

  await ps.onConnection();
  stopSyncing();

  console.log(mycolor + ' rtc elected');

  return { peer: ps, otherPlayerState };
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

let lastValue: any = null;
let stopSync: boolean = false;
async function readMatchWait(
  matchid: string,
  team: 'blue' | 'red'
): Promise<DBState | null> {
  if (stopSync) return null;
  // return await retry(
  // async bail => {
  // if (stopSync) return;
  const match: HandShakeCallback = await readMatch(matchid);
  const teamkey = team + 'key';

  const statekey = team + 'state';
  const keyval = match[teamkey];

  console.log('recalling state from other:', statekey, match[statekey]);

  if (!keyval || keyval === '-' || keyval === lastValue) {
    lastValue = keyval;
    // keyval !== '{"renegotiate":true}' ||
    // await delay(3000);
    console.log('key not set yet', teamkey);
    // return;
    // throw new Error('key not set yet ' + teamkey);
    await delay(3000);
    return await readMatchWait(matchid, team);
  }

  let stateval = null; // JSON.parse(match[statekey]);
  try {
    stateval = JSON.parse(match[statekey]);
  } catch (err) {
    throw new Error('couldnt parse other player');
  }

  return { key: keyval, state: stateval };
  /* },
    {
      retries: 8
    }*/
  // );
}

interface PlayerTableData {
  char: number;
}

async function handshakeUntilConnected(
  matchid: string,
  team: 'blue' | 'red',
  ps: PeerService
): Promise<PlayerTableData | null> {
  console.log('handshakeUntilConnected');
  const result = await readMatchWait(matchid, team);
  if (!result) {
    console.log('handshakeUntilConnected ended');
    return null; // just end
  }
  const { key, state } = result;
  ps.giveResponse(key);

  await delay(3000);
  handshakeUntilConnected(matchid, team, ps);
  return state;
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
        Action: 'PUT', // ADD | PUT | DELETE,
        Value: stateStr /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
      }
      /* '<AttributeName>': ... */
    },
    TableName: 'match'
  };
  const ticket2 = await docClient.update(params2).promise();
  // console.log('ut2,', ticket2);
  return ticket2;
}

// Ensure any last minute sync messages are processed
async function stopSyncing() {
  await 3000;
  stopSync = true;
}

// async function handShake(matchid: string, state:any, p: PeerService, isLeader:boolean) {}

/*
async function handShakeOther(matchid: string, state:any, p: PeerService) {
  let givenSignal = false;
  const cbs = {
    onSignal: async (data: string) => {
      console.log('onSignal from leader:', data);
      // if (givenSignal || data === '{"renegotiate":true}') return;
      givenSignal = true;
      await updateMatch(matchid, 'blue', data);
    }
  };
  p.init(false, cbs);

  handshakeUntilConnected(matchid, 'red', p);

  await p.onConnection();
  stopSyncing();
  console.log('other rtc connection');

  return p;
}*/

let docClient: DynamoDB.DocumentClient;
export function init(): void {
  if (!docClient)
    docClient = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10'
    });
}

/* not needed, config in configs/auth
  Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: 'us-east-1',
    aws_pubsub_endpoint: 'wss://xxxxxxxxxxxxx.iot.<YOUR-AWS-REGION>.amazonaws.com/mqtt',
  }));
  */

/*
t, {user: "p80", ttl: "1537210403", team: "blue", leader: false, match: "e6428703-4766-4124-8563-84217c19a593"}
t2, {ttl: "1537213823", redkey: "-", bluekey: "-", id: "e6428703-4766-4124-8563-84217c19a593"}
*/
