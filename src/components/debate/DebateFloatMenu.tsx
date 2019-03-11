// stub

import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import {
  createStyles,
  WithStyles, Theme
} from '@material-ui/core/styles';

import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as AppModel from '../../models/AppModel';
import AudioSettings from './AudioSettings';
import DebateExitDialog from './DebateExitDialog';
import Fab from '@material-ui/core/Fab';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

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
      position: 'absolute',
      bottom: theme.spacing.unit * 5,
      right: theme.spacing.unit * 5
    }
  }));

interface Props {
  // store: AppModel.Type,
  videoEl: React.RefObject<HTMLMediaElement>
}

interface State {
  exitPrompt: boolean
  anchorEl: any,
  showSettings?: boolean
}

export default function FloatMenu(props:Props) {
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
    setState(p => ({...p, anchorEl: null, exitPrompt: false }));
  };

  const handleLeave = () => {
    store.debate.resetQueue();
    store.gotoHomeMenu();
    handleClose();
  };

  const handleLeaveRate = () => {
    console.log('handleLeaveRate');
    // setState(p => ({...p,'exitPrompt': false, 'anchorEl': null})
    store.debate.endMatch();
    handleClose();
  }

  const handleMic = () => {
    setState(p => ({...p, showSettings: true} ));
  }

  const closeSettings = () => {
    setState(p => ({...p, showSettings: false, anchorEl: null} ));
  }

    const { videoEl } = props;
    const { anchorEl } = state;
    return (
      <React.Fragment>
        <DebateExitDialog 
          open={state.exitPrompt} 
            onCancel={ ()=>setState(p => ({...p,'exitPrompt': false, 'anchorEl': null})) }
            onExit={handleLeaveRate} />
        { state.showSettings && <AudioSettings onClose={closeSettings} videoEl={videoEl}/> }
        <Fab
          className={classes.fab}
          color='primary'
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
          <MenuItem onClick={handleMic}>Audio settings</MenuItem>
          <MenuItem onClick={() => setState(p => ({...p,'exitPrompt': true}))}>Leave debate now</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
