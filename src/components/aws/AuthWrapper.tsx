// TODO HOOKS
import { Auth } from 'aws-amplify';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import MediaQuery from 'react-responsive';

import * as Store from '../../models/AppModel';
import * as AuthService from '../../services/AuthService';

// import { withOAuth } from 'aws-amplify-react';
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
  const store = props.store;
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

    localStorage.removeItem('signup');
    window.location.assign(url);
  };

  useEffect(() => {
    const path = (store.router.location as any).pathname;
    const callbackPage = path.indexOf('callback') !== -1;
    if (!init) {
      init = true;
      AuthService.auth(handleAuth, callbackPage);
    }
  }, []);

  const handleAuth = (awsUser: AuthService.AwsAuth | null) => {
    // console.log('handleAuth', props.login);
    const s = props.store;

    if (s.auth.user && s.auth.user.id) { // || s.isGuest()
      console.warn('stopping.. already logged in.');
      return; // not sure if needed
    }

    if (!awsUser) {
      console.log('+not logged in');
      // if(props.store.isStandalone()) signIn(); // MOBILE

      s.auth.notLoggedIn();
      // AuthService.guestLogin();
      return;
    }
    // console.log('+login, type:', awsUser.event);

    s.auth.authenticated(awsUser);
    if (awsUser.event === AuthService.LOGIN_EVENT) s.authenticated(true);
    /// else s.authenticated(false); // not sure if needed

    // TODO: cleanup guest login flow

    /* if(awsUser.event !== AuthService.LOGIN_EVENT) {
      if(props.store.isStandalone()) props.store.router.push('/home');
    } */
  };

  // console.log('props.store.auth.doLogin', props.store.auth.doLogin, props.login)
  if (props.login) {
    // props.login) {
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
