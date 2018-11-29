import * as React from 'react';
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

const styles = (theme: Theme) =>
  createStyles({
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
  });
import * as AppModel from '../../models/AppModel';
import PeerService from '../../services/PeerService';
import HOC from '../HOC';
import DebateError from './DebateError';
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  peer: PeerService;
}

interface State {
  talkingBlue: boolean;
  talkingRed: boolean;
  error?: string;
  // speaking:boolean
}

class DebateScene extends React.Component<Props, State> {
  public peer: PeerService;
  public speechEvents?: SpeechEvent;
  public speechSelfEvents?: SpeechEvent;
  private vidRef = React.createRef<HTMLVideoElement>();
  constructor(props: Props) {
    super(props);
    this.state = { talkingBlue: false, talkingRed: false };
    this.peer = props.peer;
  }

  public componentDidMount() {
    this.gotMedia();

    window.gtag('event', 'debate_start', {
      event_category: 'debate'
    });
    window.gtag('event', `debate_start_${this.props.store.debate.topic}_${this.props.store.debate.position}`, {
      event_category: 'debate'
    });
    /* navigator.getUserMedia(
      { video: false, audio: true },
      this.gotMedia.bind(this),
      () => {}
    );*/
    // stream: MediaStream
  }

  public componentWillUnmount() {
    console.log('debatescene unmounting');
    this.peer.destroy();
    this.speechSelfEvents!.stop();
  }

  private setupSelfVoice() {
    const options = {};
    this.speechSelfEvents = hark(this.peer.getLocalStream(), options);

    this.speechSelfEvents.on('speaking', () => {
      // console.log('speaking');
      this.setState({ talkingBlue: true });
      // document.querySelector('#speaking').textContent = 'YES';
    });

    this.speechSelfEvents.on('stopped_speaking', () => {
      // console.log('stopped_speaking');
      this.setState({ talkingBlue: false });
      // document.querySelector('#speaking').textContent = 'NO';
    });
  }

  public gotMedia = (stream?: MediaStream) => {
    this.setupSelfVoice();

    const isInit = false; // todo
    /* const p = new Peer({
      initiator: isInit,
      trickle: false,
      stream
    });*/
    const p = this.peer;

    p.on('error', err => {
      if (err.toString().indexOf('connection failed') !== -1) {
        this.setState({ error: 'other_disconnected' });
      } else {
        this.setState({ error: 'webrtc_error' });
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
      const video = this.vidRef.current!;
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
      this.speechEvents = hark(stream2, options);

      this.speechEvents.on('speaking', () => {
        // console.log('speaking');
        this.setState({ talkingRed: true });
        // document.querySelector('#speaking').textContent = 'YES';
      });

      this.speechEvents.on('stopped_speaking', () => {
        // console.log('stopped_speaking');
        this.setState({ talkingRed: false });
        // document.querySelector('#speaking').textContent = 'NO';
      });
    });

    // p.addStream(stream);
    console.log('addStream');
  };

  public render() {
    const { classes, store } = this.props;
    const { talkingBlue, talkingRed } = this.state;

    const blueChar = this.props.store.debate!.character;
    const redChar = this.props.store.debate!.match!.otherState!.character;

    return (
      <React.Fragment>
        {this.state.error && (
          <DebateError error={this.state.error} store={store} />
        )}
        <div className={classes.centered2}>
          <div>
            <div>Microphone is on</div>
            <div id="video" hidden={true}>
              <video ref={this.vidRef} autoPlay={true} />
            </div>
          </div>
          <DebateDisplay
            videoEl={this.vidRef}
            blueChar={blueChar}
            redChar={redChar}
            talkingBlue={talkingBlue}
            talkingRed={talkingRed}
            store={this.props.store}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default inject('store')(HOC(DebateScene, styles));

/*

            <br />
            {talkingBlue && <div>Blue is Speaking, </div>}
            {talkingRed && <div>Red is Speaking</div>}
*/