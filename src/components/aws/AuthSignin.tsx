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
    if (!refresh && store.auth.isAuthenticated()) {
      window.gtag('event', 'logged_in', {
        event_category: 'auth'
      });

      const redirectTo = localStorage.getItem('loginTo');
      if (redirectTo) {
        setRefresh(true);
        localStorage.getItem('loginTo');
        store.router.push(redirectTo);
      }
    }
  }, [store.auth, store.auth.user]);

  useInterval(() => {
    // failsafe
    if (!refresh) store.router.push('/');
  }, 12000);

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
