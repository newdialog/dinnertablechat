import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import * as QS from '../../services/QueueService';
import * as shake from '../../services/HandShakeService';
import { Typography } from '@material-ui/core';
import Reveal from 'react-reveal/Reveal';

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
    bannerRef: {},
    bannerAnim: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: -1
    },
    centeredDown: {
      width:'100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingBottom: '1em',
      paddingTop:'23vh',
      color: '#ffffff88',
      textAlign: 'center',
      display: 'inline-block'
    },
    bannerAnimOverlay: {
      zIndex:-1, 
      transform: 'translateZ(0)',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      width:'100%',
      background:'rgba(0, 0, 0, 0.35)',
      backgroundBlendMode: 'multiply'
    },
  });

import Lottie from 'react-lottie';
const bgOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/background.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';
import DebateError from './DebateError';
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  onPeer: (p: any) => void;
}
 
class LoadingScene extends React.Component<Props, any> {
  constructor(props: any) {
    super(props);
    this.state = {error:null}
  }

  private onMatched = (match: any) => {
    // TODO
    if(typeof match === 'string') {
      this.setState({error:match})
      return;
    }
    this.props.store.debate.createMatch(match);
  };

  public componentDidMount() {
    // return; // TODO remove when back online

    if (!this.props.store.auth.user || !this.props.store.auth.aws)
      throw new Error('user not logged in');
    if (
      !this.props.store.debate.topic ||
      this.props.store.debate.contribution === -1
    )
      throw new Error('debate params not selected');

    const options = this.props.store.auth.aws!;
    QS.init(options);

    const topic = this.props.store.debate.topic;
    const position = this.props.store.debate.position;
    const contribution = this.props.store.debate.contribution;
    const chararacter = this.props.store.debate.character;

    const sameUserSeed = Math.round(new Date().getTime() / 1000);
    const userid = this.props.store.auth.user!.email + '_' + sameUserSeed;
    QS.queueUp(
      topic,
      position,
      userid,
      contribution,
      chararacter,
      this.onMatched
    );
  }

  private gotMedia = async (stream: MediaStream) => {
    console.log('gotMedia');
    const matchId = this.props.store.debate.match!.matchId;
    const isLeader = this.props.store.debate.match!.leader;
    const state = { char: this.props.store.debate.character }; // TODO pretect against premium chars
    const { peer, otherPlayerState } = await shake.handshake(matchId, isLeader, state, stream);
    this.props.onPeer(peer);
    if(otherPlayerState) this.props.store.debate.setOtherState({ character: otherPlayerState.char });
    this.props.store.debate.syncMatch();
  };

  public async componentWillUpdate() {
    if (!this.props.store.debate.match) return; // no match data yet

    console.log('ready for matching');

    navigator.getUserMedia(
      { video: false, audio: true },
      this.gotMedia,
      () => {}
    );
  }

  public render() {
    const store = this.props.store;
    const { classes } = this.props;

    const matchedUnsync = store.debate.match && !store.debate.match!.sync;
    const matchedsync = store.debate.match && store.debate.match!.sync;

    let text = 'loading';
    if(!store.debate.match) text = 'looking for match';
    if(matchedUnsync) text = 'found match... handshaking';
    if(matchedsync) text = 'handshaking complete';

    return (
      <div className={classes.centered}>
        { this.state.error && <DebateError store={store} error={this.state.error}/>}
        <div className={classes.bannerAnim}>
          <Lottie
            options={bgOptions}
            ref={classes.bannerRef}
            isClickToPauseDisabled={true}
          />
        </div>
        <div className={classes.bannerAnimOverlay}></div>

        <div className={classes.centeredDown}>
          <Typography variant="h1" gutterBottom align="center">
            <Reveal effect="fadeIn" duration={3000}>
              Loading...
            </Reveal>
          </Typography>
          <Typography variant="h4" align="center">
            <Reveal effect="fadeIn" duration={3000}>
              {text}
            </Reveal>
          </Typography>
        </div>
      </div>
    );
  }
}
export default HOC(LoadingScene, styles);
