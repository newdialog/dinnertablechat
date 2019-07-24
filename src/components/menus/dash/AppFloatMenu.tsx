// stub

import React, { useState, useContext } from 'react';
import { Theme } from '@material-ui/core/styles';

import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as AppModel from '../../../models/AppModel';
import Fab from '@material-ui/core/Fab';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    justifyContent: 'center'
  },
  centered: {
    marginTop: '3.2em',
    paddingBottom: '1em',
    paddingTop: '.8em',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    backgroundColor: '#484965',
    textAlign: 'center'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5)
  }
}));

interface Props {
  // store: AppModel.Type;
  videoEl?: React.RefObject<HTMLMediaElement>;
}

interface State {
  exitPrompt: boolean;
  anchorEl?: any;
  showSettings?: boolean;
}

export default function AppFloatMenu(props: Props) {
  const [state, setState] = useState<State>({
    anchorEl: null,
    exitPrompt: false
  });
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const handleClick = event => {
    setState(p => ({...p, anchorEl: event.currentTarget }));
  };

  const handleClose = () => {
    setState(p => ({...p, anchorEl: null }));
  };

  const logOut = () => {
    store.auth.logout();
  };

  /* const closeSettings = () => {
    setState(p => ({...p, showSettings: false, anchorEl: null });
  };*/

  const onFeedback = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLScmmcorrmu2oO31_9-sU89S4BQXmjRlXvF7FasR_cw7NvxTCQ/viewform',
      '_blank'
    );
  };

  const onTutorial = () => {
    localStorage.setItem('tutorialDone', '');
    store.router.push('/tutorial')
  }

  const { videoEl } = props;
  const { anchorEl } = state;
  return (
    <React.Fragment>
      <Fab
        className={classes.fab}
        color={'secondary'}
        onClick={handleClick}
        aria-haspopup="true"
        aria-owns={anchorEl ? 'simple-menu' : undefined}
      >
        <UpIcon />
      </Fab>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {store.isGuest() && <MenuItem onClick={() => store.auth.guestSignup()}>
          Login to Save Progress
        </MenuItem>}
        <MenuItem onClick={() => store.router.push('/')}>
          Home
        </MenuItem>
        <MenuItem onClick={onFeedback}>User Feedback</MenuItem>
        <MenuItem onClick={onTutorial}>
          Tutorial
        </MenuItem>
        <MenuItem onClick={() => store.router.push('/campus')}>
          EDU program info
        </MenuItem>
        { !store.isGuest() && <MenuItem onClick={logOut}>Log out</MenuItem> }
      </Menu>
    </React.Fragment>
  );
}
