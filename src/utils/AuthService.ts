import awsmobile from '../aws-exports.js';

import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';

// import { withOAuth } from 'aws-amplify-react';

// const config = Auth.configure(awsmobile) as any;
// console.log('config', config.oauth);
/*
Auth.currentSession()
  .then(data => {
    console.log('currentSession---', data);
  })
  .catch((e: any) => {
    console.log('--currentSession err:', e);
  });
*/

function onHubCapsule(cb: AwsCB, capsule: any) {
  const { channel, payload } = capsule; // source
  Auth.currentSession()
    .then(data => {
      console.log('+++currentSession2', data);
    })
    .catch((e: any) => {
      console.log('---currentSession2 err:', e);
    });

  console.log('payload.event ', channel, payload.event);
  if (channel === 'auth' && payload.event === 'signIn') {
    checkUser(cb);
  } else if (channel === 'auth' && (payload.event === 'configured' || payload.event === 'cognitoHostedUI')) {
    checkUser(cb);
  }
}

export function auth(cb: AwsCB) {
  console.log('configuring aws');
  Auth.configure(awsmobile);
  Hub.listen('auth', { onHubCapsule: onHubCapsule.bind(null, cb) });
}

type AwsCB = (auth: AwsAuth) => void;
export interface AwsAuth {
  user: any;
  username: string;
}

function checkUser(cb: AwsCB) {
  return Auth.currentAuthenticatedUser()
    .then(data => {
      console.log('+++currentAuthenticatedUser', data);
      cb({
        user: { ...data.attributes, username: data.username },
        username: data.username
      });
      // that.setState({ user: { ...data.attributes, username: data.username }, loggedIn: true });
    })
    .catch((e: any) => {
      console.log('---currentAuthenticatedUser err:', e);
    });
}
// <button onClick={this.props.OAuthSignIn}>Sign in with AWS</button>
// export default withOAuth(AWSApp);
// export const auth = authCall;
