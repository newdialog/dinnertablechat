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

import InputLabel, { InputLabelProps } from '@material-ui/core/InputLabel';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme =>
  createStyles({
    root: {
      justifyContent: 'center',
      display: 'flex'
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2
    },
    group: {
      margin: `${theme.spacing.unit}px 0`
    },
    label: {
      fontSize: '0.8em'
    }
  });

interface Props extends WithStyles<typeof styles> {
  // error: string;
  // store: AppModel.Type,
  videoEl: React.RefObject<HTMLMediaElement>;
  onClose: () => void;
}

class AudioSettings extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      options: ['loading..'],
      anchorEl: null,
      mics: [],
      speakers: []
    };
  }

  private attachSinkId = (element: HTMLMediaElement, sinkId: string) => {
    const _el: any = element; // setSinkId not offically on HTMLMediaElement
    if (typeof _el.sinkId !== 'undefined') {
      _el
        .setSinkId(sinkId)
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
  };

  private gotDevices = (deviceInfos: MediaDeviceInfo[]) => {
    console.log('deviceInfos', deviceInfos);
    const speakers: any[] = [];
    const mics: any[] = [];
    const defaultVal:any = { mic:null, speaker: null};
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      // deviceInfo.label
      const valueId = deviceInfo.deviceId;
      const isDefault = deviceInfo.label.indexOf('Default') === 0;
     

      if (deviceInfo.kind === 'audioinput') {
        if(isDefault) defaultVal.mic = deviceInfo.deviceId;
        const label = deviceInfo.label || `microphone ${mics.length + 1}`;
        
        mics.push({ label, deviceId:  deviceInfo.deviceId} );
      } else if (deviceInfo.kind === 'audiooutput') {
        if(isDefault) defaultVal.speaker = deviceInfo.deviceId;
        const label = deviceInfo.label || `speaker ${speakers.length + 1}`;
        speakers.push({ label, deviceId:  deviceInfo.deviceId} );
      } else if (deviceInfo.kind === 'videoinput') {
        // option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    this.setState({ speakers, mics, mic: defaultVal.mic, speaker: defaultVal.speaker  });
  };

  private handleError = () => {};

  private handleChangeMic = (e: React.ChangeEvent<{}>, val:string) => {
    e.preventDefault();
    const deviceId = val; // e.target.value;
    console.log(deviceId);
    this.attachSinkId(this.props.videoEl.current!, deviceId);
    this.setState({ mic: deviceId });
  };

  private handleChangePlayback = (e: React.ChangeEvent<{}>, val:string) => {
    e.preventDefault();
    const deviceId = val;
    console.log(deviceId);
    this.attachSinkId(this.props.videoEl.current!, deviceId);
    this.setState({ speaker: deviceId });
  };

  public componentDidMount() {
    navigator.mediaDevices
      .enumerateDevices()
      .then(this.gotDevices)
      .catch(this.handleError);
  }

  private micRef = React.createRef<InputLabelProps>();

  public render() {
    const { classes, onClose, videoEl } = this.props;
    const { anchorEl, options } = this.state;

    return (
      <Dialog
        open={true}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">{'Audio Settings'}</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Mic</FormLabel>
              <RadioGroup
                aria-label="Gender"
                name="gender1"
                className={classes.group}
                value={this.state.mic}
                onChange={this.handleChangeMic}
              >
                {this.state.mics.map((x: {label:string, deviceId:string}) => (
                  <FormControlLabel
                    key={x.deviceId}
                    className={classes.label}
                    value={x.deviceId}
                    control={<Radio />}
                    label={x.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Playback</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender2"
                className={classes.group}
                value={this.state.speaker}
                onChange={this.handleChangePlayback}
              >
                {this.state.speakers.map((x: {label:string, deviceId:string}) => (
                  <FormControlLabel
                    key={x.deviceId}
                    className={classes.label}
                    value={x.deviceId}
                    control={<Radio />}
                    label={x.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" autoFocus>
            CLOSE MENU
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default HOC(AudioSettings, styles, true);
