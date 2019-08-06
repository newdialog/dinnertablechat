import { Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useContext, useState, useEffect } from 'react';

import * as AppModel from '../../models/AppModel';
import useInterval from '@use-it/interval';

interface Props {
  login: boolean;
}

//
export default observer(function AuthSignin(props: Props) {
  const store = useContext(AppModel.Context)!;
  let [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (refresh || !store.auth.isAuthenticated()) return;
    window.gtag('event', 'logged_in', {
      event_category: 'auth'
    });

    // alow keep it around in case of back btn
    const redirectTo = localStorage.getItem('loginTo'); 
    if (redirectTo) {
      // console.log('redirectTo', redirectTo);
      // localStorage.removeItem('loginTo');
      if(redirectTo.charAt(0)==='/') store.router.push(redirectTo);
      else window.location.assign(redirectTo); // needs to be assign
      setRefresh(true);
      return;
    }
    console.log('no redirectTo', redirectTo);
    store.router.push('/');
    setRefresh(true);
    
  }, [store.auth, store.auth.user]);

  useInterval(() => {
    // failsafe
    if (!refresh) store.router.push('/');
  }, 10000);

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
