import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import * as QS from '../../services/QueueService';
import * as shake from '../../services/HandShakeService';
import { Typography, Card } from '@material-ui/core';
import Reveal from 'react-reveal/Reveal';
import getMedia from '../../utils/getMedia';
import Lottie from 'react-lottie';
import * as AppModel from '../../models/AppModel';
import DebateError from './DebateError';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      textAlign: 'center',
      width: 350,
      backgroundColor: theme.palette.common.white,
      '&:focus': {}
    }
  }));

const bgOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/background.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const onWindowBeforeUnload = async (e: any) => {
  console.log('onWindowBeforeUnload');
  // if(state.ticketId) await QS.stopMatchmaking(state.ticketId!);
  e.preventDefault();
  e.returnValue = 'Are you sure you want to leave matchmaking?';
  return e.returnValue;
};

interface Props {
  store: AppModel.Type;
  onPeer: (p: any) => void;
}

interface State {
  // stream?: MediaStream | null;
  error?: string;
  ticketId?: string;
  copied?: boolean;
  startedHandshake: boolean;
  // loggedError: boolean;
  // stream?: MediaStream;
  unloadFlag: {flag:boolean}
}

// let unloadFlag:any = null; // { flag: false };
let loggedError = false;
export default observer(function LoadingScene(props:Props) {
  // let startedHandshake = false;

  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    startedHandshake: false,
    unloadFlag: {flag:false}
    // stream: null
    // loggedError: false,
    // unloadFlag: { flag: false }
  });
  const [stream, setStream] = useState<MediaStream | null>(null);

  const onMatched = (match: any) => {
    if (state.unloadFlag.flag) return;
    console.log('onMatched', match);
    // TODO
    if (typeof match === 'string') {
      /// if(match === 'CANCELLED') return; // just end (why?)
      setState(p => ({...p, error: match }));
      return;
    }
    store.debate.createMatch(match);
  };

  const startup = async ()=> {
    store.hideNavbar();

    // Check if match params are set up
    if (!store.auth.user || !store.auth.aws)
      throw new Error('user not logged in');
    if (
      !store.debate.topic ||
      store.debate.contribution === -1
    )
      throw new Error('debate params not selected');

    const topic = store.debate.topic;
    const position = store.debate.position;

    // analytics
    window.gtag('event', 'debate_loading', {
      event_category: 'debate',
      guest: store.isGuest(),
      topic,
      position
    });
    window.gtag('event', `debate_queue_${topic}_${position}`, {
      event_category: 'debate',
      guest: store.isGuest()
    });
    // Also add a metric for guests in queue
    if (store.isGuest()) {
      window.gtag('event', 'debate_loading_guest', {
        event_category: 'debate',
        topic,
        position,
        guest: store.isGuest()
      });
    }

    // enable mic first
    try {
      const media = await getMedia();
      if(!media) throw new Error('no media pulled'); //maybe not needed
      console.log('startedHandshake-1');
      setStream(media);
    } catch (e) {
      console.log('getMediaError', e);
      setState(p => ({...p, error: 'mic_timeout' }));
      return; // do not continue to queue on error;
    }

    window.addEventListener('beforeunload', onWindowBeforeUnload);
    window.addEventListener('unload', onWindowUnload.current);
    await getMatch();
  }

  useEffect(() => {
    // state.unloadFlag =  { flag: false }; // reset global flags: refactor
    loggedError = false;
    startup();
  }, []);

  useEffect(() => {
    return () => {
      if(!state.ticketId) return;
      // if(state.unloadFlag.flag === false) return;
      console.warn('UNLOADING', state.unloadFlag);
      window.removeEventListener('beforeunload', onWindowBeforeUnload);
      window.removeEventListener('unload', onWindowUnload.current);
      // unload streams if nav to different page outside of match
      // console.log('store.router', JSON.stringify(store.router));
  
      /* const navAway =
        ((store.router.location as any).pathname as string).indexOf(
          'match'
        ) === -1; */
  
      const hasMatch =
        store.debate.match && store.debate.match!.sync;
  
      console.log('componentWillUnmount 1', !hasMatch);
      // state.unloadFlag.flag = true;
      setState(p => {
        p.unloadFlag.flag = true;
        return {...p};
      });
      if (!hasMatch) {
        console.log('componentWillUnmount 2', state.ticketId);
        if (state.ticketId) QS.stopMatchmaking(state.ticketId!);
        store.showNavbar();
        if (stream)
          stream.getTracks().forEach(track => track.stop());
      }
      // unloadFlag = null;
    }
  }, [state.ticketId]);

  useEffect(() => {
    console.log('useEffect run-', 'store.debate.match:',!!store.debate.match, 'hasstream:', !!stream, 'startedHandshake:'+state.startedHandshake)
    if (
      store.debate.match &&
      stream &&
      !state.startedHandshake
    ) {
      if (state.unloadFlag.flag) return;
      // startedHandshake = true;
      console.log('1startedHandshake')
      setState(p => ({...p, startedHandshake: true}));
      doHandshake(stream);
    }

    
  }, [store, state.ticketId, stream, state.unloadFlag, store.debate.match]);

  const unload = () => {

  };

  const getMatch = async () => {
    const topic = store.debate.topic;
    const position = store.debate.position;
    const contribution = store.debate.contribution;
    const chararacter = store.debate.character;

    // start queue
    const options = store.auth.aws!;
    await QS.init(options);

    // const sameUserSeed = Math.round(new Date().getTime() / 1000);

    if (!store.auth.user!.id) throw new Error('no valid user id');

    let userid = store.auth.user!.id; // + '_' + sameUserSeed;
    const guestSeed = store.auth.user!.guestSeed;
    // Give guests a unique queue id
    // if(store.isGuest())
    // userid += '_' + Math.round(Math.random() * 1000);

    let ticketId: any;
    try {
      ticketId = await QS.queueUp(
        topic,
        position,
        userid,
        guestSeed,
        contribution,
        chararacter,
        // store.isGuest(),
        onMatched
      );
    } catch (e) {
      console.error('queueUp error', e);
      setState(p => ({...p, error: 'matchtimeout' }));
      return;
    }
   
    // console.log('p => ({...p, ticketId }', p => ({...p, ticketId });
    if (state.unloadFlag.flag) {
      if(ticketId) QS.stopMatchmaking(ticketId!);
      return;
    }
    setState(p => ({...p, ticketId }));

    // ticketIdProp = ticketId;
    // window.onunload = onWindowUnload;
  }

  const onWindowUnload = useRef(async (e: any) => {
    console.log('onWindowUnload', state.ticketId);
    // TODO: none of this below really works
    if (state.ticketId) await QS.stopMatchmaking(state.ticketId!); // Simple
    setState(p => {
      if (p.ticketId) QS.stopMatchmaking(state.ticketId!);
      p.unloadFlag.flag = true;
      return {...p};
    });
    // return false;
  });

  const doHandshake = async (_stream: MediaStream) => {
    console.log('now handshaking');
    const matchId = store.debate.match!.matchId;
    const isLeader = store.debate.match!.leader;
    const statePlayer= {
      char: store.debate.character,
      side: store.debate.position
    }; // TODO pretect against premium chars

    let result;
    try {
      result = await shake.handshake(
        matchId,
        isLeader,
        statePlayer,
        _stream,
        state.unloadFlag
      );
    } catch (e) {
      if (state.unloadFlag.flag) return; // just exit if we already ending
      // state.unloadFlag.flag = true;
      
      const retryError = e.toString().indexOf('retry') !== -1;
      console.warn('handshake error', retryError, e);
      if (retryError) {
        // retrying
        console.warn('retrying!');
        // unloadFlag.flag = false; // allow retry // no need
        // startedHandshake = false;
        setState(p => ({...p, startedHandshake: false})); // maybe not neede?
        store.debate.unMatch();
        await getMatch();
        return;
        // return setState({ error: 'handshake_timeout' });
      } else {
        setState(p => {
          p.unloadFlag.flag = true;
          return {...p};
        });
        return setState(p => ({...p, error: 'handshake_error' }));
      }
    } finally {
      if (state.unloadFlag.flag) {
        console.log('handshaking stopping due to flag');
        return;
      }
    }
    console.log('result', result);
    const { peer, otherPlayerState } = result;

    props.onPeer(peer);
    if (otherPlayerState)
      store.debate.setOtherState({
        character: otherPlayerState.char,
        position: otherPlayerState.side,
        guest: otherPlayerState.guest
      });
    store.debate.syncMatch();
  };

    const matchedUnsync = store.debate.match && !store.debate.match!.sync;
    const matchedsync = store.debate.match && store.debate.match!.sync;

    let text = 'IN QUEUE';
    if (!store.debate.match) text = 'this may take a few minutes!';
    if (matchedUnsync) text = 'match found! Trying to connect...';
    if (matchedsync) text = 'connected to match!';

    if (state.error && !loggedError) {
      window.gtag('event', state.error, {
        event_category: 'error',
        non_interaction: true
      });
      loggedError = true;
      window.removeEventListener('beforeunload', onWindowBeforeUnload); // allow restart button to work
    }

    const refURL = 'https://dinnertable.chat/?quickmatch=join';

    return (
      <div className={classes.centered}>
        {state.error && (
          <DebateError store={store} error={state.error} />
        )}
        <div className={classes.bannerAnim}>
          <Lottie
            options={bgOptions}
            // ref={bannerRef}
            isClickToPauseDisabled={true}
          />
        </div>
        <div className={classes.bannerAnimOverlay} />

        <div className={classes.centeredDown}>
          <Typography
            variant="h1"
            gutterBottom
            align="center"
            style={{ textShadow: '2px 2px #777755', color: '#ffffff' }}
          >
            <Reveal effect="fadeIn" duration={3000}>
              Searching for a match...
            </Reveal>
          </Typography>
          <Typography
            variant="h4"
            align="center"
            style={{ textShadow: '2px 2px #777755', color: '#ffffff' }}
          >
            <Reveal effect="fadeIn" duration={3000}>
              {text}
            </Reveal>
          </Typography>
          <br />
          <br />
          <Typography
            variant="h1"
            align="center"
            style={{
              color: '#ffffff',
              fontSize: '1.5em',
              lineHeight: '1',
              textShadow: '2px 2px #777755'
            }}
          >
            <Reveal effect="fadeIn" duration={1000}>
              { 
                // Click "Allow" when the browser asks to enable the microphone.
                // <br />
              }
              Share a match invite using the link below!
              <TextField
                id="standard-name"
                className={classes.textField}
                value={refURL}
                margin="normal"
                color="white"
              />
              <CopyToClipboard
                onCopy={() => setState(p => ({...p, copied: true }))}
                options={{ message: 'Whoa!' }}
                text={refURL}
              >
                <Button variant="contained"
                  color="secondary"
                  size="large">
                    
                    <i
                      className="far fa-clipboard"
                      style={{ marginRight: '8px', fontSize: '2em', color: '#ffffff', cursor: 'pointer' }}
                    />click to copy link
                  </Button>
              </CopyToClipboard>
              <section className="section">
                {state.copied ? (
                  <span style={{ color: '#fdcb92', fontSize: '.7em' }}>
                    copied link to clipboard
                  </span>
                ) : null}
              </section>
            </Reveal>
          </Typography>
        </div>
      </div>
    );
  });
