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

import hark, { SpeechEvent } from 'hark';
import Peer from 'simple-peer';

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
import PeerService from '../../services/PeerService';
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type,
  peer: PeerService
}

class DebateScene extends React.Component<Props, any> {
  public peer:PeerService
  public speechEvents:SpeechEvent
  private vidRef = React.createRef<HTMLVideoElement>()
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
    this.peer = props.peer;
  }

  public componentDidMount() {
    this.gotMedia();
    /* navigator.getUserMedia(
      { video: false, audio: true },
      this.gotMedia.bind(this),
      () => {}
    );*/
  }

  public gotMedia = (stream?: MediaStream) => {
    const isInit = false; // todo
    /* const p = new Peer({
      initiator: isInit,
      trickle: false,
      stream
    });*/
    const p = this.peer;

    p.on('error', err => {
      console.log('error', err);
    });
    /*document.querySelector('#form').addEventListener('submit', function (ev) {
        ev.preventDefault()
        console.log('sending')
        p.signal(JSON.parse(document.querySelector('#incoming').value))
    })*/

    p.on('data', data => {
      console.log('data: ' + data);
    });

    p.onStream(stream2 => {
      console.log('stream found');
      // got remote video stream, now let's show it in a video tag
      /// var video = document.querySelector('video');
      const video = this.vidRef.current!;
      video.src = window.URL.createObjectURL(stream2);
      video.play();
      // video.autoPlay
      /// video.src = window.URL.createObjectURL(stream2);
      /// video.play();

      const options = {};
      this.speechEvents = hark(stream2, options);

      this.speechEvents.on('speaking', () => {
        // console.log('speaking');
        this.setState({speaking:true})
        // document.querySelector('#speaking').textContent = 'YES';
      });

      this.speechEvents.on('stopped_speaking', () => {
        // console.log('stopped_speaking');
        this.setState({speaking:false})
        // document.querySelector('#speaking').textContent = 'NO';
      });
    });

    // p.addStream(stream);
    console.log('addStream');
  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        <div className={classes.centered}>
          <div>
            <h1>Debate Room System</h1>
            <div>Microphone is activating</div>
            <div id="video">
              <video ref={this.vidRef} autoPlay={true} />
            </div>
            <br />
            {this.state.speaking && <div>Other is Speaking</div>}
          </div>
        </div>
      </React.Fragment>
    );
  }

  private handleClose = () => {
    this.setState({
      open: false
    });
  };

  private handleClick = () => {
    this.setState({
      open: true
    });
  };
}

export default withRoot(withStyles(styles)(DebateScene));
