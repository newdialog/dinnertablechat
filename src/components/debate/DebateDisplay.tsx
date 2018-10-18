import * as React from 'react';
import {
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import HOC from '../HOC';

import Lottie from 'react-lottie';
import { observer } from 'mobx-react';
import { Typography, Divider } from '@material-ui/core';

import hark, { SpeechEvent } from 'hark';
import Peer from 'simple-peer';
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
      float:'left'
    },
    leftPos: {
      position: 'absolute',
      // left: 'calc(50vw - 250px)',
      // top: 'calc(50vh - 300px)',
      bottom: 'calc(10vh)',
      // width: 300,
      // [theme.breakpoints.up('sm')]: {
        left: 'calc(50vw - 70vh)',
        width: '70vh',
      // }
      // transform: 'scale(1, 1)'
    },
    rightPos: {
      position: 'absolute',
      // left: 'calc(50vw)',
      // top: 'calc(50vh - 298px)',
      bottom: 'calc(10vh)',
      // width: 355,
      // [theme.breakpoints.up('sm')]: {
        left: 'calc(50vw - 11vh)',
        width: 'calc(60vh * 1.4)',
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
      // bottom: 'calc(10vh)'
    },
    bannerRef: {}
  });

const aliceListenOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/debate/00_ALCE_IDLE.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const aliceTalkOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/debate/00_ALCE_TALK.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const rabitListenOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/debate/01_RABIT_IDLE.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const rabitTalkOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/debate/01_RABIT_TALK2.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const bgOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/background.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const tableOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/debate/Table.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

// import * as AppModel from '../../models/AppModel';
interface Props extends WithStyles<typeof styles> {
  // store: AppModel.Type;
  talkingBlue: boolean;
  talkingRed: boolean;
}

interface State {
  blueTransition: boolean;
  blueState: string;
  redTransition: boolean;
  redState: string;
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

  public speechEvents: SpeechEvent;
  private vidRef = React.createRef<HTMLVideoElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      blueTransition: false,
      blueState: 'idle',
      redTransition: false,
      redState: 'idle'
    };
  }

  public componentDidMount() {}

  private onLoopComplete = () => {
    // console.log('onLoopComplete', this.props.talkingBlue)
    // if(this.props.talkingBlue) this.setState({ blueTransition: true });
    this.setState({ blueState: this.props.talkingBlue ? 'talking' : 'idle' });
  };
  /*
  <div className={classes.bannerAnim}>
              <Lottie options={tableOptions} ref={classes.bannerRef} isClickToPauseDisabled={true}/>
            </div>
  */

  public render() {
    const { classes, talkingBlue, talkingRed } = this.props;
    const { blueTransition } = this.state;

    const animBlue = this.state.blueState === 'talking';
    const animRed = this.state.redState === 'talking';
    // if(this.state.talkingBlueBlend > 0 )

    // console.log('talkingBlue', talkingBlue, blueTransition);
    // const { } = this.state;
    const blueCss = talkingBlue ? 'talking' : 'idle';
    const redCss = talkingRed ? 'talking' : 'idle';
    return (
      <React.Fragment>
        <div className={classes.centered}>
          <div style={{ margin: '0 auto 0 auto', width: '100%' }}>
            <div className={classes.bannerAnim}>
              <Lottie
                options={bgOptions}
                ref={classes.bannerRef}
                isClickToPauseDisabled={true}
              />
            </div>

            <div className={classes.foreground}>
              <div className={classes.leftPos + ' ' + blueCss}>
                <div hidden={animBlue} ref={this.blue}>
                  <Lottie
                    speed={1.2}
                    options={aliceListenOptions}
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
                    options={aliceTalkOptions}
                    isClickToPauseDisabled={true}
                  />
                </div>
              </div>
              <div className={'flip ' + classes.rightPos + ' ' + redCss}>
                <div hidden={animRed} ref={this.red}>
                  <Lottie
                    speed={1.2}
                    options={rabitListenOptions}
                    isClickToPauseDisabled={true}
                  />
                </div>
                <div hidden={!animRed}>
                  <Lottie
                    speed={1.2}
                    options={rabitTalkOptions}
                    isClickToPauseDisabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DebateFloatMenu />
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
