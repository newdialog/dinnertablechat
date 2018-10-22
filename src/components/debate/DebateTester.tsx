import * as React from 'react';
import {
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import hark, { SpeechEvent } from 'hark';
import { Typography, Divider, Button } from '@material-ui/core';
import getMedia from '../../utils/getMedia';
import DebateDisplay from './DebateDisplay';
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';

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

  public componentDidMount() {
    // this.props.store.debate.setPosition(0, 'guns')
    // this.props.store.debate.setContribution(0);
    // this.props.store.debate.setCharacter(0);
    // this.props.store.debate.syncMatch();
  }

  public onStart = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('start');
    this.setState({ start: true });

    try {
      const media = await getMedia(
          { video: false, audio: true });

      this.gotMedia(media);
    } catch(e) {
      console.error(e);
    }
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
          {!this.state.start && <Button
            variant="contained"
            color="primary"
            href="Start"
            onClick={this.onStart}
          >
            Start
          </Button>}
        </div>
        {this.state.start && (
          <DebateDisplay
            redChar={1}
            blueChar={2}
            talkingBlue={talkingBlue}
            talkingRed={talkingRed}
            onClick={this.onStart}
          />
        )}
      </React.Fragment>
    );
  }
}

export default HOC(DebateScene, styles);
