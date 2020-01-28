// TODO HOOKS
import Auth from '@aws-amplify/auth';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import MediaQuery from 'react-responsive';

import * as Store from '../../models/AppModel';
import * as AuthService from '../../services/AuthService';

interface Props {
  store: Store.Type;
  login: number;
  children?: any;
}

// let init = false;

interface State {
  init: boolean;
}

export const signIn = () => {
  AuthService.clearCache();
  
  window.sessionStorage.removeItem('oauth_state'); // possible patch Invalid state in OAuth flow #3055
  
  // const config = (Auth.configure(null) as any).oauth;
  // console.log('withOAuth configuration', config);

  // const { domain, redirectSignIn, redirectSignOut, responseType } = config;

  localStorage.removeItem('signup');
  Auth.federatedSignIn();
};

export const signUp = () => {
  const config = (Auth.configure(null) as any).oauth;
  // console.log('withOAuth configuration', config);
  const { domain, redirectSignIn, redirectSignOut, responseType } = config;

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
}

//
function AuthComp(props: Props) {
  const store = props.store;
  const s = props.store;
  // console.log('authwrapper: AuthComp');
  // Auth/Provider/withOAuth.jsx

  // console.log('AuthComp');
  useEffect(() => {
    if (store.auth.isAuthenticated() && !store.isGuest()) {
      console.warn('authwrapper: stopping.. already logged in.');
      return; // not sure if needed
    }
    // init = true;
    const path = (store.router.location as any).pathname;
    const callbackPage = path.indexOf('callback') !== -1;
    AuthService.auth(handleAuth, callbackPage);
  }, [store.auth.doLogin]);

  useEffect( () => {
    if(!store.auth.doLogout) return; //  || !store.auth.user
    
    AuthService.logout().then( () => {
      store.auth.logoutFinished();
    });
  }, [store.auth.doLogout]);

  

  const handleAuth = (awsUser: AuthService.AwsAuth | null) => {
    // console.log('handleAuth', props.login);

    if (s.auth.user && s.auth.user.id) { // || s.isGuest()
      /// console.warn('stopping.. already logged in.');
      return; // not sure if needed
    }

    if (!awsUser) {
      console.log('authwrapper: +not logged in');
      // if(props.store.isStandalone()) signIn(); // MOBILE

      s.auth.notLoggedIn();
      // AuthService.guestLogin();
      return;
    }
    // console.log('+login, type:', awsUser.event);

    const viaLogin = awsUser.event === AuthService.LOGIN_EVENT;
    s.auth.authenticated(awsUser!, viaLogin);
    if (viaLogin) s.authenticated();
    
  };

  // console.log('props.store.auth.doLogin', props.store.auth.doLogin, props.login)
  // console.log('props.login', props.login);
  if (props.login===1) {
    // props.login) {
    // props.OAuthSignIn()
    signIn();
  } else if(props.login===2) {
    signUp();
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
