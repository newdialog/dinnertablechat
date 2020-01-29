import { Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState, useEffect } from 'react';
import { useTimeoutFn, useEffectOnce } from 'react-use';

import * as AppModel from '../../models/AppModel';

interface Props {
  login: boolean;
}

//
let refresh = false;
export default observer(function AuthSignin(props: Props) {
  // const [refresh, setRefresh] = useState(false);
  const store = useContext(AppModel.Context)!;
  // let [refresh, setRefresh] = useState(false);

  useEffectOnce( () => {
    refresh = false;
    /* return () => { 
      refresh = false;
    } */
  })

  const redirect = () => {
    // if(refresh) return;
    // refresh = true;

    // Never was authenticated
    //  || store.isGuest()
    if(!store.auth.isAuthenticated()) {
      // alert('Error authenticating- retrying');

      // in case login is not working
      setTimeout(()=>{
        console.warn('full authentication failure- going back to root');
        window.location.assign(store.getRoot())
      }, 6000);

      // try logging in again?
      console.warn('semi authentication failure- trying to re-login');
      store.auth.login( localStorage.getItem('loginTo') || undefined );
      return;
    }

    let redirectTo = localStorage.getItem('loginTo');

    if (redirectTo && redirectTo.indexOf('/callback') > -1) {
      const getRoot = () => {
        if (window.location.href.indexOf('000/') > -1) return '/c/';
        else return '/';
      };
      redirectTo = getRoot();
    }

    if (redirectTo) {
      localStorage.removeItem('loginTo');
      console.warn('redirectTo', redirectTo);
      // if(redirectTo.charAt(0)==='/') store.router.push(redirectTo);
      window.location.assign(redirectTo); // needs to be assign
      return;
    }
    
    const rootURL = store.getRoot();
    console.warn('no redirectTo', rootURL);
    window.location.assign(rootURL);
    // store.router.push('/');
  }

  useEffect(() => {
    if (refresh || !store.auth.isAuthenticated()) return;
    if(window.gtag) window.gtag('event', 'logged_in', {
      event_category: 'auth'
    });

    console.log('isAuthenticated');

    // alow keep it around in case of back btn
    redirect();
  }, [store.auth.user]);
  
  useTimeoutFn(() => {
    if (refresh || !store.auth.isAuthenticated()) return;
    console.warn('auth: forcing redirect due to timeout');
    redirect();
  }, 24000);

  return (
    <React.Fragment>
      <br />
      <br />
      <br />
      <Typography variant="h3" align="center" style={{ color: '#555555' }}>
        Signing in...
      </Typography>
    </React.Fragment>
  );
});
