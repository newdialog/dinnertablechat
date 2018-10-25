import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as Store from '../models/AppModel'

import QueueIcon from '@material-ui/icons/QueuePlayNext'
import HOC from './HOC';

const styles = createStyles({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
    fontFamily: 'Montserrat!important',
    fontWeight: 'bolder'
  }
});

interface Props extends WithStyles<typeof styles> {
  store: Store.Type
}

function onLogin(store: Store.Type) {
  store.auth.login()

}

function onLogOut(store: Store.Type) {
  store.auth.logout()
}

function onStart(store: Store.Type) {
  store.router.push('/play')
}

function onHome(store: Store.Type) {
  store.router.push('/')
}

function ButtonAppBar(props:Props) {
  const { classes, store } = props;
  const auth = store.auth.loggedIn;
  const h = window.location.hostname;
  const isLive = h.indexOf('test') === -1 && 
    h.indexOf('.dinnertable') === -1 &&
    h.indexOf('dinnertable.chat') !== -1;

  if(store.debate.match && store.debate.match.sync) {
    return null; // <React.Fragment></React.Fragment>
  }

  if(!store.showNav) {
    return null;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default" style={{ backgroundColor:'rgb(255,255,255,0.9)' }}>
        <Toolbar variant="dense">
          <img src="./logos/appbar-logo-color.png" style={{height:'3em', cursor: 'pointer'}} onClick={ onHome.bind(0,store) }/>
          { /* TODO BUG: empty component needed for alignment */ }
          <Typography variant="h6" className={classes.flex}></Typography>

          {!auth && !isLive &&
            <Button onClick={ () => onLogin(store) }>Login</Button>
          }
          {auth && !isLive &&
            <React.Fragment>
              <Button variant="contained" color="primary" onClick={ () => onStart(store) }>
                Start
                <QueueIcon style={{marginLeft: '8px'}}></QueueIcon>
              </Button>
              <Button onClick={ () => onLogOut(store) }>Log Out</Button>
            </React.Fragment>
          }

        </Toolbar>
      </AppBar>
    </div>
  );
}

export default HOC(ButtonAppBar, styles);