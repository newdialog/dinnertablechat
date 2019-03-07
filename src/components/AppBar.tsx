import React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as Store from '../models/AppModel'

import QueueIcon from '@material-ui/icons/QueuePlayNext'
import * as Times from '../services/TimeService';

import { useTheme, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
    fontFamily: 'Montserrat!important',
    fontWeight: 'bolder'
  },
  btn: {
    // color: theme.palette.secondary.main
  },
}));

interface Props {
  store: Store.Type
}

function onLogin(store: Store.Type) {
  store.auth.login()

}

function onLogOut(store: Store.Type) {
  store.auth.logout()
}

function onStart(store: Store.Type) {
  store.router.push('/home')
}

function onHome(store: Store.Type) {
  store.router.push('/')
}

export default function ButtonAppBar(props:Props) {
  const classes = useStyles({});
  const { store } = props;
  const auth = store.auth.isAuthenticated();
  const isLive = props.store.isLive();

  const showAuth = true; // !isLive || Times.isDuringDebate();

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
          <img crossOrigin="anonymous" src="./logos/appbar-logo-color.png" style={{height:'3em', cursor: 'pointer'}} onClick={ onHome.bind(0,store) }/>
          { /* TODO BUG: empty component needed for alignment */ }
          <Typography variant="h6" className={classes.flex}></Typography>

          {!auth && showAuth &&
            <Button variant="outlined" color="secondary" className={classes.btn} onClick={ () => onLogin(store) }>Login</Button>
          }
          {auth &&
            <React.Fragment>
               {false && Times.isDuringDebate() && 
               <Button variant="outlined" color="secondary" className={classes.btn} onClick={ () => store.router.push('/quickmatch') }>
                Play
              </Button>
             }
              <Button variant="outlined" color="secondary" className={classes.btn} onClick={ () => onStart(store) }>
                My Home
              </Button>
            </React.Fragment>
          }

        </Toolbar>
      </AppBar>
    </div>
  );
}

// <Button color="secondary" onClick={ () => onLogOut(store) }>Log Out</Button>