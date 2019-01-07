// stub

import React from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import {
  createStyles,
  WithStyles
} from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';

const styles = theme =>
  createStyles({
    root: {
      justifyContent: 'center'
    }
  });

interface Props extends WithStyles<typeof styles> {
    error: string,
    store: AppModel.Type
}

const errors = {
  'matchtimeout': 'Sorry, no matches were found...',
  'timeout': 'Our service timed out. Please try again.',
  'expired_login': 'Our service timed out. Please try again.',
  'qerror': 'Something went wrong with the Queue :/',
  'other_disconnected': 'Player disconnected.',
  'webrtc_error': 'Misc error: Webrtc connection failed',
  'handshake_timeout': 'Handshake with match timed out',
  'handshake_error': 'Misc error with match handshake',
  'mic_timeout': 'Failed to activate browser mic. Check browser settings.',
  'CANCELLED': 'There seems to be a duplicate of the same user in the match.'
}

class DebateError extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = { };
  }

  private handleClose = () => {
    this.setState({ open: false });
    this.props.store.debate.resetQueue();
    // this.props.store.router.push('/home');
    window.location.reload(true);
  };
  
  public render() {
    const { classes } = this.props;
    
    console.log('this.props.error', this.props.error);

    const err = this.props.error;
    const errorMsg = errors[err] || ('Misc error: ' + err);

    return (
        <Dialog
          open={true}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Oh no!'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <i>{errorMsg}</i>
              <br/><br/>
              Please try again in a few minutes :)
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary" autoFocus>
              RESTART
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}
export default HOC(DebateError, styles);
