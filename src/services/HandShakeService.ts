import { bool } from 'aws-sdk/clients/signer';
import Amplify, { PubSub } from 'aws-amplify';
import AWS from 'aws-sdk';

import Peer from 'simple-peer';
import PS from './PeerService';

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
  stream: MediaStream
) {
  // const matchid = ticket.Item!.match;
  // ===
  const p = new PS(stream);
  return isLeader ? handShakeLeader(matchid, p) : handShakeOther(matchid, p);
}

async function readMatch(matchid: string): Promise<HandShakeCallback> {
  const params2 = {
    Key: {
      id: matchid
    },
    TableName: 'match'
  };
  const ticket2 = await docClient.get(params2).promise();
  console.log('t2,', ticket2.Item);

  return ticket2.Item! as HandShakeCallback;
}

async function readMatchWait(matchid: string, team: 'blue' | 'red') {
  return await retry(
    async bail => {
      const match: HandShakeCallback = await readMatch(matchid);
      const teamkey = team + 'key';
      const keyval = match[teamkey];
      if (
        !keyval ||
        keyval === '-' ||
        keyval.length === 0 ||
        keyval !== '{"renegotiate":true}'
      ) {
        // await delay(3000);
        console.log('key not set yet');
        throw new Error('key not set yet');
      }
      return keyval;
    },
    {
      retries: 5
    }
  );
}

async function updateMatch(matchid: string, team: 'blue' | 'red', key: string) {
  if (!matchid) throw new Error('no matchid provided');

  const teamkey = team + 'key';
  console.log('saving to key', teamkey);
  const params2: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    Key: {
      id: matchid
    },
    AttributeUpdates: {
      [teamkey]: {
        Action: 'PUT', // ADD | PUT | DELETE,
        Value: key /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
      }
      /* '<AttributeName>': ... */
    },
    TableName: 'match'
  };
  const ticket2 = await docClient.update(params2).promise();
  // console.log('ut2,', ticket2);
  return ticket2;
}

async function handShakeLeader(matchid: string, p: PS) {
  let givenSignal = false;
  const cbs = {
    onSignal: async (data: string) => {
      console.log('onSignal', data);
      if (givenSignal || data === '{"renegotiate":true}') return;
      givenSignal = true;
      await updateMatch(matchid, 'red', data);
    }
  };
  p.init(true, cbs);

  const otherKey = await readMatchWait(matchid, 'blue');
  // console.log('otherKey', otherKey);
  p.giveResponse(otherKey);

  await p.onConnection();
  console.log('leader rtc elected');
  // new Peer({ initiator: true, trickle: false });

  return p;
}

async function handShakeOther(matchid: string, p: PS) {
  // const p = new PS();
  let givenSignal = false;
  const cbs = {
    onSignal: async (data: string) => {
      console.log('onSignal', data);
      if (givenSignal || data === '{"renegotiate":true}') return;
      givenSignal = true;
      await updateMatch(matchid, 'blue', data);
    }
  };
  p.init(false, cbs);
  const leaderKey = await readMatchWait(matchid, 'red');
  // console.log('leaderKey', leaderKey);
  p.giveResponse(leaderKey);

  await p.onConnection();
  console.log('other rtc connection');

  return p;
}

let docClient: AWS.DynamoDB.DocumentClient;
export function init(): void {
  if (!docClient)
    docClient = new AWS.DynamoDB.DocumentClient({
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
