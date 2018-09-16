import { bool } from 'aws-sdk/clients/signer';
import Amplify, { PubSub } from 'aws-amplify';
import AWS from 'aws-sdk';

export interface Profile {
  username: string;
  isMod: bool;
}

export function decideLeader(
  profiles: Profile[]
): { leader: Profile; others: Profile[] } {
  const mods = profiles.filter(p => p.isMod);
  if (mods.length > 0) {
    const others = profiles.filter(p => !p.isMod);
    return { leader: mods[0], others };
  }

  const cp: Profile[] = ([] as Profile[]).concat(profiles);
  cp.sort((a, b) => (a.username > b.username ? 1 : -1));
  const [head, ...tail] = cp;
  return { leader: head, others: tail };
}

// If leader, send out WEBRTC connection string
// If other, wait to recieve leader msg
// Or, for now, all parties create connection string and elected leader is the one accepted, via otherData on Queue.
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

  const matchid = ticket.Item!.match;
  // ===
  const params2 = {
    Key: {
      id: matchid
    },
    TableName: 'match'
  };
  const ticket2 = await docClient.get(params2).promise();
  console.log('t2,', ticket2.Item);
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
