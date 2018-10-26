import * as React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import HOC from '../HOC';

// import Lottie from 'react-lottie';
import Lottie from 'lottie-react-web'
import { Typography, Divider } from '@material-ui/core';

import hark, { SpeechEvent } from 'hark';
import DebateFloatMenu from './DebateFloatMenu';

const styles = (theme: Theme) =>
  createStyles({
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
    leftPos: {
      position: 'absolute',
      // left: 'calc(50vw - 250px)',
      // top: 'calc(50vh - 300px)',
      bottom: 'calc(23vh)',
      // width: 300,
      // [theme.breakpoints.up('sm')]: {
      left: 'calc(50vw - 65vh)',
      width: '75vh'
      // }
      // transform: 'scale(1, 1)'
    },
    rightPos: {
      position: 'absolute',
      // left: 'calc(50vw)',
      // top: 'calc(50vh - 298px)',
      bottom: 'calc(23vh)',
      // width: 355,
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
  });

const aliceListenOptions = {
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/00_ALCE_IDLE.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const aliceTalkOptions = {
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/00_ALCE_TALK.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const rabitListenOptions = {
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/01_RABIT_IDLE.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const rabitTalkOptions = {
  loop: true,
  autoplay: true,
  subframeEnabled: false,
  path: 'assets/debate/01_RABIT_TALK2.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const bgOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/background.json',
  subframeEnabled: false,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const tableOptions = {
  // renderer: 'canvas',
  loop: false,
  autoplay: false,
  path: 'assets/debate/Table.json',
  subframeEnabled: false,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const characters = [
  { talk: aliceTalkOptions, listen: aliceListenOptions },
  { talk: rabitTalkOptions, listen: rabitListenOptions },
  { talk: aliceTalkOptions, listen: aliceListenOptions }
];

// import * as AppModel from '../../models/AppModel';
interface Props extends WithStyles<typeof styles> {
  // store: AppModel.Type;
  talkingBlue: boolean;
  talkingRed: boolean;
  blueChar: number;
  redChar: number;
  videoEl: HTMLMediaElement;
}

interface State {
  blueTransition: boolean;
  blueState: string;
  redTransition: boolean;
  redState: string;
  tablePaused: boolean;
  tableStart?: boolean; // hack for segments
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

  // public speechEvents?: SpeechEvent;
  private vidRef = React.createRef<HTMLVideoElement>();
  private bgEl = React.createRef<Lottie | any>();
  private tableEl = React.createRef<Lottie | any>();

  constructor(props: Props) {
    super(props);
    this.state = {
      blueTransition: false,
      blueState: 'idle',
      redTransition: false,
      redState: 'idle',
      tablePaused: false
    };
  }

  public componentDidMount() {
    // Lock orientation if possible
    const s = window.screen as any;
    s.lockOrientationUniversal =
      s.lockOrientation || s.mozLockOrientation || s.msLockOrientation;
    if (screen.orientation && typeof screen.orientation.lock === 'function') {
      try {
        window.screen.orientation.lock('landscape');
      } catch(e) {
        console.warn(e);
      }
    }
    
    try {
      if (s.lockOrientationUniversal) s.lockOrientationUniversal('landscape');
    } catch(e) {
      console.warn(e);
    }

    // Table
    console.log('playSegments', Boolean(this.tableEl.current), this.tableEl.current!)
    const t = this.tableEl.current!;
    // t.playSegments();
    // t.playSegments([0, 20], true);
    // t.setSubframe(false);
    // t.playSegments([0, 20], true);
    // t.goToAndStop(30);
  }

  private onLoopComplete = () => {
    // console.log('onLoopComplete', this.props.talkingBlue)
    // if(this.props.talkingBlue) this.setState({ blueTransition: true });
    this.setState({ blueState: this.props.talkingBlue ? 'talking' : 'idle' });
  };

  private onTableDOMLoaded = () => {
    console.log('table onTableDOMLoaded')
    const t = this.tableEl.current!;
    t.playSegments();
    this.setState({tableStart:true});
  }

  private onTableLoopComplete = () => {
    if(this.state.tablePaused) return;
    const t = this.tableEl.current!;
    t.pause();
    console.log('table stop')
    this.setState({tablePaused:true});
  }

  public render() {
    const { classes, talkingBlue, talkingRed, videoEl } = this.props;
    const { blueTransition } = this.state;

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
      <React.Fragment>
        <div className={classes.centered}>
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
                    options={blueChar.listen}
                    isClickToPauseDisabled={true}
                    eventListeners={[
                      {
                        eventName: 'loopComplete',
                        callback: this.onLoopComplete
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
                <Lottie
                  options={tableOptions}
                  playSegments={true}
                  speed={1}
                  segments={this.state.tablePaused ? null : [0,100]}
                  forceSegment={true}
                  ref={this.tableEl}
                  isClickToPauseDisabled={true}
                  eventListeners={[
                    {
                      eventName: 'complete',
                      callback: this.onTableLoopComplete
                    }, {
                      eventName: 'DOMLoaded',
                      callback: this.onTableDOMLoaded
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <DebateFloatMenu videoEl={videoEl} />
      </React.Fragment>
    );
  }
}

export default HOC(DebateScene, styles);

/*
    if(!talkingBlue && this.blue.current) {
      this.blue.current!.querySelector('.mouthtalking')!.setAttribute('style', 'visibility: none;');
      this.blue.current!.querySelector('.mouthidle')!.setAttribute('style', 'visibility: visible;');
    }
    if(talkingBlue && this.blue.current) {
      this.blue.current!.querySelector('.mouthtalking')!.setAttribute('style', 'visibility: visible;');
      this.blue.current!.querySelector('.mouthidle')!.setAttribute('style', 'visibility: none;');
    }
    
    if(!talkingRed && this.red.current) {
      this.red.current!.querySelector('.mouthtalking')!.setAttribute('style', 'visibility: none;');
      this.red.current!.querySelector('.mouthidle')!.setAttribute('style', 'visibility: visible;');
    }
    if(talkingRed && this.red.current) {
      this.red.current!.querySelector('.mouthtalking')!.setAttribute('style', 'visibility: visible;');
      this.red.current!.querySelector('.mouthidle')!.setAttribute('style', 'visibility: none;');
    }
    */
