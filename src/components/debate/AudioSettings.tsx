// stub

import React from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme =>
  createStyles({
    root: {
      justifyContent: 'center'
    }
  });

interface Props extends WithStyles<typeof styles> {
  // error: string;
  // store: AppModel.Type,
  videoEl: HTMLMediaElement;
  onClose: () => void;
}

class AudioSettings extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
  };

  private handleClose = () => {
    this.setState({ anchorEl: null });
  };

  private attachSinkId = (element:HTMLMediaElement, sinkId:string) => {
      const _el:any = element;
    if (typeof _el.sinkId !== 'undefined') {
        _el.setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch(error => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
          // Jump back to first output device in the list as it's the default.
          // audioOutputSelect.selectedIndex = 0;
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  private gotDevices = (deviceInfos: MediaDeviceInfo[]) => {
    
    const speakers:any[] = [];
    const mics:any[] = [];
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      // deviceInfo.label
      const valueId = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        const label = deviceInfo.label || `microphone ${mics.length + 1}`;
        mics.push(label);
      } else if (deviceInfo.kind === 'audiooutput') {
        const label = deviceInfo.label || `speaker ${speakers.length + 1}`;
        speakers.push(label);
      } else if (deviceInfo.kind === 'videoinput') {
        // option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    selectors.forEach((select, selectorIndex) => {
      if (
        Array.prototype.slice
          .call(select.childNodes)
          .some(n => n.value === values[selectorIndex])
      ) {
        select.value = values[selectorIndex];
      }
    });
  };

  private handleError = () => {};

  public componentDidMount() {
    navigator.mediaDevices
      .enumerateDevices()
      .then(this.gotDevices)
      .catch(this.handleError);
  }

  public render() {
    const { classes, onClose } = this.props;
    const { anchorEl, options } = this.state;

    return (
      <Dialog
        open={true}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Audio Settings'}</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <List component="nav">
              <ListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                aria-label="When device is locked"
                onClick={this.handleClickListItem}
              >
                <ListItemText
                  primary="When device is locked"
                  secondary={options[this.state.selectedIndex]}
                />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={option}
                  disabled={index === 0}
                  selected={index === this.state.selectedIndex}
                  onClick={event => this.handleMenuItemClick(event, index)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default HOC(AudioSettings, styles);
