import * as React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import hark, { SpeechEvent } from 'hark';
import { Typography, Divider, Button } from '@material-ui/core';
import getMedia from '../../utils/getMedia';
import DebateDisplay from './DebateDisplay';
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';
import { inject } from 'mobx-react';
import FPSStats from "react-fps-stats";

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

class DebateTester extends React.Component<Props, State> {
  public speechEvents?: SpeechEvent;
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

  public componentWillUnmount() {
    // cleanup
  }

  public componentDidMount() {
    // this.props.store.debate.setPosition(0, 'guns')
    // this.props.store.debate.setContribution(0);
    // this.props.store.debate.setCharacter(0);
    // this.props.store.debate.syncMatch();
    // this.onStart(); // for testing
  }

  public onStart = async (e?: React.MouseEvent) => {
    if (e) e!.preventDefault();
    this.props.store.hideNavbar();
    
    try {
      const media = await getMedia({ video: false, audio: true });

      this.gotMedia(media);
    } catch (e) {
      console.error(e);
    }
    this.setState({ start: true });
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
      // setTimeout(() => {
      if (!rawSpeaking) this.setState({ talkingBlue: false });
      // }, 90);
      // document.querySelector('#speaking').textContent = 'NO';
    });
  };

  public render() {
    const { classes } = this.props;
    const { talkingBlue, talkingRed, speaking } = this.state;

    let blueChar = 2
    let redChar = 1;
    if(this.props.store.debate && this.props.store.debate!.character > -1) {
      blueChar = this.props.store.debate!.character;
      console.log('blueChar', blueChar)
    }

    return (
      <React.Fragment>
        <div className={classes.centered}>
          {this.state.start && (
            <a href="#" onClick={this.onClickRed}>
              devToggle
            </a>
          )}
          <div id="video">
            <video ref={this.vidRef} autoPlay={true} hidden={true} />
          </div>
          {!this.state.start && (
            <Button
              variant="contained"
              color="primary"
              href="Start"
              onClick={this.onStart}
            >
              Begin Simulated Debate
            </Button>
          )}
        </div>
        {this.state.start && (
          <DebateDisplay
            redChar={redChar}
            blueChar={blueChar}
            talkingBlue={talkingBlue}
            talkingRed={talkingRed}
            onClick={this.onStart}
            videoEl={this.vidRef}
            store={this.props.store}
          />
        )}
        <FPSStats left={'auto'} right={30} top={60} />
      </React.Fragment>
    );
  }
}

export default inject('store')(HOC(DebateTester, styles));
