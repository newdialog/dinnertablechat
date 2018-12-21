// stub

import React from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import {
  createStyles,
  WithStyles
} from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import classNames from 'classnames';
// import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import green from '@material-ui/core/colors/green';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';
import { inject } from 'mobx-react';
import Fab from '@material-ui/core/Fab';

const styles = theme =>
  createStyles({
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
      bottom: theme.spacing.unit * 5,
      right: theme.spacing.unit * 5
    }
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type,
  videoEl: React.RefObject<HTMLMediaElement>
}

interface State {
  exitPrompt: boolean
  anchorEl: any,
  showSettings?: boolean
}

class AppFloatMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { anchorEl: null, exitPrompt: false };
  }
  private handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleClose = () => {
    this.setState({ anchorEl: null });
  };

  private logOut = () => {
    this.props.store.auth.logout();
  }

  private closeSettings = () => {
    this.setState( {showSettings: false, anchorEl: null} );
  }

  private onFeedback = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLScmmcorrmu2oO31_9-sU89S4BQXmjRlXvF7FasR_cw7NvxTCQ/viewform", "_blank")
  }

  public render() {
    const { classes, videoEl } = this.props;
    const { anchorEl } = this.state;
    return (
      <React.Fragment>
        <Fab
          className={classes.fab}
          color={'secondary'}
          onClick={this.handleClick}
          aria-haspopup="true"
          aria-owns={anchorEl ? 'simple-menu' : undefined}
        >
          <UpIcon />
        </Fab>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={()=>this.props.store.router.push('/')}>About DTC</MenuItem>
          <MenuItem onClick={this.onFeedback}>User Feedback</MenuItem>
          <MenuItem onClick={this.logOut}>Log out</MenuItem>
          
        </Menu>
      </React.Fragment>
    );
  }
}
export default inject('store')(HOC(AppFloatMenu, styles));