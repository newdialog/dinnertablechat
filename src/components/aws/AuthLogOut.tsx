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
export default observer(function AuthLogOut(props: Props) {
  const store = useContext(AppModel.Context)!;
  // let [refresh, setRefresh] = useState(false);

  useEffectOnce( () => {
    refresh = false;
    /* return () => { 
      refresh = false;
    } */
  })

  const redirect = () => {
    if(refresh) return;
    refresh = true;

    let redirectTo = localStorage.getItem('logoutTo');
    console.warn('redirectTo', redirectTo);

    if (redirectTo && redirectTo.indexOf('/callback') > -1) {
      const getRoot = () => {
        if (window.location.href.indexOf('000/') > -1) return '/c/';
        else return '/';
      };
      redirectTo = getRoot();
    }

    if (redirectTo) {
      localStorage.removeItem('logoutTo');
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
    //  || store.auth.isAuthenticated()
    if (refresh) return;
    if(window.gtag) window.gtag('event', 'logged_out_finished', {
      event_category: 'auth'
    });

    console.log('logged out finished');

    // alow keep it around in case of back btn
    redirect();
  }, [store.auth.user]);
  
  // Shouldnt happen
  useTimeoutFn(() => {
    console.warn('auth: forcing redirect due to timeout');
    redirect();
  }, 24000);

  return (
    <React.Fragment>
      <br />
      <br />
      <br />
      <Typography variant="h3" align="center" style={{ color: '#555555' }}>
        Signing out...
      </Typography>
    </React.Fragment>
  );
});
