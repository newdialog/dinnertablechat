import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useInterval from '@use-it/interval';
import * as AppModel from '../../models/AppModel';
import { Card, CardActions, CardHeader, CardContent, Typography } from '@material-ui/core';

const Transition = React.forwardRef(function Transition2(props: any, ref: any) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  onClose?: () => void;
}

export default function ConfWelcome(props: Props) {
  const [open, setOpen] = React.useState(true);
  const store = useContext(AppModel.Context)!;

  // TODO: clean this up
  // check if local development
  const prefix = window.location.href.includes('0/c') ? '/c/' : '';

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
          <img src="https://uploads-ssl.webflow.com/5d585c391e139837ab1d6f06/5d5c42616b9318501fed3028_logond2.png" height="40%" style={{margin:'-5% 0 -15%'}}/>
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
