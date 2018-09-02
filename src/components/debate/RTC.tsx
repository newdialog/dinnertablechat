import * as React from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Lottie from 'react-lottie';
import { observer } from 'mobx-react';
import { Typography, Divider } from '@material-ui/core';

import hark from 'hark';
import Peer from 'simple-peer';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    }
  });

class Index extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { open: false };
  }

  public componentDidMount() {
    navigator.getUserMedia({ video: false, audio: true }, this.gotMedia.bind(this), () => {});
  }

  public gotMedia(stream: MediaStream) {
    const isInit = false; // todo
    const p = new Peer({
      initiator: isInit,
      trickle: false,
      stream
    });
    p.on('error', err => {
      console.log('error', err);
    });
    p.on('signal', data => {
      console.log('SIGNAL', JSON.stringify(data));
    });
    /*document.querySelector('#form').addEventListener('submit', function (ev) {
        ev.preventDefault()
        console.log('sending')
        p.signal(JSON.parse(document.querySelector('#incoming').value))
    })*/

    p.on('connect', () => {
      console.log('CONNECT');
      p.send('whatever' + Math.random());
    });

    p.on('data', (data) => {
      console.log('data: ' + data);
    });

    p.on('stream', (stream2) => {
      // got remote video stream, now let's show it in a video tag
      /// var video = document.querySelector('video');
      /// video.src = window.URL.createObjectURL(stream2);
      /// video.play();

      const options = {};
      const speechEvents = hark(stream2, options);
      speechEvents.on('speaking', () => {
        console.log('speaking');
        // document.querySelector('#speaking').textContent = 'YES';
      });

      speechEvents.on('stopped_speaking', () => {
        console.log('stopped_speaking');
        // document.querySelector('#speaking').textContent = 'NO';
      });
    });
  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        <div>
          <div>
            <h1>Hello, world!</h1>
            <div id="video">
              video tag
              <video />
            </div>
            <form id="form">
              <textarea id="incoming" />
              <button type="submit">submit</button>
            </form>
            <pre id="outgoing" />
            <br />
            Speaking: <pre id="speaking" />
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

export default withRoot(withStyles(styles)(Index));
