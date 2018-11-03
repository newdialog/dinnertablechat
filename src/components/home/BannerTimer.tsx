import React from 'react';
import Countdown from 'react-countdown-now';
import { Typography, withStyles, Button } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import HOC from '../HOC';
import { inject } from 'mobx-react';
import * as AppModel from '../../models/AppModel';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    timerText: {
      padding: '0',
      margin: 0,
      color:'0xffffff'
    },
    time: {
        color:'0xffffff'
    }
  });

function onMenuClick(store: AppModel.Type) {
  // store.debate.resetQueue();
  // store.gotoHomeMenu();
}

// Random component
const Completionist = ({ store }: { store: AppModel.Type }) => (
  <div style={{ textAlign: 'center' }}>
    <Typography variant="h1" align="center">
      Doors will be opening soon!
    </Typography>
  </div>
);

// Renderer callback with condition
const renderer = (
  classes,
  store: AppModel.Type,
  { days, hours, minutes, seconds, completed }
) => {
  if (completed) {
    // Render a completed state
    return <Completionist store={store} />;
  } else {
    const steps = ['Introductions', 'Debate', 'Find an Agreement'];

    let step = 0;
    if (Number(minutes) < 14) {
      step = 1;
    }
    if (Number(minutes) < 5) {
      step = 2;
    }

    // let hoursDisplay = '';
    // if (Number(hours) > 0) {
    //   hoursDisplay = '{hours}:';
    // } <span className={classes.stepWord}>{steps[step]}</span>
    // Render a countdown 
    return (
      <div style={{ padding: 0, margin: 0 }}>
        <Typography variant="h6" align="center" className={classes.timerText} style={{fontSize: '110%', color:'#555555'}}>
          The event begins&nbsp;in:
        </Typography>
        
        <Typography variant="h4" align="center" className={classes.timerText} style={{fontSize: '240%', color:'white'}}>
          {days}&nbsp;&nbsp;{hours}&nbsp;&nbsp;{minutes}&nbsp;&nbsp;{seconds}
        </Typography>

        <Typography variant="h6" align="center" className={classes.timerText} style={{fontSize: '.75em', color:'#555555'}}>
         DAYS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; HRS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MINS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SECS
        </Typography>

        <br />
        
      </div>
    );
  }
};

interface Props {
  onCompleted: () => void;
}

function BannerTimer(props) {
  const { classes, t, onCompleted, store } = props;

  const launch = (new Date('2018-11-26T12:00:00')).getTime();

  return (
    <Countdown
      completed={onCompleted}
      date={launch}
      renderer={renderer.bind(null, classes, store)}
    />
  );
}

export default inject('store')(HOC(BannerTimer, styles));
