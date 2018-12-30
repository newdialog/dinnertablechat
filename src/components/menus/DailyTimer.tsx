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
import * as Times from '../../services/TimeService';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    timerText: {
      padding: '0',
      margin: 0,
      color: '#06616b'
    },
    time: {
        color: '#06616b'
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
    </Typography>
  </div>
);

// Renderer callback with condition
const renderer = (
  classes,
  store: AppModel.Type,
  isDuringDebate: boolean,
  { days, hours, minutes, seconds, completed }
) => {
  isDuringDebate = Times.isDuringDebate();
  if (completed) {

      
      if(store.dailyOpen!=isDuringDebate) {
        // setTimeout(() => {
          console.log('BannerTimer completed');
          store.setDailyOpen(isDuringDebate);
          window.location.reload(true);
        // }, 3001);
      }
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

    const label = isDuringDebate ? 'Daily event ending in' : 'Daily event starts in';
    return (
      <div style={{ padding: 0, margin: 0 }}>
        <Typography variant="h6" align="center" className={classes.timerText} style={{fontSize: '1em'}}>
          {label}:
        </Typography>
        
        <Typography variant="h4" align="center" className={classes.time} style={{fontSize: '1.6em' }}>
          {hours}&nbsp;&nbsp;{minutes}&nbsp;&nbsp;{seconds}
        </Typography>

        <Typography variant="h6" align="center" className={classes.timerText} style={{fontSize: '.6em' }}>
        &nbsp;&nbsp;HRS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MINS &nbsp;&nbsp;&nbsp; SECS
        </Typography>

        <br />
        
      </div>
    );
  }
};

interface Props {
  onCompleted: () => void;
}

function DailyEndTimer(props) {
  const { classes, t, onCompleted } = props;
  const store = props.store as AppModel.Type;

  const isDuringDebate = Times.isDuringDebate();
  const endTime = isDuringDebate ? Times.getDebateEnd().getTime() : Times.getDebateStart().getTime();

  return (
    <Countdown
      onComplete={()=> onCompleted && onCompleted() }
      date={endTime}
      renderer={renderer.bind(null, classes, store, isDuringDebate)}
    />
  );
}

export default inject('store')(HOC(DailyEndTimer, styles));
