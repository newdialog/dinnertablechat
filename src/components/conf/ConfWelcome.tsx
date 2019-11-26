import { Card, CardActions, CardContent, CardHeader, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useContext } from 'react';

import * as AppModel from '../../models/AppModel';

interface Props {
  onClose?: () => void;
}

export default function ConfWelcome(props: Props) {
  // const [open, setOpen] = React.useState(true);
  const store = useContext(AppModel.Context)!;

  const prefix = store.getRoot();

  const handleClose = () => {
    store.auth.login(prefix + 'admin');
  };

  const handleReg = () => {
    store.auth.signUp(prefix + 'admin');
  };

  return (
    <div>
      <Card>
        <CardHeader color="secondaryText" title={'Getting Started'} id="alert-dialog-slide-title"></CardHeader>
        <CardContent style={{ textAlign: 'center' }}>
          <Typography variant="h2" style={{ fontSize: '1em' }}>
            Please login to create or edit events to host. If you're here attending an event, double check the event URL.
          </Typography>
          <br/><br/>
          
        </CardContent>
        <CardActions style={{textAlign:'center', margin: '0 auto'}}>
          <div style={{textAlign:'center', margin: '0 auto'}}>
            <Button variant="contained" color="secondary" onClick={handleClose}>Login</Button>
            <Button variant="contained" color="secondary" onClick={handleReg} style={{marginLeft:'1.5em'}}>Register</Button>
            <br/><br/>
            <Typography variant="body1" style={{ fontSize: '1em' }}>
              Learn more about us at <a href="https://www.newdialogue.org">our homepage</a>.
           </Typography>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
