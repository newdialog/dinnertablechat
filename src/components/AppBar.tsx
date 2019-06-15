import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';

import * as Store from '../models/AppModel';
import UserStats from './menus/dash/UserStats';

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1,
    fontFamily: 'Montserrat!important',
    fontWeight: 'bolder'
  },
  btn: {
    // color: theme.palette.secondary.main
  },
  social: {}
}));

const trackOutboundLinkClick = window.trackOutboundLinkClick;

interface Props {
  store: Store.Type;
}

function onLogin(store: Store.Type) {
  store.auth.login();
}

function onLogOut(store: Store.Type) {
  store.auth.logout();
}

function onStart(store: Store.Type) {
  store.router.push('/home');
}

function onHome(store: Store.Type) {
  store.router.push('/');
}

export default observer(function ButtonAppBar(props: Props) {
  const classes = useStyles({});
  const store = props.store;
  const auth = store.auth.isAuthenticated();

  const path = (store.router.location as any).pathname;
  const isDashboard = path === '/home' || path === '/quickmatch';
  let logo = !isDashboard
    ? './logos/appbar-logo-color2.png'
    : './logos/appbar-logo-color-short2.png';

  const showAuth = true; // !isLive || Times.isDuringDebate();

  if (store.debate.match && store.debate.match.sync) {
    return null; // <React.Fragment></React.Fragment>
  }

  if (!store.showNav) {
    return null;
  }

  if (store.isSaas) return null;

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        color="default"
        style={{ backgroundColor: 'rgb(255,255,255,0.9)' }}
      >
        <Toolbar variant="dense">
          <img
            crossOrigin="anonymous"
            title="DTC Home"
            src={logo}
            style={{ height: '3em', cursor: 'pointer' }}
            onClick={onHome.bind(0, store)}
          />
          {/* TODO BUG: empty component needed for alignment */}
          <Typography variant="h6" className={classes.flex} />

          {!isDashboard && socialLinks()}

          {isDashboard && <UserStats store={store} />}

          {!auth && showAuth && !isDashboard && (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.btn}
              onClick={() => onLogin(store)}
            >
              Login
            </Button>
          )}
          {auth && !isDashboard && (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.btn}
              onClick={() => onStart(store)}
            >
              Home
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
});

// observer(ButtonAppBar)

// <Button color="secondary" onClick={ () => onLogOut(store) }>Log Out</Button>

function socialLinks() {
  return (
    <>
      <a
        target="_blank"
        rel="noopener noreferrer"
        title="Medium"
        href="https://medium.com/dinnertablechat"
        onClick={trackOutboundLinkClick(
          'https://medium.com/dinnertablechat',
          false,
          true
        )}
      >
        <i
          id="social-medium"
          className="fab fa-medium social fa-2x "
          style={{ marginRight: '.15em' }}
        />
      </a>

      <a
        target="_blank"
        rel="noopener noreferrer"
        title="Instagram"
        href="https://www.instagram.com/dinnertablechat/"
        onClick={trackOutboundLinkClick(
          'https://www.instagram.com/dinnertablechat/',
          false,
          true
        )}
      >
        <i
          id="social-discord"
          className="fab fa-instagram fa-2x social"
          style={{ marginRight: '.15em' }}
        />
      </a>

      <a
        target="_blank"
        rel="noopener noreferrer"
        title="Twitter"
        href="https://twitter.com/dintablechat"
        onClick={trackOutboundLinkClick(
          'https://twitter.com/dintablechat',
          false,
          true
        )}
      >
        <i
          id="social-tw"
          className="fab fa-twitter-square social fa-2x "
          style={{ marginRight: '.15em' }}
        />
      </a>

      <a
        target="_blank"
        rel="noopener noreferrer"
        title="Facebook"
        href="https://facebook.com/dinnertablechat"
        onClick={trackOutboundLinkClick(
          'https://facebook.com/dinnertablechat',
          false,
          true
        )}
      >
        <i
          id="social-tw"
          className="fab fa-facebook-square social fa-2x "
          style={{ marginRight: '.15em' }}
        />
      </a>
    </>
  );
}
