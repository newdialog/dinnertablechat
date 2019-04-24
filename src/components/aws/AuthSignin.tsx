import React, { useState, useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { Typography } from '@material-ui/core';
import * as AppModel from '../../models/AppModel';
interface Props {
  login: boolean;
}

//
export default observer(function AuthSignin(props: Props) {
  const store = useContext(AppModel.Context)!;
  let [refresh, setRefresh] = useState(false);

  if (!refresh && store.auth.isAuthenticated()) {
    window.gtag('event', 'logged_in', {
      event_category: 'auth'
    });

    setRefresh(true);
  }
  
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
