import awsmobile from '../aws-exports.js';
import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';

/* Debug only
import Amplify from 'aws-amplify';
Amplify.Logger.LOG_LEVEL = 'DEBUG' */

// import { Logger } from 'aws-amplify';
import { Hub, ConsoleLogger } from '@aws-amplify/core';
import { injectConfig } from '../configs/auth';

const IdentityPoolId = injectConfig(awsmobile).Auth.identityPoolId;
console.log('IdentityPoolId', IdentityPoolId);

if(!AWS.config || !AWS.config.region) {
  AWS.config = new AWS.Config({ region: 'us-east-1' });
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
  const { name, email } = data.attributes;
  const user = { name, email }; // , username: data.username 

  // console.log('AWS.config.credentials', AWS.config.credentials)
  // console.log('AWS.config', AWS.config)
  const currentCredentials = await Auth.currentCredentials();
  console.log('currentCredentials', currentCredentials);
  const credentials = Auth.essentialCredentials(currentCredentials);
  // console.log('credentials', credentials);
  
  AWS.config.credentials = new AWS.Credentials(credentials);

  const authParams: any = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    region: 'us-east-1'
  };
  if(!user.name || !user.email || !authParams.accessKeyId) {
    console.log('aws: no valid returned');
    cb(null);
    return;
  }
  cb({
    user,
    ...authParams
  });
}

export function logout() {
  Auth.signOut()
    .then()
    .catch((err: any) => console.log(err));
}
