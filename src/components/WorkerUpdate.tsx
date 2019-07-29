import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import QueueIcon from '@material-ui/icons/QueuePlayNext';
import { makeStyles } from '@material-ui/styles';
import React, { ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import * as AppModel from '../models/AppModel';
import * as serviceWorker from '../serviceWorker';

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
    backgroundColor: '#af9667', // new
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
}));
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
  // const { t } = useTranslation();

  const [state, setState] = useState<State>({
    disableRefresh: false
  });

  const onSuccess = (registration: ServiceWorkerRegistration) => {
    if (registration) setState(p => ({ ...p, registration }));
    console.log('+worker onSuccess');
  };

  const onReg = (registration: ServiceWorkerRegistration) => {
    setState(p => ({ ...p, registration }));
    // if(registration.waiting) onUpdate(registration);
    console.log('+worker onReg', registration.waiting);
    // #2
  };

  const onUpdate = (registration: ServiceWorkerRegistration) => {
    if(updating) return;
    updating = true;
    console.log('+worker onUpdate', registration);
    if (registration) setState(p => ({ ...p, registration }));

    // TODO: this might be a problem with initialization
    // if (registration && registration!.waiting)
    //  registration!.waiting.postMessage('skipWaiting');
    setState(p => ({ ...p, showReload: true })); // , registration: registration

    // if(registration.waiting) 
    refresh(registration);

    setTimeout(()=> {
      // failsafe
      window.location.reload(true);
    }, 3200);
  };

  useEffect(() => {
    if (! ('serviceWorker' in navigator) ) return;
    serviceWorker.register({ onSuccess, onUpdate, onReg });

    // Anytime a new SW is activated
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true; // preventDevToolsReloadLoop
      refresh();
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('sw msg', event.data);
      
      switch (event.data) {
        case 'reload-window':
          setTimeout( () =>
            window.location.reload(true)
           , 80);
          break;
        default:
          // NOOP
          break;
      }
    });
    // serviceWorker.unregister();
  }, []);

  const refresh = (registration?:ServiceWorkerRegistration) => {
    registration = registration || state.registration;
    updating = true;

    if(!registration) return;
    if(registration!.waiting) registration!.waiting!.postMessage('skipWaiting');
    if(registration!.active) registration!.active!.postMessage('skipWaiting');
    
    bust();
    console.log('worker update click');
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
          
        </div>
        { /* <div className={classes.bannerAnimOverlay} /> */ }
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
function bust() {
  navigator.serviceWorker.getRegistrations().then(registrationsArray => {
    if (registrationsArray.length > 0) registrationsArray[0].update();
  });
}
