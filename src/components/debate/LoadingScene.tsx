import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import * as QS from '../../services/QueueService';
import * as shake from '../../services/HandShakeService';
import { Typography } from '@material-ui/core';
import Reveal from 'react-reveal/Reveal';
import getMedia from '../../utils/getMedia';
import Lottie from 'react-lottie';
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';
import DebateError from './DebateError';

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
      width: '100%',
      height: '100vh',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingBottom: '1em',
      paddingTop: '23vh',
      color: '#ffffff88',
      textAlign: 'center',
      display: 'inline-block',
      [theme.breakpoints.down('sm')]: {
        paddingTop: '2vh'
      }
    },
    bannerAnimOverlay: {
      zIndex: -1,
      transform: 'translateZ(0)',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      background: 'rgba(0, 0, 0, 0.35)',
      backgroundBlendMode: 'multiply'
    }
  });

const bgOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/background.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  onPeer: (p: any) => void;
}

interface State {
  stream?: MediaStream;
  error?: string;
  ticketId?: string;
}

class LoadingScene extends React.Component<Props, State> {
  loggedError = false;
  myStream: MediaStream | null = null;
  ticketIdProp = null;
  startedHandshake = false;
  unloadFlag = { flag: false };

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  private onMatched = (match: any) => {
    if(this.unloadFlag.flag) return;
    // TODO
    if (typeof match === 'string') {
      /// if(match === 'CANCELLED') return; // just end (why?)
      this.setState({ error: match });
      return;
    }
    this.props.store.debate.createMatch(match);
  };

  public async componentDidMount() {
    this.props.store.hideNavbar();

    // Check if match params are set up
    if (!this.props.store.auth.user || !this.props.store.auth.aws)
      throw new Error('user not logged in');
    if (
      !this.props.store.debate.topic ||
      this.props.store.debate.contribution === -1
    )
      throw new Error('debate params not selected');

    const topic = this.props.store.debate.topic;
    const position = this.props.store.debate.position;

    // analytics
    window.gtag('event', 'debate_loading', {
      event_category: 'debate',
      guest: this.props.store.isGuest(),
      topic,
      position
    });
    window.gtag('event', `debate_queue_${topic}_${position}`, {
      event_category: 'debate',
      guest: this.props.store.isGuest()
    });
    // Also add a metric for guests in queue
    if(this.props.store.isGuest()) {
      window.gtag('event', 'debate_loading_guest', {
        event_category: 'debate',
        topic,
        position,
        guest: this.props.store.isGuest()
      });
    }

    // enable mic first
    try {
      const media = await getMedia();
      // this.myStream = media;
      this.setState({ stream: media });
    } catch (e) {
      console.log('getMediaError', e);
      this.setState({ error: 'mic_timeout' });
      return; // do not continue to queue on error;
    }

    window.addEventListener("beforeunload", this.onWindowBeforeUnload);
    window.addEventListener("unload", this.onWindowUnload);
    await this.getMatch();
  }

  public async getMatch() {
    const topic = this.props.store.debate.topic;
    const position = this.props.store.debate.position;
    const contribution = this.props.store.debate.contribution;
    const chararacter = this.props.store.debate.character;

    // start queue
    const options = this.props.store.auth.aws!;
    await QS.init(options);

    // const sameUserSeed = Math.round(new Date().getTime() / 1000);

    if (!this.props.store.auth.user!.id) throw new Error('no valid user id');
    
    let userid = this.props.store.auth.user!.id; // + '_' + sameUserSeed;
    // Give guests a unique queue id
    // if(this.props.store.isGuest()) 
    // userid += '_' + Math.round(Math.random() * 1000);

    let ticketId:any;
    try {
      ticketId = await QS.queueUp(
        topic,
        position,
        userid,
        contribution,
        chararacter,
        // this.props.store.isGuest(),
        this.onMatched
      );
    } catch (e) {
      console.error('queueUp error', e);
      this.setState({ error: 'matchtimeout' });
      return;
    }
    if(this.unloadFlag.flag) return;
    this.setState({ticketId});

    // this.ticketIdProp = ticketId;
    // window.onunload = this.onWindowUnload;
  }

  private onWindowUnload = (e:any) => {
    console.log('onWindowUnload');
    if(this.state.ticketId) QS.stopMatchmaking(this.state.ticketId!); // Simple
    // return false;
  }

  private onWindowBeforeUnload = (e:any) => {
    e.preventDefault();
    return e.returnValue = 'Are you sure you want to close?';
  }

  public componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onWindowBeforeUnload);
    window.removeEventListener("unload", this.onWindowUnload);
    // unload streams if nav to different page outside of match
    // console.log('this.props.store.router', JSON.stringify(this.props.store.router));
    
    /* const navAway =
      ((this.props.store.router.location as any).pathname as string).indexOf(
        'match'
      ) === -1; */
    
      const hasMatch = this.props.store.debate.match && this.props.store.debate.match!.sync;
    
      console.log('componentWillUnmount 1', !hasMatch);
    if(!hasMatch) {
      this.unloadFlag.flag = true;
      console.log('componentWillUnmount 2', this.state.ticketId);
      if(this.state.ticketId) QS.stopMatchmaking(this.state.ticketId!);
      this.props.store.showNavbar();
      if(this.state.stream) this.state.stream.getTracks().forEach(track => track.stop());
    } else {
      // give few seconds for last sync
      setTimeout( ()=>this.unloadFlag.flag = true, 3003);
    }
  }

  private gotMedia = async (stream: MediaStream) => {
    console.log('gotMedia, now handshaking');
    const matchId = this.props.store.debate.match!.matchId;
    const isLeader = this.props.store.debate.match!.leader;
    const state = { char: this.props.store.debate.character, side: this.props.store.debate.position }; // TODO pretect against premium chars

    let result: any;
    try {
      result = await shake.handshake(matchId, isLeader, state, stream, this.unloadFlag);
    } catch (e) {
      this.unloadFlag.flag = true;
      const retryError = e.toString().indexOf('retry') !== -1;
      console.warn('handshake error', retryError, e);
      if (retryError) {
        // retrying
        console.warn('retrying!');
        this.unloadFlag.flag = false; // allow retry
        this.startedHandshake = false;
        this.props.store.debate.unMatch();
        await this.getMatch();
        return;
        // return this.setState({ error: 'handshake_timeout' });
      }
      else return this.setState({ error: 'handshake_error' });
    } finally {
      if(this.unloadFlag.flag) {
        console.log('gotMedia stopping due to flag');
        return;
      }
    }
    const { peer, otherPlayerState } = result;

    this.props.onPeer(peer);
    if (otherPlayerState)
      this.props.store.debate.setOtherState({
        character: otherPlayerState.char,
        position: otherPlayerState.side,
        guest: otherPlayerState.guest
      });
    this.props.store.debate.syncMatch();
  };

  public async componentWillUpdate() {
    // Get Mic right away
    if(this.unloadFlag.flag) return;
    if (this.props.store.debate.match && this.state.stream && !this.startedHandshake) {
      this.startedHandshake = true;
      this.gotMedia(this.state.stream!);
    }
  }

  public render() {
    const store = this.props.store;
    const { classes } = this.props;

    const matchedUnsync = store.debate.match && !store.debate.match!.sync;
    const matchedsync = store.debate.match && store.debate.match!.sync;

    let text = 'loading';
    if (!store.debate.match) text = 'looking for a match';
    if (matchedUnsync) text = 'found match... handshaking';
    if (matchedsync) text = 'handshaking complete';

    if (this.state.error && !this.loggedError) {
      window.gtag('event', this.state.error, {
        event_category: 'error',
        non_interaction: true
      });
      this.loggedError = true;
    }

    return (
      <div className={classes.centered}>
        {this.state.error && (
          <DebateError store={store} error={this.state.error} />
        )}
        <div className={classes.bannerAnim}>
          <Lottie
            options={bgOptions}
            ref={classes.bannerRef}
            isClickToPauseDisabled={true}
          />
        </div>
        <div className={classes.bannerAnimOverlay} />

        <div className={classes.centeredDown}>
          <Typography variant="h1" gutterBottom align="center" style={{textShadow: '2px 2px #777755', color: '#ffffff'}}>
            <Reveal effect="fadeIn" duration={3000}>
              Loading...
            </Reveal>
          </Typography>
          <Typography variant="h4" align="center" style={{textShadow: '2px 2px #777755', color: '#ffffff'}}>
            <Reveal effect="fadeIn" duration={3000}>
              {text}
            </Reveal>
          </Typography>
          <br />
          <br />
          <br />
          <Typography
            variant="h1"
            align="center"
            style={{ color: '#ffffff', fontSize: '1.5em', lineHeight: '1', textShadow: '2px 2px #777755' }}
          >
            <Reveal effect="fadeIn" duration={1000}>
              1. Click "Allow" when the browser asks to enable the microphone.
              <br />
              2. Please do not reload or navigate away until prompted.
              <br />
              3. If on mobile, rotate to horizonal landscape.
            </Reveal>
          </Typography>
        </div>
      </div>
    );
  }
}
export default HOC(LoadingScene, styles);
