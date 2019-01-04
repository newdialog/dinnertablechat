import * as React from 'react';
import { Button, Typography } from '@material-ui/core';
import { createStyles, WithStyles, Theme} from '@material-ui/core/styles';
import HOC from '../HOC';

import rottie from 'lottie-web';
import Lottie from 'lottie-react-web'
// import { Typography, Divider } from '@material-ui/core';

import DebateFloatMenu from './DebateFloatMenu';
import DebateTimer from './DebateTimer';
import * as AppModel from '../../models/AppModel';

const styles = (theme: Theme) =>
  createStyles({
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
    },
  });

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
  { talk: aliceTalkOptions, listen: aliceListenOptions },
];

// import * as AppModel from '../../models/AppModel';
interface Props extends WithStyles<typeof styles> {
  // store: AppModel.Type;
  talkingBlue: boolean;
  talkingRed: boolean;
  blueChar: number;
  redChar: number;
  videoEl: HTMLMediaElement;
  store: AppModel.Type;
}

interface State {
  blueTransition: boolean;
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

class DebateScene extends React.Component<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: Props) {
    if (nextProps.talkingBlue !== prevState.talkingBlue) {
      return { blueTransition: false };
    }
    return {};
  }
  private blue = React.createRef<HTMLDivElement>();
  private red = React.createRef<HTMLDivElement>();
  private blueLottieRef = React.createRef<Lottie>();

  private bgEl = React.createRef<Lottie | any>();
  private tableEl = React.createRef<Lottie | any>();
  private confettiRef = React.createRef<Lottie | any>();
  

  constructor(props: Props) {
    super(props);
    this.state = {
      blueTransition: false,
      blueState: 'idle',
      redTransition: false,
      redState: 'idle',
      bothAgreed: false,
    };
  }

  private trackDebateTimeEnd = () => {
    window.gtag('event', 'debate_time_end', {
      event_category: 'debate',
      non_interaction: true
    });
  };

  public componentWillUnmount() {
    if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
  }

  public componentDidMount() {
    // Table
    const t = this.tableEl.current!;
    const table = rottie.loadAnimation({
      container: this.tableEl.current!, // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: tableOptions.path // the path to the animation json
    });
    table.setSpeed(1.5);
    table.addEventListener('DOMLoaded', ()=>{
      table.playSegments([0,200], true)
    });
  }

  private onLoopComplete = () => {
    // console.log('onLoopComplete', this.props.talkingBlue)
    // if(this.props.talkingBlue) this.setState({ blueTransition: true });
    this.setState({ blueState: this.props.talkingBlue ? 'talking' : 'idle' });
  };

  private onCompleted = () => {
    console.log('on debate timer complete');
    this.setState({ended: true});
    this.trackDebateTimeEnd();
  };

  private onCharLoaded = (x) => {
    console.log('aa', x, this.blueLottieRef.current!);
    const o = this.blueLottieRef.current!.anim;
    o.goToAndPlay(24*4, true);
  }

  public render() {
    const { classes, talkingBlue, talkingRed, videoEl, store } = this.props;
    const { blueTransition, bothAgreed, ended } = this.state;
    const agreed = store.debate.agreed;

    const animBlue = this.state.blueState === 'talking';
    const animRed = this.state.redState === 'talking';
    // if(this.state.talkingBlueBlend > 0 )

    // console.log('talkingBlue', talkingBlue, blueTransition);
    // const { } = this.state;
    const blueCss = talkingBlue ? 'talking' : 'idle';
    const redCss = talkingRed ? 'talking' : 'idle';

    const redChar = characters[this.props.redChar];
    const blueChar = characters[this.props.blueChar];
    return (
      <div id="debatedisplay">
        {(agreed || ended) ? <Lottie options={confettiOptions} ref={this.confettiRef} /> : null}
        <div className={classes.centered}>
          <Typography variant="h1" gutterBottom align="center" style={{color:'#555555'}} id="rotatemessage">
            Please rotate phone to landscape.
          </Typography>
          <div style={{ margin: '0 auto 0 auto', width: '100%' }}>
            <div className={classes.bannerAnim}>
              <Lottie
                options={bgOptions}
                ref={this.bgEl}
                isClickToPauseDisabled={true}
              />
            </div>
            <div className={classes.foreground}>
              <div className={classes.leftPos + ' ' + blueCss}>
                <div hidden={animBlue} ref={this.blue}>
                  <Lottie
                    speed={1.2}
                    ref={this.blueLottieRef}
                    options={blueChar.listen}
                    isClickToPauseDisabled={true}
                    eventListeners={[
                      {
                        eventName: 'loopComplete',
                        callback: this.onLoopComplete
                      },
                      {
                        eventName: 'DOMLoaded',
                        callback: this.onCharLoaded
                      }
                    ]}
                  />
                </div>
                <div hidden={!animBlue}>
                  <Lottie
                    speed={1.2}
                    options={blueChar.talk}
                    isClickToPauseDisabled={true}
                  />
                </div>
              </div>
              <div className={'flip ' + classes.rightPos + ' ' + redCss}>
                <div hidden={animRed} ref={this.red}>
                  <Lottie
                    speed={1.2}
                    options={redChar.listen}
                    isClickToPauseDisabled={true}
                  />
                </div>
                <div hidden={!animRed}>
                  <Lottie
                    speed={1.2}
                    options={redChar.talk}
                    isClickToPauseDisabled={true}
                  />
                </div>
              </div>

              <div className={classes.table}>
                <div id="tableanim" ref={this.tableEl}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.timer}>
          <DebateTimer onCompleted={this.onCompleted} />
        </div>

        <DebateFloatMenu videoEl={videoEl} />

      </div>
    );
  }
}

export default HOC(DebateScene, styles);
/*
    Lottie
                  options={tableOptions}
                  speed={1}
                  segments={this.state.tablePaused ? null : [0, 100]}
                  forceSegment={true}
                  ref={this.tableEl}
                  isClickToPauseDisabled={true}
                  eventListeners={[
                    {
                      eventName: 'complete',
                      callback: this.onTableLoopComplete
                    },
                    {
                      eventName: 'DOMLoaded',
                      callback: this.onTableDOMLoaded
                    }
                  ]}
    */

