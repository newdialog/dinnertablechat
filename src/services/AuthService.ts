/* tslint:disable:no-bitwise */
import awsmobile from '../aws-exports.js';
import 'aws-sdk/lib/node_loader'; // first time only

// import Core from 'aws-sdk/lib/core';
import {config, Config, Credentials} from 'aws-sdk/global';

// import Auth from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import API from './APIService'; // TODO refactor

import retry from 'async-retry';
// import { Logger } from 'aws-amplify';
import { Hub } from 'aws-amplify';
import { injectConfig } from '../configs/AWSconfig';

const AWS = {config, Credentials, Config};

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

/* Debug only 
import Amplify from 'aws-amplify';
Amplify.Logger.LOG_LEVEL = 'DEBUG';
(window as any).LOG_LEVEL = 'DEBUG';
*/

// https://github.com/aws-amplify/amplify-js/issues/1487

const awsconfig = injectConfig(awsmobile);
// const IdentityPoolId = awsconfig.Auth.identityPoolId;

// console.log('IdentityPoolId', IdentityPoolId);

if (!AWS.config || !AWS.config.region) {
  AWS.config = new AWS.Config({ region: 'us-east-1' });
}

function getLoggger() {
  /* const logger: any = new ConsoleLogger('dtc_aws_log');
  logger.onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case 'signIn':
        logger.warn('user signed in'); // [ERROR] Alexander_the_auth_watcher - user signed in
        break;
      case 'signUp':
        logger.warn('user signed up');
        break;
      case 'signOut':
        logger.warn('user signed out');
        break;
      case 'signIn_failure':
        logger.warn('user sign in failed');
        break;
      case 'configured':
        // logger.warn('the Auth module is configured');
        break;
      default:
        break;
    }
  };
  return logger; */
}

export const LOGIN_EVENT = 'signIn';
export const LOGOUT_EVENT = 'signOut';

function onHubCapsule(cb: AwsCB, callbackPage: boolean = false, capsule: any) {
  console.log('onHubCapsule', capsule);
  // getLoggger().onHubCapsule(capsule);

  const { channel, payload } = capsule; // source
  if (channel !== 'auth') return;

  /// console.log('payload.event', channel, payload.event);
  if (payload.event === LOGOUT_EVENT) {
    console.log('cog logout');
    /// checkUser(cb);
    // return;
  }
  if (payload.event === LOGIN_EVENT) {
    //  || payload.event === 'cognitoHostedUI'
    console.log('onHubCapsule signIn', capsule);
    checkUser(cb, LOGIN_EVENT);
  } else if (payload.event === 'configured' && !callbackPage) checkUser(cb);
}

export function auth(cb: AwsCB, callbackPage: boolean = false) {
  // console.log('configuring aws');
  const awsmobileInjected = injectConfig(awsmobile);

  // Order is important
  Hub.listen(
    'auth',
    onHubCapsule.bind(null, cb, callbackPage)
    // { onHubCapsule: onHubCapsule.bind(null, cb, callbackPage) }
    // ,'AuthService'
  );
  Auth.configure(awsmobileInjected);
  // checkUser(cb); // required by amplify, for existing login

  // Configure APIService
  // console.log('awsmobileInjected', awsmobileInjected);
  API.configure(awsmobileInjected);
}

type AwsCB = (auth: AwsAuth | null) => void;
export interface AwsAuth {
  event: string;
  user: any;
  // username: string;
  region: string;
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
}

let cacheCred: any = null;
export async function refreshCredentials() {
  if (cacheCred) return cacheCred;
  // wait while another call is configuring
  if (cacheCred && !cacheCred.flag) {
    await delayFlag(cacheCred);
    return cacheCred;
  }
  cacheCred = { flag: false };

  const currentCredentials = await Auth.currentCredentials();
  const credentials = (cacheCred = Auth.essentialCredentials(
    currentCredentials
  ));

  AWS.config.credentials = new AWS.Credentials(credentials);
  AWS.config.update({
    credentials: new AWS.Credentials(credentials)
  });

  return {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    region: 'us-east-1'
  };
}

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function checkUser(cb: AwsCB, event: string = '') {
  let data: any;
  cacheCred = null; // clear apic cache, TODO: rework? check is token is still valid cache
  try {
    // console.time('currentAuthenticatedUser');
    data = await Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    // console.timeEnd('currentAuthenticatedUser');
  } catch (e) {
    // console.timeEnd('currentAuthenticatedUser');
    console.log(
      '---currentAuthenticatedUser not logged in, double checking',
      e
    );
    // await delay(1600);
    // console.time('currentAuthenticatedUser2');
    // data = await Auth.currentAuthenticatedUser().catch(e => {
    console.log('---currentAuthenticatedUser not logged in:', e);
    cb(null);
    return;
    //   return null;
    // });
    // console.timeEnd('currentAuthenticatedUser2');
    // if (!data) return;
    // else console.log('+++ currentAuthenticatedUser found on retry');
  }
  const user = data.attributes;

  //// AWS.config.credentials = new AWS.Credentials(credentials);
  // FIX: https://github.com/aws-amplify/amplify-js/issues/581
  AWS.config.update({
    dynamoDbCrc32: false
  });

  const authParams: any = {
    region: 'us-east-1',
    event: event || ''
  };
  if (!user.name || !user.email) {
    //  || !authParams.accessKeyId
    console.log('aws: no valid returned-');
    cb(null);
    return;
  }
  cb({
    user: { name: user.name, email: user.email, id: data.username },
    ...authParams
  });
}

// type EssentialCredentials = ReturnType<typeof Auth.essentialCredentials>;

export function logout() {
  // {global: true}
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

export async function guestLogin() {
  console.log('guestLogin');
  try {
    const user = await Auth.signIn('guest@dinnertable.chat', 'weallneed2talk'); // Guest
    console.log('user', user);
  } catch (err) {
    console.error('AuthServoce err', err.code, err);
    alert(
      'We encountered an error with guest login, going to try to fix it...'
    );
    window.location.reload(true);
  }
}

/*
if (err.code === 'UserNotConfirmedException') {
      // The error happens if the user didn't finish the confirmation step when signing up
      // In this case you need to resend the code and confirm the user
      // About how to resend the code and confirm the user, please check the signUp part
    } else if (err.code === 'PasswordResetRequiredException') {
      // The error happens when the password is reset in the Cognito console
      // In this case you need to call forgotPassword to reset the password
      // Please check the Forgot Password part.
    } else {
    }
*/
