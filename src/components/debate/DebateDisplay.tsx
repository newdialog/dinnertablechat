import Lottie from '@jadbox/lottie-react-web';
import { Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from'@material-ui/core/styles';
import rottie, {AnimationEventName} from 'lottie-web';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import DebateFloatMenu from './DebateFloatMenu';
import DebateTimer from './DebateTimer';

// import { Typography, Divider } from '@material-ui/core';

const screen = window.screen;

const useStyles = makeStyles((theme: Theme) => ({
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
  },
  leftPos2: {
    width: 300
  },
  rightPos2: {
    width: 300,
    float: 'left'
  },
  table: {
    position: 'absolute',
    bottom: 'calc(-4vh)',
    left: 'calc(50vw - 70vh)',
    width: '140vh'
  },
  timer: {
    position: 'absolute',
    bottom: 'calc(1vh)',
    left: 'calc(50vw - 55vh)',
    width: '110vh'
  },
  leftPos: {
    position: 'absolute',
    bottom: 'calc(23vh)',
    // [theme.breakpoints.up('sm')]: {
    left: 'calc(50vw - 65vh)',
    width: '75vh'
    // }
    // transform: 'scale(1, 1)'
  },
  rightPos: {
    position: 'absolute',
    bottom: 'calc(23vh)',
    // [theme.breakpoints.up('sm')]: {
    left: 'calc(41vw + 5vh)',
    width: 'calc(75vh)'
    // }
    // transform: 'scale(-.5, .5)'
  },
  bannerAnim: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: -1
  },
  foreground: {
    margin: '0 auto 0 auto',
    overflow: 'hidden'
    // bottom: 'calc(10vh)'
  }
}));

const aliceListenOptions = {
  // renderer: 'canvas',
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/00_ALCE_IDLE.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid meet'
  }
};

const aliceTalkOptions = {
  // renderer: 'canvas',
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/00_ALCE_TALK.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid meet'
  }
};

const rabitListenOptions = {
  // renderer: 'canvas',
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/01_RABIT_IDLE.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid meet'
  }
};

const gekkoListenOptions = {
  // renderer: 'canvas',
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/02_GEEKO_IDLE.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid meet'
  }
};

const rabitTalkOptions = {
  // renderer: 'canvas',
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/01_RABIT_TALK2.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid meet'
  }
};

const bgOptions = {
  // renderer: 'canvas',
  loop: true,
  autoplay: true,
  path: 'assets/background.json',
  subframeEnabled: false,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const tableOptions = {
  renderer: 'canvas',
  loop: false,
  autoplay: false,
  path: 'assets/debate/Table.json',
  subframeEnabled: false,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const confettiOptions = {
  renderer: 'svg',
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/confetti.json',
  rendererSettings: {
    preserveAspectRatio: 'xMaxYMax meet'
  }
};

const characters = [
  { talk: gekkoListenOptions, listen: gekkoListenOptions },
  { talk: rabitTalkOptions, listen: rabitListenOptions },
  { talk: aliceTalkOptions, listen: aliceListenOptions }
];

// import * as AppModel from '../../models/AppModel';
interface Props {
  // store: AppModel.Type;
  talkingBlue: boolean;
  talkingRed: boolean;
  blueChar: number;
  redChar: number;
  videoEl: React.MutableRefObject<HTMLVideoElement | null>;
  store: AppModel.Type;
}

interface State {
  blueState: string;
  redTransition: boolean;
  redState: string;
  bothAgreed: boolean;
  ended?: boolean;
}
// flip
/*
  .mouthidle
  .mouthtalking
*/

export default function DebateScene(props: Props) {
  // const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const { talkingBlue, talkingRed, videoEl, store } = props;
  let [prevBlue, setPrevBlue] = useState<boolean | null>(null);

  const [state, setState] = useState({
    blueState: 'idle',
    redTransition: false,
    redState: 'idle',
    bothAgreed: false,
    ended: false
  });

  /* useEffect(()=>{
    if(talkingBlue !== prevBlue) {
      // setState(p => ({...p, blueTransition: false}));
      setPrevBlue(talkingBlue);
    }
  }, [talkingBlue]);*/

  const blueLottieRef = useRef<Lottie>(null);
  const blueLottieTalkRef = useRef<Lottie>(null);

  const bgEl = useRef<Lottie | any>();
  const tableEl = useRef<Lottie | any>();
  const confettiRef = useRef<Lottie | any>();

  const trackDebateTimeEnd = () => {
    window.gtag('event', 'debate_time_end', {
      event_category: 'debate',
      non_interaction: true
    });
  };

  useEffect(() => {
    // const t = tableEl.current!;
    const table = rottie.loadAnimation({
      container: tableEl.current!, // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: tableOptions.path // the path to the animation json
    });
    table.setSpeed(1.5);
    table.addEventListener('DOMLoaded' as any, () => {
      table.playSegments([0, 200], true);
    });

    return () => {
      if (screen.orientation && screen.orientation.unlock)
        screen.orientation.unlock();
    };
  }, []);

  const onLoopComplete = useCallback(() => {
    // console.log('blue onLoopComplete', talkingBlue, talkingRed);

    const swap = Math.random() > (.5 + state.blueState === 'talking' ? 0.1 : 0);
    setState(p => ({...p, blueState: swap ? 'talking' : 'talking' })); // talkingBlue
  }, [state, state.blueState, talkingBlue]);

  const onLoopCompleteRed = useCallback(() => {
    const swap = Math.random() > .5; // state.redState === 'talking';
    setState(p => ({...p, redState: swap ? 'talking' : 'talking' })); // talkingRed
  }, [state, state.redState, talkingRed]);

  const onCompleted = () => {
    console.log('on debate timer complete');
    setState(p => ({...p, ended: true }));
    trackDebateTimeEnd();
  };

  const onCharLoaded = lref => {
    const o = lref.current!.anim;
    o.goToAndPlay(24 * 4, true);
  };

  const { bothAgreed, ended } = state;
  const agreed = store.debate.agreed;

  const animBlue = state.blueState === 'talking';
  const animRed = state.redState === 'talking';

  const blueCss = talkingBlue ? 'talking' : 'idle';
  const redCss = talkingRed ? 'talking' : 'idle';

  // console.log('animBlue', animBlue, talkingBlue)

  const redChar = characters[props.redChar];
  const blueChar = characters[props.blueChar];
  return (
    <div id="debatedisplay">
      { 
        // TODO: disable for now <StartDebateDialog store={store} /> 
      }
      {agreed || ended ? (
        <Lottie options={confettiOptions} ref={confettiRef} />
      ) : null}
      <div className={classes.centered}>
        <Typography
          variant="h1"
          gutterBottom
          align="center"
          style={{ color: '#555555' }}
          id="rotatemessage"
        >
          Please rotate phone to landscape.
        </Typography>
        <div style={{ margin: '0 auto 0 auto', width: '100%' }}>
          <div className={classes.bannerAnim}>
            <Lottie
              options={bgOptions}
              ref={bgEl}
              isClickToPauseDisabled={true}
            />
          </div>
          <div className={classes.foreground}>
            <div className={classes.leftPos + ' ' + blueCss}>
              {<div hidden={animBlue}>
                <Lottie
                  speed={1.33}
                  ref={blueLottieRef}
                  options={blueChar.listen}
                  isClickToPauseDisabled={true}
                  eventListeners={[
                    {
                      eventName: 'loopComplete',
                      callback: onLoopComplete
                    },
                    {
                      eventName: 'DOMLoaded',
                      callback: onCharLoaded.bind(null, blueLottieRef)
                    }
                  ]}
                />
              </div>}
              {<div hidden={!animBlue}>
                <Lottie
                  ref={blueLottieTalkRef}
                  speed={1.33}
                  options={blueChar.talk}
                  isClickToPauseDisabled={true}
                  eventListeners={[
                    {
                      eventName: 'DOMLoaded',
                      callback: onCharLoaded.bind(null, blueLottieTalkRef)
                    }
                  ]}
                />
              </div>}
            </div>
            <div className={'flip ' + classes.rightPos + ' ' + redCss}>
            {<div hidden={animRed}>
                <Lottie
                  speed={1.33}
                  options={redChar.listen}
                  isClickToPauseDisabled={true}
                  eventListeners={[
                    {
                      eventName: 'loopComplete',
                      callback: onLoopCompleteRed
                    }
                  ]}
                />
              </div>}
              {<div hidden={!animRed}>
                <Lottie
                  speed={1.33}
                  options={redChar.talk}
                  isClickToPauseDisabled={true}
                />
              </div>}
            </div>

            <div className={classes.table}>
              <div id="tableanim" ref={tableEl} />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.timer}>
        <DebateTimer store={store} onCompleted={onCompleted} />
      </div>

      <DebateFloatMenu videoEl={videoEl} />
    </div>
  );
}

/*
    Lottie
                  options={tableOptions}
                  speed={1}
                  segments={state.tablePaused ? null : [0, 100]}
                  forceSegment={true}
                  ref={tableEl}
                  isClickToPauseDisabled={true}
                  eventListeners={[
                    {
                      eventName: 'complete',
                      callback: onTableLoopComplete
                    },
                    {
                      eventName: 'DOMLoaded',
                      callback: onTableDOMLoaded
                    }
                  ]}
    */
