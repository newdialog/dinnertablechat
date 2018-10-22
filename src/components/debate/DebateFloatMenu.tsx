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
import AudioSettings from './AudioSettings';

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
      position: 'absolute',
      bottom: theme.spacing.unit * 5,
      right: theme.spacing.unit * 5
    }
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type
}

class FloatMenu extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = { anchorEl: null };
  }
  private handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleClose = () => {
    this.setState({ anchorEl: null });
  };

  private handleLeave = () => {
    this.props.store.debate.resetQueue();
    this.props.store.router.push('/play');
    this.handleClose();
  };

  private handleLeaveRate = () => {
    this.props.store.debate.endMatch();
    this.handleClose();
  }

  private handleMic = () => {
    this.setState( {showSettings: true} );
  }

  private closeSettings = () => {
    this.setState( {showSettings: false, anchorEl: null} );
  }

  public render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return (
      <React.Fragment>
        { this.state.showSettings && <AudioSettings onClose={this.closeSettings}/> }
        <Button
          variant="fab"
          className={classes.fab}
          color={'primary'}
          onClick={this.handleClick}
          aria-haspopup="true"
          aria-owns={anchorEl ? 'simple-menu' : undefined}
        >
          <UpIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleMic}>Mic settings</MenuItem>
          <MenuItem onClick={this.handleLeaveRate}>Quit and rate</MenuItem>
          <MenuItem onClick={this.handleLeave}>Leave debate</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}
export default inject('store')(HOC(FloatMenu, styles));
