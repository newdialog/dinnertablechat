import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Lottie from 'react-lottie';
import { observer } from 'mobx-react';
import { Typography, Divider } from '@material-ui/core';
import { inject } from 'mobx-react';
import hark, { SpeechEvent } from 'hark';
import Peer from 'simple-peer';
import DebateDisplay from './DebateDisplay';
import * as AppModel from '../../models/AppModel';
import PeerService from '../../services/PeerService';
import DebateError from './DebateError';

import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    centered2: {
      paddingTop: '0',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    }
  }));

interface Props {
  store: AppModel.Type;
  peer: PeerService;
}

interface State {
  talkingBlue: boolean;
  talkingRed: boolean;
  error?: string;
  // speaking:boolean
}

export default function DebateScene(props:Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  
  let peer: PeerService;
  let speechEvents: SpeechEvent;
  let speechSelfEvents: SpeechEvent;
  const vidRef = useRef<HTMLVideoElement>(null);

  const [state, setState] = useState<State>({ talkingBlue: false, talkingRed: false });

  useEffect(() => {
    gotMedia();

    window.gtag('event', 'debate_start', {
      event_category: 'debate',
      topic: props.store.debate.topic,
      position: props.store.debate.position,
      sameSide: props.store.debate.position === props.store.debate.match!.otherState!.position,
      guest: props.store.isGuest()
    });
    window.gtag('event', `debate_start_${props.store.debate.topic}_${props.store.debate.position}`, {
      event_category: 'debate',
      guest: props.store.isGuest()
    });
    /* navigator.getUserMedia(
    { video: false, audio: true },
    gotMedia.bind(this),
    () => {}
    );*/
    // stream: MediaStream
    return () => {
      console.log('debatescene unmounting');
      peer.destroy();
      speechSelfEvents!.stop();
    }
  }, []);

  const setupSelfVoice= () => {
    const options = {};
    speechSelfEvents = hark(peer.getLocalStream(), options);

    speechSelfEvents.on('speaking', () => {
      // console.log('speaking');
      setState({ ...state, talkingBlue: true });
      // document.querySelector('#speaking').textContent = 'YES';
    });

    speechSelfEvents.on('stopped_speaking', () => {
      // console.log('stopped_speaking');
      setState({ ...state, talkingBlue: false });
      // document.querySelector('#speaking').textContent = 'NO';
    });
  }

  const gotMedia = (stream?: MediaStream) => {
    setupSelfVoice();

    const isInit = false; // todo
    /* const p = new Peer({
      initiator: isInit,
      trickle: false,
      stream
    });*/
    const p = peer;

    p.on('error', err => {
      if (err.toString().indexOf('connection failed') !== -1) {
        setState({ ...state, error: 'other_disconnected' });
      } else {
        setState({ ...state, error: 'webrtc_error' });
      }
      console.log('error', err);
    });

    p.on('data', data => {
      console.log('data: ' + data);
    });

    p.onStream(stream2 => {
      console.log('stream found');
      // got remote video stream, now let's show it in a video tag
      /// var video = document.querySelector('video');
      const video = vidRef.current!;
      // video.src = window.URL.createObjectURL(stream2);
      try {
        video.srcObject = stream2;
      } catch (error) {
        video.src = URL.createObjectURL(stream2);
      }
      video.play();
      // video.autoPlay
      /// video.src = window.URL.createObjectURL(stream2);
      /// video.play();

      const options = {};
      speechEvents = hark(stream2, options);

      speechEvents.on('speaking', () => {
        // console.log('speaking');
        setState({ ...state, talkingRed: true });
        // document.querySelector('#speaking').textContent = 'YES';
      });

      speechEvents.on('stopped_speaking', () => {
        // console.log('stopped_speaking');
        setState({ ...state, talkingRed: false });
        // document.querySelector('#speaking').textContent = 'NO';
      });
    });

    // p.addStream(stream);
    console.log('addStream');
  };


    const { talkingBlue, talkingRed } = state;

    const blueChar = props.store.debate!.character;
    const redChar = props.store.debate!.match!.otherState!.character;

    return (
      <React.Fragment>
        {state.error && (
          <DebateError error={state.error} store={store} />
        )}
        <div className={classes.centered2}>
          <div>
            <div>Microphone is on</div>
            <div id="video" hidden={true}>
              <video ref={vidRef} autoPlay={true} />
            </div>
          </div>
          <DebateDisplay
            videoEl={vidRef}
            blueChar={blueChar}
            redChar={redChar}
            talkingBlue={talkingBlue}
            talkingRed={talkingRed}
            store={props.store}
          />
        </div>
      </React.Fragment>
    );
  }

/*

            <br />
            {talkingBlue && <div>Blue is Speaking, </div>}
            {talkingRed && <div>Red is Speaking</div>}
*/