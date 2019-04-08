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
      // paddingTop: theme.spacing.unit * 20,
      padding: 0, 
      margin: 0,
      backgroundColor: '#90887a'
    },
    timerText2: {
      fontFamily: "'Roboto Mono', 'Courier New'",
      padding: '0',
      margin: 0
    },
    timerText: {
      padding: '0',
      margin: 0,
    },
    time: {
    }
  }));

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
  isDuringDebate = Times.isDuringDebate(store.isLive);
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
      <>Daily event ending&nbsp;in:</>
    ) : (
      <>Daily event starts&nbsp;in:</>
    );
    return (
      <div className={classes.root}>
        <Typography
          variant="h6"
          align="center"
          className={classes.timerText}
          style={{ fontSize: '110%' }}
        >
          {label}
        </Typography>

        <Typography
          variant="h4"
          align="center"
          className={classes.timerText2}
          style={{ fontSize: '240%', color: 'white' }}
        >
          {hours < 10 ? '0' + hours : hours}&nbsp;{minutes < 10 ? '0' + minutes : minutes}&nbsp;{seconds < 10 ? '0' + seconds : seconds}
        </Typography>

        <Typography
          variant="h6"
          align="center"
          className={classes.timerText}
          style={{ fontSize: '.75em' }}
        >
          HRS&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MINS
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SECS
          <br/><span>1pm-6pm PST / 4pm-9pm EST</span>
        </Typography>

        <Typography
          variant="h6"
          align="center"
          className={classes.timerText}
          style={{ fontSize: '.75em' }}
        >
        <a 
        style={{ color: '#95d4ff', textDecoration: 'underline' }}
        onClick={trackOutboundLinkClick(
                'https://www.facebook.com/events/522239821514316/',
              true, true)} href='https://www.facebook.com/events/522239821514316/' target='_blank'>Add to Facebook Calendar</a>
        </Typography>
      </div>
    );
  }
};
// <br/><span style={{color:'#844d4d'}}>For one hour daily!</span>
interface Props {
  onCompleted?: (isDuringDebate: boolean) => void;
  store:AppModel.Type,
}

function BannerTimer(props:Props) {
  const classes = useStyles({});
  const { onCompleted } = props;
  const store = props.store;

  // const launch = Times.getDebateStart().getTime();

  let isDuringDebate = Times.isDuringDebate(store.isLive);
  const endTime = isDuringDebate
    ? Times.getDebateEnd().getTime()
    : Times.getDebateStart().getTime();

  // console.log('isDuringDebate', isDuringDebate, 'endTime', endTime)

  return (
    <Countdown
      onComplete={() => {
        // setTimeout( () => {
          console.log('BannerTimer completed');
          isDuringDebate = Times.isDuringDebate(store.isLive);
          store.setDailyOpen(isDuringDebate);
          !!onCompleted && onCompleted(isDuringDebate);
        // }, 2000);
      }}
      date={endTime}
      renderer={renderer.bind(null, classes, store, isDuringDebate)}
    />
  );
}

export default BannerTimer;
