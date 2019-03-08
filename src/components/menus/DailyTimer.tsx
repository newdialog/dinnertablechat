import React from 'react';
import Countdown from 'react-countdown-now';
import { Typography, withStyles, Button } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

import * as AppModel from '../../models/AppModel';
import * as Times from '../../services/TimeService';

import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
        color: '#06616b',
        fontFamily: "'Roboto Mono', 'Courier New'",
    }
  }));

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
        
        <Typography variant="h4" align="center" className={classes.time} style={{fontSize: '2em' }}>
        {hours < 10 ? '0' + hours : hours}&nbsp;{minutes < 10 ? '0' + minutes : minutes}&nbsp;{seconds < 10 ? '0' + seconds : seconds}
        </Typography>

        <Typography variant="h6" align="center" className={classes.timerText} style={{fontSize: '.6em' }}>
          HRS&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MINS
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SECS
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
  const classes = useStyles({});
  const { onCompleted } = props;
  const store = props.store;

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

export default DailyEndTimer;
