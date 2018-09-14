import awsmobile from '../aws-exports.js';
import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import Amplify, { PubSub } from 'aws-amplify';
// import { AWSIoTProvider } from 'aws-amplify/lib/PubSub/Providers';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
/* Debug only
import Amplify from 'aws-amplify';
Amplify.Logger.LOG_LEVEL = 'DEBUG' */

// import { Logger } from 'aws-amplify';
import { Hub, ConsoleLogger } from '@aws-amplify/core';
import { injectConfig } from '../configs/auth';

const awsconfig = injectConfig(awsmobile);
const IdentityPoolId = awsconfig.Auth.identityPoolId;
console.log('IdentityPoolId', IdentityPoolId);

if (!AWS.config || !AWS.config.region) {
  AWS.config = new AWS.Config({ region: 'us-east-1' });
  Amplify.addPluggable(new AWSIoTProvider());
  /* AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId,
    RoleArn: 'arn:aws:iam::681274315116:role/dtc_auth_MOBILEHUB_871967846'
    // data.pool.userPoolId
  });*/
}

function getLoggger() {
  const logger: any = new ConsoleLogger('dtc_aws_log');
  logger.onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signIn':
        logger.error('user signed in'); // [ERROR] Alexander_the_auth_watcher - user signed in
        break;
      case 'signUp':
        logger.error('user signed up');
        break;
      case 'signOut':
        logger.error('user signed out');
        break;
      case 'signIn_failure':
        logger.error('user sign in failed');
        break;
      case 'configured':
        logger.error('the Auth module is configured');
        break;
      default:
        break;
    }
  };
  return logger;
}

function onHubCapsule(cb: AwsCB, capsule: any) {
  console.log('onHubCapsule', capsule);
  getLoggger().onHubCapsule(capsule);

  const { channel, payload } = capsule; // source

  if (channel === 'auth' && payload.event === 'signIn') {
    checkUser(cb);
  } else if (
    channel === 'auth' &&
    (payload.event === 'configured' || payload.event === 'cognitoHostedUI')
  ) {
    checkUser(cb);
  }
}

export function auth(cb: AwsCB) {
  console.log('configuring aws');
  const awsmobileInjected = injectConfig(awsmobile);
  Auth.configure(awsmobileInjected);
  Hub.listen('auth', { onHubCapsule: onHubCapsule.bind(null, cb) });
  checkUser(cb); // required by amplify, for existing login
}

type AwsCB = (auth: AwsAuth | null) => void;
export interface AwsAuth {
  user: any;
  // username: string;
  region: string;
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
}

async function checkUser(cb: AwsCB) {
  let data: any;
  try {
    data = await Auth.currentAuthenticatedUser();
  } catch (e) {
    console.log('---currentAuthenticatedUser err:', e);
    return;
  }
  // .then(data => {
  console.log('+++currentAuthenticatedUser', data);
  // console.log('data.pool.userPoolId', data.pool.userPoolId);
  const user = data.attributes;
  // const user = { name, email }; // , username: data.username

  // console.log('AWS.config.credentials', AWS.config.credentials)
  // console.log('AWS.config', AWS.config)
  const currentCredentials = await Auth.currentCredentials();
  console.log('currentCredentials', currentCredentials);
  const credentials = Auth.essentialCredentials(currentCredentials);
  initIot(currentCredentials._identityId, credentials);
  // console.log('credentials', credentials);

  AWS.config.credentials = new AWS.Credentials(credentials);

  const authParams: any = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    region: 'us-east-1'
  };
  if (!user.name || !user.email || !authParams.accessKeyId) {
    console.log('aws: no valid returned-');
    cb(null);
    return;
  }
  cb({
    user: { name: user.name, email: user.email },
    ...authParams
  });
}

type EssentialCredentials = ReturnType<typeof Auth.essentialCredentials>;

async function initIot(_identityId: string, credentials: EssentialCredentials) {
  if (!_identityId) {
    console.warn('!!! no _identityId');
    return;
  }
  PubSub.addPluggable(
    new AWSIoTProvider({
      aws_pubsub_region: 'us-east-1',
      aws_pubsub_endpoint: awsconfig.PubSub.aws_pubsub_endpoint
    })
  );
  /*
            Amplify.addPluggable(new AWSIoTProvider({
            ...config.pubSub,
            credentials,
          }));
  */
  // Attach policy
  const iot = new AWS.Iot({
    region: 'us-east-1',
    credentials
  });

  const policyName = 'amplify-iot-policy';
  const target = _identityId;
  console.log('target', target);

  const { policies } = await iot.listAttachedPolicies({ target }).promise();

  if (policies && !policies.find(policy => policy.policyName === policyName)) {
    await iot.attachPolicy({ policyName, target }).promise();
  } else {
    console.log('already has iot policy');
  }

  console.log('pre: subscribe publish');
  PubSub.subscribe('dtc/test', null as any).subscribe({
    next: data => console.log('Message received', data),
    error: error => console.error(error),
    close: () => console.log('Done')
  } as any);
  await PubSub.publish(
    'dtc/test',
    { msg: 'Hello to all subscribers!' },
    null as any
  );
  console.log('post: subscribe publish');
}

export function logout() {
  Auth.signOut()
    .then()
    .catch((err: any) => console.log(err));
}
