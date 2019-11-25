/* tslint:disable:no-bitwise */
import awsmobile from '../aws-exports.js';
import 'aws-sdk/lib/node_loader'; // first time only

// import Core from 'aws-sdk/lib/core';
import AWS from 'aws-sdk/global';

// import Auth from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import * as API from './APIService'; // TODO refactor

import retry from 'async-retry';
// import { Logger } from 'aws-amplify';
import { Hub } from 'aws-amplify';
import { injectConfig } from '../configs/AWSconfig';

// Fix analytics error message
import { Analytics } from 'aws-amplify';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

Analytics.configure({ disabled: true });

// (window as any).LOG_LEVEL = 'DEBUG';
// import { ConsoleLogger } from '@aws-amplify/core';

/*
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
*/

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

/*
function getLoggger() {
  const logger: any = new ConsoleLogger('dtc_aws_log');
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
  return logger;
}
*/

export const LOGIN_EVENT = 'signIn';
export const LOGOUT_EVENT = 'signOut';

function onHubCapsule(cb: AwsCB, callbackPage: boolean = false, capsule: any) {
  // console.log('onHubCapsule', capsule);
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
    // console.log('onHubCapsule signIn', capsule);
    checkUser(cb, LOGIN_EVENT);
  } else if (payload.event === 'configured' && !callbackPage) checkUser(cb);
}

export async function configure() {
  Auth.configure(awsconfig);
}

export async function auth(cb: AwsCB, callbackPage: boolean = false) {
  // console.log('auth aws');
  // const awsmobileInjected = injectConfig(awsmobile);

  // Order is important
  Hub.listen(/.*/, x => {
    // console.log('hubevent:', x);
  });
  Hub.listen(
    'auth',
    x => {
      onHubCapsule.bind(null, cb, callbackPage)(x);
    }
    // { onHubCapsule: onHubCapsule.bind(null, cb, callbackPage) }
    // ,'AuthService'
  );

  configure();
  // checkUser(cb); // required by amplify, for existing login

  // Configure APIService
  // console.log('awsmobileInjected', awsmobileInjected);
  try {
    const credentials = await refreshCredentials();
    API.configure({ ...awsconfig, Auth: credentials, credentials });
  } catch (e) {
    console.log('cannot figure API', e);
  }
}

type AwsCB = (auth: AwsAuth | null) => void;

export interface AwsAuth {
  // event: string;
  // user: any;
  name: string;
  email: string;
  groups: string[];
  id: string;
  event: string;
  // username: string;
  // region: string;
  // AccessKeyId: string;
  // SecretAccessKey: string;
  // SessionToken: string;
  userPoolId?: string;
}

const REGION = 'us-east-1';

// reuse last call
type Creds = { expired: boolean; refreshed: boolean } | any;
let credRefresh: Promise<any> | null;
let lastCred: Creds;

export async function refreshCredentials(): Promise<Creds> {
  if (lastCred && lastCred.expired === false) {
    return Promise.resolve(lastCred).then((x: Creds) => {
      x.refreshed = false;
      return x;
    });
  }
  // if(credRefresh) return credRefresh;
  // else credRefresh = new Promise()
  // ICredentials |
  // if (cacheCred) return cacheCred;
  // wait while another call is configuring
  /*
  if (cacheCred && !cacheCred.flag) {
    await delayFlag(cacheCred);
    return cacheCred;
  }
  */
  // cacheCred = { flag: false };

  if (credRefresh) return credRefresh;

  return (credRefresh = Auth.currentUserCredentials().then(
    currentCredentials => {
      // const currentCredentials = await credRefresh;
      credRefresh = null;
      // console.log('currentCredentials', currentCredentials);
      // const currentCredentials2 = await Auth.currentCredentials();
      // console.log('currentCredentials2', currentCredentials2);

      const cr = currentCredentials as any;
      if (!cr) throw new Error('not logged in');
      cr.region = REGION;
      /* const credentials = (cacheCred = Auth.essentialCredentials(
    currentCredentials
  )); */

      // console.log(cr);
      const params = cr.webIdentityCredentials
        ? cr.webIdentityCredentials.params
        : null;

      if (!params) {
        // console.log('cr', cr);
        throw new Error('no cred: ' + cr);
      }

      if (!cr._identityId && params && params.IdentityId)
        cr._identityId = params.IdentityId;

      if (!cr.identityId && params && params.IdentityId)
        cr.identityId = params.IdentityId;

      // console.log('currentCredentials', params);

      if (cr.webIdentityCredentials) {
        AWS.config.credentials = cr; //new AWS.CognitoIdentityCredentials(params);
      }
      /* AWS.config.update({
    credentials: new AWS.Credentials(credentials)
  });*/
      // console.log('refreshCredentials', credentials);

      lastCred = currentCredentials as Creds;

      lastCred.refreshed = true;
      if (lastCred.expired === undefined)
        throw new Error(
          'no expired prop on cred: ' + JSON.stringify(currentCredentials)
        );
      return currentCredentials;
    }
  ));
}

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function checkUser(cb: AwsCB, event: string = '') {
  // console.log('checkUser');
  // let data: any;
  let session: CognitoUserSession | null = null;
  let cr: any = null;
  // cacheCred = null; // clear apic cache, TODO: rework? check is token is still valid cache
  try {
    cr = await refreshCredentials(); //Auth.currentUserCredentials();
  } catch (e) {
    console.log('-currentUserCredentials', e);
  }

  try {
    session = await Auth.currentSession();
  } catch (e) {
    console.log('-currentSession', e);
  }

  // const idenity = cr.identityId;
  // console.log('rrrr', cr, idenity);

  // console.log('session', session);

  let email: string = '';
  let name: string = '';
  let groups: string[] = [];
  let id: string = '';
  let debugSource = 'session';
  let debugObj: any = null;
  let userPoolId: any = null; // versus identity

  if (session) {
    // console.log('session', session);

    email = session.getIdToken().payload['email'];
    name = session.getIdToken().payload['name'];
    groups = session.getIdToken().payload['cognito:groups'];

    id = cr.identityId;
    userPoolId = session.getIdToken().payload['sub'];
  } else if (cr) {
    // console.log('unauth user', cr);
    // const newCred = await refreshCredentials(); // needed for dynamo labs
    // console.log('newCred', newCred);
    id = cr.identityId; // newCred.identityId;
    name = 'Guest';
    email = 'guest@dinnertable.chat';
    debugSource = 'cr.identityId';
    debugObj = cr.identityId;
  } else {
    cb(null);
    return;
  }

  // const email = session.getIdToken().payload['email'] || '';
  // const sub = session.getIdToken().payload['sub']; // || uuidv4();
  // const name = session.getIdToken().payload['name'] || 'Guest';
  // const groups = session.getIdToken().payload['cognito:groups'];

  if (!id) {
    throw new Error('checkuser: no id');
  }

  const authParams: any = {
    region: 'us-east-1',
    event: event || ''
  };

  const user: AwsAuth = {
    name,
    email,
    id, // data.username,
    groups,
    ...authParams
  };
  if (userPoolId) user.userPoolId = userPoolId;

  // const user = data.attributes;

  // console.log('user', user);

  //// AWS.config.credentials = new AWS.Credentials(credentials);
  // FIX: https://github.com/aws-amplify/amplify-js/issues/581
  AWS.config.update({
    dynamoDbCrc32: false
  });

  if (!user.name || !user.email) {
    //  || !authParams.accessKeyId
    console.log('aws: no valid returned-');
    cb(null);
    return;
  }

  cb(user);
}

// type EssentialCredentials = ReturnType<typeof Auth.essentialCredentials>;

export function logout() {
  // {global: true}
  return Auth.signOut({ global: false })
    .then(x => {
      // remove auth tokens
      lastCred = null;
      credRefresh = null;
      console.log('logout', x);
      return x;
    })
    .catch((err: any) => {
      console.log('Error logging out: ' + err);
      return null;
    });
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
