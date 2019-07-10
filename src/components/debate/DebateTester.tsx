import { Button } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import hark, { SpeechEvent } from 'hark';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import FPSStats from 'react-fps-stats';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import getMedia from '../../utils/getMedia';
import DebateDisplay from './DebateDisplay';

// import { useMergeState } from 'react-hooks-lib';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
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

export default function DebateTester(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState<{ start: boolean }>({
    start: false
  });

  const [talk, setTalk] = useState<any>({
    talkingBlue: false,
    talkingRed: false,
    speaking: false
  });

  useEffect(() => {
    // console.log('------------------')
    if (!store.debate.isTest) {
      store.debate.setTest(true);
      store.debate.setPosition(0, '');
      store.debate.setCharacter(1);
    }
  }, []);

  let speechEvents: SpeechEvent;
  const vidRef = useRef<HTMLVideoElement>(null);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTalk(p => ({ ...p, talkingBlue: !talk.talkingBlue }));
  };

  const onClickRed = (e: React.MouseEvent) => {
    e.preventDefault();
    setTalk(p => ({ ...p, talkingRed: !talk.talkingRed }));
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
    setState(p => ({ ...p, start: true }));
  };

  const gotMedia = (stream?: MediaStream) => {
    console.log('gotMedia');
    const options = {};
    speechEvents = hark(stream, options);
    speechEvents.on('speaking', () => {
      rawSpeaking = true;
      // console.log('speaking');
      setTalk(p => ({ ...p, talkingBlue: true }));
      // document.querySelector('#speaking').textContent = 'YES';
    });

    speechEvents.on('stopped_speaking', () => {
      // console.log('stopped_speaking');
      rawSpeaking = false;
      // setTimeout(() => {
      if (!rawSpeaking) setTalk(p => ({ ...p, talkingBlue: false }));
      // }, 90);
      // document.querySelector('#speaking').textContent = 'NO';
    });
  };
  const { talkingBlue, talkingRed, speaking } = talk;

  let blueChar = 2;
  const redChar = 1;
  if (store.debate && store.debate!.character > -1) {
    blueChar = store.debate!.character;
    // console.log('blueChar', blueChar)
  }

  return (
    <React.Fragment>
      <div className={classes.centered}>
        {state.start && (
          <button onClick={onClickRed}>
            devToggle
          </button>
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
