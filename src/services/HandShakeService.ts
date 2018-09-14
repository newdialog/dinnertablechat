import { bool } from 'aws-sdk/clients/signer';
import Amplify, { PubSub } from 'aws-amplify';

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
export function sync(): void {}

export function init(): void {
  /* not needed, config in configs/auth
  Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: 'us-east-1',
    aws_pubsub_endpoint: 'wss://xxxxxxxxxxxxx.iot.<YOUR-AWS-REGION>.amazonaws.com/mqtt',
  }));
  */
}
