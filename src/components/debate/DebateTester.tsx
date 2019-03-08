import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import hark, { SpeechEvent } from 'hark';
import { Typography, Divider, Button } from '@material-ui/core';
import getMedia from '../../utils/getMedia';
import DebateDisplay from './DebateDisplay';
import * as AppModel from '../../models/AppModel';
import HOC, {Authed} from '../HOC';
import { inject } from 'mobx-react';
import FPSStats from "react-fps-stats";
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    centered: {
      marginTop: '60px',
      paddingTop: '0',
      paddingLeft: '1em',
      paddingRight: '1em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    }
  }));

interface Props {
  store: AppModel.Type;
}

interface State {
  talkingBlue: boolean;
  talkingRed: boolean;
  speaking: boolean;
  start: boolean;
}

let rawSpeaking = false;

export default function DebateTester(props:Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    talkingBlue: false,
    talkingRed: false,
    speaking: false,
    start: false
  });

  useEffect(() => {
    if(!store.debate.isTest) {
      store.debate.setTest(true);
      store.debate.setPosition(0, "");
      store.debate.setCharacter(1);
    }
  }, [])

  let speechEvents: SpeechEvent;
  const vidRef = useRef<HTMLVideoElement>(null);


  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setState({ ...state, talkingBlue: !state.talkingBlue });
  };

  const onClickRed = (e: React.MouseEvent) => {
    e.preventDefault();
    setState({ ...state, talkingRed: !state.talkingRed });
  };


  const onStart = async (e?: React.MouseEvent) => {
    if (e) e!.preventDefault();
    store.hideNavbar();
    
    try {
      const media = await getMedia({ video: false, audio: true });

      gotMedia(media);
    } catch (e) {
      console.error(e);
    }
    setState({ ...state, start: true });
  };

  const gotMedia = (stream?: MediaStream) => {
    console.log('gotMedia');
    const options = {};
    speechEvents = hark(stream, options);
    speechEvents.on('speaking', () => {
      rawSpeaking = true;
      // console.log('speaking');
      setState({ ...state, talkingBlue: true });
      // document.querySelector('#speaking').textContent = 'YES';
    });

    speechEvents.on('stopped_speaking', () => {
      // console.log('stopped_speaking');
      rawSpeaking = false;
      // setTimeout(() => {
      if (!rawSpeaking) setState({ ...state, talkingBlue: false });
      // }, 90);
      // document.querySelector('#speaking').textContent = 'NO';
    });
  };



    const { talkingBlue, talkingRed, speaking } = state;

    let blueChar = 2
    let redChar = 1;
    if(store.debate && store.debate!.character > -1) {
      blueChar = store.debate!.character;
      console.log('blueChar', blueChar)
    }

    return (
      <React.Fragment>
        <div className={classes.centered}>
          {state.start && (
            <a href="#" onClick={onClickRed}>
              devToggle
            </a>
          )}
          <div id="video">
            <video ref={vidRef} autoPlay={true} hidden={true} />
          </div>
          {!state.start && (
            <Button
              variant="contained"
              color="primary"
              href="Start"
              onClick={onStart}
            >
              Begin Simulated Debate
            </Button>
          )}
        </div>
        {state.start && (
          <DebateDisplay
            redChar={redChar}
            blueChar={blueChar}
            talkingBlue={talkingBlue}
            talkingRed={talkingRed}
            videoEl={vidRef}
            store={store}
          />
        )}
        <FPSStats left={'auto'} right={30} top={60} />
      </React.Fragment>
    );
  }
  // onClick={onStart}