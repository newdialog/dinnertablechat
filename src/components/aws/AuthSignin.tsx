import { Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState, useEffect } from 'react';
import { useTimeoutFn } from 'react-use';

import * as AppModel from '../../models/AppModel';

interface Props {
  login: boolean;
}

//
export default observer(function AuthSignin(props: Props) {
  const store = useContext(AppModel.Context)!;
  let [refresh, setRefresh] = useState(false);

  const redirect = () => {
    if(refresh) return;

    if(!store.auth.isAuthenticated()) {
      alert('Error authenticating- retrying');
      store.auth.login( localStorage.getItem('loginTo') || undefined );
      // window.location.reload(true);
    }

    const redirectTo = localStorage.getItem('loginTo'); 
    localStorage.removeItem('loginTo');

    if (redirectTo) {
      // localStorage.removeItem('loginTo');
      if(redirectTo.charAt(0)==='/') store.router.push(redirectTo);
      else window.location.assign(redirectTo); // needs to be assign
      setRefresh(true);
      return;
    }
    console.log('no redirectTo', redirectTo);
    store.router.push('/');
    setRefresh(true);
  }

  useEffect(() => {
    if (refresh || !store.auth.isAuthenticated()) return;
    window.gtag('event', 'logged_in', {
      event_category: 'auth'
    });

    // alow keep it around in case of back btn
    redirect();
  }, [store.auth, store.auth.user]);
  
  useTimeoutFn(() => redirect(), 5000);

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
