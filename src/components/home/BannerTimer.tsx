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
      color: '0xffffff'
    },
    time: {
      color: '0xffffff'
    }
  });

function onMenuClick(store: AppModel.Type) {
  // store.debate.resetQueue();
  // store.gotoHomeMenu();
}

// Random component
const Completionist = ({ store }: { store: AppModel.Type }) => (
  <div style={{ textAlign: 'center' }}>
    <Typography variant="h1" align="center" />
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
    // store.setDailyOpen(true);
    // Render a completed state
    
      if(store.dailyOpen!=isDuringDebate) {
        // setTimeout(() => {
          console.log('BannerTimer completed');
          store.setDailyOpen(isDuringDebate);
          window.location.reload(true);
        // }, 3001);
      }
      // 
    
    // !!onCompleted && onCompleted(isDuringDebate);
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

    const label = isDuringDebate ? (
      <>Daily event ending&nbsp;in</>
    ) : (
      <>Daily event starts&nbsp;in</>
    );
    return (
      <div style={{ padding: 0, margin: 0 }}>
        <Typography
          variant="h6"
          align="center"
          className={classes.timerText}
          style={{ fontSize: '110%', color: '#555555' }}
        >
          {label}
        </Typography>

        <Typography
          variant="h4"
          align="center"
          className={classes.timerText}
          style={{ fontSize: '240%', color: 'white' }}
        >
          {days}&nbsp;&nbsp;{hours}&nbsp;&nbsp;{minutes}&nbsp;&nbsp;{seconds}
        </Typography>

        <Typography
          variant="h6"
          align="center"
          className={classes.timerText}
          style={{ fontSize: '.75em', color: '#555555' }}
        >
          DAYS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; HRS
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MINS
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SECS
          <br/><span style={{color:'#844d4d'}}>4pm PST / 5pm MST / 6pm CST / 7pm EST</span>
          
        </Typography>

        <br />
      </div>
    );
  }
};
// <br/><span style={{color:'#844d4d'}}>For one hour daily!</span>
interface Props {
  onCompleted?: (isDuringDebate: boolean) => void;
  t:any,
  classes:any,
  store:AppModel.Type,
}

function BannerTimer(props:Props) {
  const { classes, t, onCompleted } = props;
  const store = props.store;

  // const launch = Times.getDebateStart().getTime();

  let isDuringDebate = Times.isDuringDebate();
  const endTime = isDuringDebate
    ? Times.getDebateEnd().getTime()
    : Times.getDebateStart().getTime();

  return (
    <Countdown
      completed={() => {
        // setTimeout( () => {
          console.log('BannerTimer completed');
          isDuringDebate = Times.isDuringDebate();
          store.setDailyOpen(isDuringDebate);
          !!onCompleted && onCompleted(isDuringDebate);
        // }, 2000);
      }}
      date={endTime}
      renderer={renderer.bind(null, classes, store, isDuringDebate)}
    />
  );
}

export default inject('store')(HOC(BannerTimer, styles));
