import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import * as AppModel from '../../models/AppModel';

import InputLabel, { InputLabelProps } from '@material-ui/core/InputLabel';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
}));

interface Props {
  videoEl: React.RefObject<HTMLMediaElement>;
  fullScreen?: boolean;
  onClose: () => void;
}

function AudioSettings(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = useState<any>({
    selectedIndex: 0,
    options: ['loading..'],
    anchorEl: null,
    mics: [],
    speakers: [],
    mic: '',
    speaker: ''
  });

  const attachSinkId = (element: HTMLMediaElement, sinkId: string) => {
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

  const gotDevices = (deviceInfos: MediaDeviceInfo[]) => {
    // console.log('deviceInfos', deviceInfos);
    const speakers: any[] = [];
    const mics: any[] = [];
    const defaultVal: any = { mic: null, speaker: null };
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      // deviceInfo.label
      const valueId = deviceInfo.deviceId;
      const isDefault = deviceInfo.label.indexOf('Default') === 0;

      if (deviceInfo.kind === 'audioinput') {
        if (isDefault) defaultVal.mic = deviceInfo.deviceId;
        const label = deviceInfo.label || `microphone ${mics.length + 1}`;

        mics.push({ label, deviceId: deviceInfo.deviceId });
      } else if (deviceInfo.kind === 'audiooutput') {
        if (isDefault) defaultVal.speaker = deviceInfo.deviceId;
        const label = deviceInfo.label || `speaker ${speakers.length + 1}`;
        speakers.push({ label, deviceId: deviceInfo.deviceId });
      } else if (deviceInfo.kind === 'videoinput') {
        // option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      } else {
        console.log('Some other kind of source/device: ', deviceInfo);
      }
    }
    setState(p => ({
      ...p,
      speakers,
      mics,
      mic: defaultVal.mic,
      speaker: defaultVal.speaker
    }));
  };

  const handleError = () => {};

  const handleChangeMic = (e: React.ChangeEvent<{}>, val: string) => {
    e.preventDefault();
    const deviceId = val; // e.target.value;
    console.log(deviceId);
    attachSinkId(props.videoEl.current!, deviceId);
    setState(p => ({...p, mic: deviceId }));
  };

  const handleChangePlayback = (e: React.ChangeEvent<{}>, val: string) => {
    e.preventDefault();
    const deviceId = val;
    console.log(deviceId);
    attachSinkId(props.videoEl.current!, deviceId);
    setState(p => ({...p, speaker: deviceId }));
  };

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices)
      .catch(handleError);
  }, []);

  const micRef = useRef<InputLabelProps>(null);

  const { onClose } = props; // , videoEl
  const { anchorEl, options } = state;
  const { fullScreen } = props;

  return (
    <Dialog
      open={true}
      fullScreen={fullScreen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">{'Audio Settings'}</DialogTitle>
      <DialogContent>
        <div className={classes.root}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="mics">Mic</InputLabel>
            <br />
            <RadioGroup
              id="mics"
              aria-label="Mics"
              name="mics"
              className={classes.group}
              value={state.mic}
              onChange={handleChangeMic}
            >
              {state.mics.map((x: { label: string; deviceId: string }) => (
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
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="playback">Playback</InputLabel>
            <br />
            <RadioGroup
              id="playback"
              aria-label="playback"
              name="playback"
              className={classes.group}
              value={state.speaker}
              onChange={handleChangePlayback}
            >
              {state.speakers.map((x: { label: string; deviceId: string }) => (
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
export default withMobileDialog<Props>()(AudioSettings);
