// TODO HOOKS
import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';

import * as Store from '../../models/AppModel';
import { observer } from 'mobx-react-lite';
import * as AuthService from '../../services/AuthService';
// import { withOAuth } from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';
import MediaQuery from 'react-responsive';

interface Props {
  store: Store.Type;
  login: boolean;
  children?: any;
}

let init = false;

interface State {
  init: boolean;
}

//
function AuthComp(props: Props) {
  // Auth/Provider/withOAuth.jsx
  const signIn = () => {
    if (!Auth || typeof Auth.configure !== 'function') {
      throw new Error(
        'No Auth module found, please ensure @aws-amplify/auth is imported'
      );
    }

    const config = (Auth.configure(null) as any).oauth;
    console.log('withOAuth configuration', config);

    const { domain, redirectSignIn, redirectSignOut, responseType } = config;

    // const options = config.options || {};
    const url =
      'https://' +
      domain +
      '/signup?redirect_uri=' +
      redirectSignIn +
      '&response_type=' +
      responseType +
      '&client_id=' +
      (Auth.configure(null) as any).userPoolWebClientId;
    window.location.assign(url);
  };

  useEffect(() => {
    // const props: any = props; // required for OAuthSignIn
    // const { init } = state;
    if (!init) {
      init = true;
      AuthService.auth(handleAuth);
    }
  }, []);

  const handleAuth = (awsUser: AuthService.AwsAuth | null) => {
    const s = props.store;
    if (!awsUser) {
      console.log('+not logged in');
      // if(props.store.isStandalone()) signIn(); // MOBILE

      s.auth.notLoggedIn();
      // AuthService.guestLogin();
      return;
    }
    console.log('+logged in');
    // console.log('handleAuth', awsUser)
    s.auth.authenticated(awsUser);

    // TODO: cleanup guest login flow
    if (
      awsUser.user.email === 'guest@dinnertable.chat' &&
      s.isGuest() &&
      awsUser.event === AuthService.LOGIN_EVENT
    )
      if (props.store.isStandalone()) s.router.push('/home');
      else {
        if (localStorage.getItem('quickmatch')) s.router.push('/quickmatch');
        else s.router.push('/tutorial');
      }
    /* if(awsUser.event !== AuthService.LOGIN_EVENT) {
      if(props.store.isStandalone()) props.store.router.push('/home');
    } */
  };

  /// console.time('AuthComp');

  if (props.login) {
    // props.OAuthSignIn()
    signIn();
  }

  return (
    <React.Fragment>
      {props.children}
      <MediaQuery query="(display-mode: standalone)">
        {matches => {
          if (matches && !props.store.isStandalone())
            props.store.setStandalone();
          // if(matches) return <p>p1</p>
          // else return <p>w1</p>
          return null;
        }}
      </MediaQuery>
    </React.Fragment>
  );
}

export default observer(AuthComp);
// withOAuth
