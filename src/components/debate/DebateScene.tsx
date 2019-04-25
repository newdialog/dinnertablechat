import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import hark, { SpeechEvent } from 'hark';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import PeerService from '../../services/PeerService';
import DebateDisplay from './DebateDisplay';
import DebateError from './DebateError';

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
  speechEvents?:SpeechEvent;
  speechSelfEvents?: SpeechEvent;
  // speaking:boolean
}

export default function DebateScene(props:Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const peer = props.peer;
  const vidRef = useRef<HTMLVideoElement>(null);

  const [state, setState] = useState<State>({ talkingBlue: false, talkingRed: false, });

  useEffect(() => {
    gotMedia();

    window.gtag('event', 'debate_start', {
      event_category: 'debate',
      topic: props.store.debate.topic,
      position: props.store.debate.position,
      sameSide: props.store.debate.position === props.store.debate.match!.otherState!.position,
      guest: props.store.isGuest()
    });
    return () => {
      console.log('debatescene unmounting');
      if(peer) peer!.destroy();
      if(state.speechSelfEvents) state.speechSelfEvents.stop();
    }
  }, []);

  const setupSelfVoice= () => {
    const options = {};
    const speechSelfEvents = hark(peer!.getLocalStream(), options);

    speechSelfEvents.on('speaking', () => {
      // console.log('speaking');
      setState(p => ({...p, talkingBlue: true }));
    });

    speechSelfEvents.on('stopped_speaking', () => {
      // console.log('stopped_speaking');
      setState(p => ({...p, talkingBlue: false }));
    });
    setState(p => ({...p, speechSelfEvents }));
  }

  const gotMedia = () => {
    setupSelfVoice();
    const p = peer!;

    p.on('error', err => {
      console.warn('peer error!', err);
      if (err.closed || err.toString().indexOf('connection failed') !== -1) {
        setState(s => ({...s, error: 'other_disconnected' }));
      } else {
        setState(s => ({...s, error: 'webrtc_error' }));
      }
      console.log('error', err);
    });

    p.on('data', data => {
      console.log('peer msg data: ' + data);
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
      const speechEvents = hark(stream2, options);

      speechEvents.on('speaking', () => {
        // console.log('speaking');
        setState(s => ({...s, talkingRed: true }));
        // document.querySelector('#speaking').textContent = 'YES';
      });

      speechEvents.on('stopped_speaking', () => {
        // console.log('stopped_speaking');
        setState(s => ({...s, talkingRed: false }));
        // document.querySelector('#speaking').textContent = 'NO';
      });
      
      setState(s => ({...s, speechEvents }));
    });

    // p.addStream(stream);
    console.log('addStream');
  };

    const { talkingBlue, talkingRed } = state;

    if(talkingBlue) {
      peer!.send('speaking');
    }

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