/* tslint:disable:no-bitwise */
import awsmobile from '../aws-exports.js';
import 'aws-sdk/lib/node_loader'; // first time only

import Core from 'aws-sdk/lib/core';
import AWS from 'aws-sdk/global';

import Auth from '@aws-amplify/auth';
import API from './APIService'; // TODO refactor

/* Debug only 
import Amplify from 'aws-amplify';
Amplify.Logger.LOG_LEVEL = 'DEBUG';
(window as any).LOG_LEVEL = 'DEBUG';
*/

// https://github.com/aws-amplify/amplify-js/issues/1487

// import { Logger } from 'aws-amplify';
import { Hub, ConsoleLogger } from '@aws-amplify/core';
import { injectConfig } from '../configs/auth';

const awsconfig = injectConfig(awsmobile);
const IdentityPoolId = awsconfig.Auth.identityPoolId;
// console.log('IdentityPoolId', IdentityPoolId);

if (!AWS.config || !AWS.config.region) {
  AWS.config = new AWS.Config({ region: 'us-east-1' });
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
  // console.log('configuring aws');
  const awsmobileInjected = injectConfig(awsmobile);
  Auth.configure(awsmobileInjected);
  Hub.listen(
    'auth',
    { onHubCapsule: onHubCapsule.bind(null, cb) },
    'AuthService'
  );
  checkUser(cb); // required by amplify, for existing login

  console.log('awsmobileInjected', awsmobileInjected);
  API.configure(awsmobileInjected);

  // TODO refactor
  // setTimeout(() => API.getScores().then(s => console.log('s', s)), 2000);
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
  // console.log('data.pool.userPoolId', data.pool.userPoolId, data.username);
  const user = data.attributes;
  // const user = { name, email }; // , username: data.username

  // console.log('AWS.config.credentials', AWS.config.credentials)
  // console.log('AWS.config', AWS.config)
  const currentCredentials = await Auth.currentCredentials();
  // console.log('currentCredentials', currentCredentials);
  const credentials = Auth.essentialCredentials(currentCredentials);
  // console.log('credentials', credentials);

  // Update analytics
  window.gtag('set', 'userId', data.username);

  AWS.config.credentials = new AWS.Credentials(credentials);
  // FIX: https://github.com/aws-amplify/amplify-js/issues/581
  AWS.config.update({
    dynamoDbCrc32: false
  });

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

export function logout() {
  Auth.signOut()
    .then()
    .catch((err: any) => console.log(err));
}

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c: string) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}
