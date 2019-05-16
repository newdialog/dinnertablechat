import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useContext,
  ReactNode
} from 'react';

import * as Store from '../models/AppModel';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import * as serviceWorker from '../serviceWorker';
import Button from '@material-ui/core/Button';
import QueueIcon from '@material-ui/icons/QueuePlayNext';
import Lottie from '@jadbox/lottie-react-web';
import * as AppModel from '../models/AppModel';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
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
  children: ReactNode;
  store: AppModel.Type;
}

interface State {
  init?: boolean;
  disableRefresh: boolean;
  showReload?: boolean;
  registration?: ServiceWorkerRegistration;
}

//
var refreshing: boolean = false;
var updating: boolean = false;
export default function WorkerUpdate(props: Props) {
  // const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState<State>({
    disableRefresh: false
  });

  const onSuccess = (registration: ServiceWorkerRegistration) => {
    if (registration) setState(p => ({ ...p, registration }));
    console.log('+worker onSuccess');
  };

  const onReg = (registration: ServiceWorkerRegistration) => {
    setState(p => ({ ...p, registration }));
    if(registration.waiting) onUpdate(registration);
    // console.log('+worker onReg');
    // #2
  };

  const onUpdate = (registration: ServiceWorkerRegistration) => {
    if(updating) return;
    updating = true;
    console.log('+worker onUpdate');
    if (registration) setState(p => ({ ...p, registration }));

    // TODO: this might be a problem with initialization
    setTimeout(() => {
      // if (registration && registration!.waiting)
      //  registration!.waiting.postMessage('skipWaiting');
      setState(p => ({ ...p, showReload: true })); // , registration: registration
    }, 300);

    if(registration.waiting) setTimeout(() => { refresh(registration); }, 3000);
  };

  useEffect(() => {
    serviceWorker.register({ onSuccess, onUpdate, onReg });
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true; // preventDevToolsReloadLoop
        // window.location.reload(true); // true
        setTimeout(()=>window.location.reload(true), 300);
        console.log('worker reloading..');
      });
    }
    // serviceWorker.unregister();
  }, []);

  const refresh = (registration:ServiceWorkerRegistration) => {
    updating = true;
    if (registration && registration!.waiting) {
      registration!.waiting.postMessage('skipWaiting');
    } // else alert('no registration waiting');
    
    // failsafe
    // setTimeout(() => bust(), 3000);
    bust();
    // setTimeout(() => window.location.reload(true), 4000);
    console.log('worker update click');
    if (refreshing) return;
    refreshing = true;
    setTimeout(()=>window.location.reload(true), 300);
  }

  const onRefreshClick = (e:any) => {
    setState(p => ({ ...p, disableRefresh: true }));
    // var r = confirm('New dinnertable update available!');
    refresh(state.registration!);
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
          <Lottie options={bgOptions} isClickToPauseDisabled={true} />
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
