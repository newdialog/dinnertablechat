import { bool } from 'aws-sdk/clients/signer';
import Amplify, { PubSub } from 'aws-amplify';
import AWS from 'aws-sdk';

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

export async function handshake(matchid: string) {
  // const matchid = ticket.Item!.match;
  // ===
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
