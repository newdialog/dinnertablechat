import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';

import * as Store from '../models/AppModel';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import * as serviceWorker from '../serviceWorker';
import Button from '@material-ui/core/Button';
import QueueIcon from '@material-ui/icons/QueuePlayNext';
import Lottie from 'react-lottie';
import * as AppModel from '../models/AppModel';
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
}));

const bgOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/background.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
interface Props {
  children: any;
  store: AppModel.Type;
}

interface State {
  init?: boolean;
  disableRefresh: boolean;
  showReload?: boolean;
}

//
var refreshing;
export default function WorkerUpdate(props: Props) {
  // const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  let refresh = false;
  let registration: ServiceWorkerRegistration;
  const [state, setState] = useState<State>({
    disableRefresh: false
  });

  useEffect(() => {
    serviceWorker.register({ onSuccess: onSuccess, onUpdate: onUpdate });
    // serviceWorker.unregister();
  }, []);

  const onSuccess = (registration: ServiceWorkerRegistration) => {
    registration = registration;
    console.log('worker loaded');
  };

  const onUpdate = (registration: ServiceWorkerRegistration) => {
    if (registration) registration = registration;

    // #2
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true; // preventDevToolsReloadLoop
      window.location.reload(); // true
    });

    // TODO: this might be a problem with initialization
    setTimeout(() => {
      setState({ ...state, showReload: true }); // , registration: registration
    }, 1200);
  };

  const onRefreshClick = e => {
    // const registration = registration!;
    // var r = confirm('New dinnertable update available!');
    if (registration.waiting) registration.waiting.postMessage('skipWaiting');
    else alert('no registration waiting');
    setState({ ...state, disableRefresh: true });
    // failsafe
    setTimeout(() => bust(), 3000);
    setTimeout(() => window.location.reload(true), 4000);
    console.log('worker updated');
  };

  // Ensure not in a match
  if (state.showReload && !props.store.debate.match) {
    return (
      <div
        style={{
          textAlign: 'center',
          paddingTop: '60px',
          height: '100vh',
          width: '100vw'
        }}
      >
        <div className={classes.bannerAnim}>
          <Lottie
            options={bgOptions}
            ref={classes.bannerRef}
            isClickToPauseDisabled={true}
          />
        </div>
        <div className={classes.bannerAnimOverlay} />
        <div className={classes.centeredDown}>
          <Typography
            variant="h1"
            gutterBottom
            align="center"
            style={{
              color: 'white',
              fontSize: '2em',
              textShadow: '2px 2px #777755'
            }}
          >
            We have new features!
          </Typography>
          <br />
          <br />
          <Button
            onClick={onRefreshClick}
            variant="contained"
            color="secondary"
            size="large"
            disabled={state.disableRefresh}
          >
            One-click Update
            <QueueIcon style={{ marginLeft: '8px' }} />
          </Button>
        </div>
      </div>
    );
  } else return <>{props.children}</>;
}
// withOAuth

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

function bust() {
  navigator.serviceWorker.getRegistrations().then(registrationsArray => {
    if (registrationsArray.length > 0) registrationsArray[0].update();
  });
}
