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
  'timeout': 'Our service timed out. Please try again.',
  'expired_login': 'Our service timed out. Please try again.',
  'qerror': 'Something went wrong with the Queue!',
  'other_disconnected': 'Player disconnected.',
  'webrtc_error': 'Misc error: Webrtc connection failed',
}

class DebateError extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = { };
  }

  private handleClose = () => {
    this.setState({ open: false });
    this.props.store.debate.resetQueue();
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
              {errorMsg}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              RESTART
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}
export default HOC(DebateError, styles);
