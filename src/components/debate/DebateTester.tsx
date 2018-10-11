import * as React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import hark, { SpeechEvent } from 'hark';
import { observer } from 'mobx-react';
import { Typography, Divider } from '@material-ui/core';

import DebateDisplay from './DebateDisplay';

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
    }
  });

import * as AppModel from '../../models/AppModel';
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}

interface State {
  talkingBlue: boolean;
  talkingRed: boolean;
  speaking: boolean;
  start: boolean;
}

let rawSpeaking = false;

class DebateScene extends React.Component<Props, State> {
  public speechEvents: SpeechEvent;
  private vidRef = React.createRef<HTMLVideoElement>();
  constructor(props: Props) {
    super(props);
    this.state = {
      talkingBlue: false,
      talkingRed: false,
      speaking: false,
      start: false
    };
  }

  private onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    this.setState({ talkingBlue: !this.state.talkingBlue });
  };

  private onClickRed = (e: React.MouseEvent) => {
    e.preventDefault();
    this.setState({ talkingRed: !this.state.talkingRed });
  };

  public componentDidMount() {}

  public onStart = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('start');
    this.setState({ start: true });
    navigator.getUserMedia(
      { video: false, audio: true },
      this.gotMedia.bind(this),
      () => {}
    );
  };

  public gotMedia = (stream?: MediaStream) => {
    console.log('gotMedia');
    const options = {};
    this.speechEvents = hark(stream, options);
    this.speechEvents.on('speaking', () => {
      rawSpeaking = true;
      // console.log('speaking');
      this.setState({ talkingBlue: true });
      // document.querySelector('#speaking').textContent = 'YES';
    });

    this.speechEvents.on('stopped_speaking', () => {
      // console.log('stopped_speaking');
      rawSpeaking = false;
      setTimeout(() => {
        if (!rawSpeaking) this.setState({ talkingBlue: false });
      }, 140);
      // document.querySelector('#speaking').textContent = 'NO';
    });
  };

  public render() {
    const { classes } = this.props;
    const { talkingBlue, talkingRed, speaking } = this.state;

    return (
      <React.Fragment>
        <div className={classes.centered}>
          <h1>Debate Room System</h1>
          <div>Microphone is activating</div>
          <a href="#" onClick={this.onClick}>
            Toggle blue talking
          </a>{' '}
          ----
          <a href="#" onClick={this.onClickRed}>
            Toggle blue talking
          </a>
          <div id="video">
            <video ref={this.vidRef} autoPlay={true} hidden={true} />
          </div>
          <div className={classes.centered}>
            <a href="Start" onClick={this.onStart}>
              Start
            </a>
          </div>
        </div>
        {this.state.start && (
          <DebateDisplay
            talkingBlue={talkingBlue}
            talkingRed={talkingRed}
            onClick={this.onStart}
          />
        )}
      </React.Fragment>
    );
  }
}

export default withRoot(withStyles(styles)(DebateScene));
