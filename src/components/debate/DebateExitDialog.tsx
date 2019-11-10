import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  open: boolean;
  onExit: () => void;
  onCancel: () => void;
}

class DebateExitDialog extends React.Component<Props, any> {
  state = {
    open: false
  };

  handleExit = () => {
    if(window.gtag) window.gtag('event', 'user_dialog_end', {
      event_category: 'debate'
    });
    this.props.onExit();
    // this.setState({ open: true });
  };

  handleClose = () => {
    this.props.onCancel();
    // this.setState({ open: false });
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            Are you sure you want to exit?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
             This will end the debate and move to the debate review page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Resume Debate
          </Button>
          <Button onClick={this.handleExit} color="primary" autoFocus>
            Exit Debate
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DebateExitDialog;
