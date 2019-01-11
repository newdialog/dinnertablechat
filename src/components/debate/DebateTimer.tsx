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
    stepper: {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },
    timerText: {
      padding: '0',
      margin: '0 auto 0 auto',
      borderRadius: '20vh',
      backgroundColor: '#a65451cc',
      fontFamily: "'Roboto Mono', 'Courier New'",
      color: '#ffffff',
      fontSize: '2.5em',
      [theme.breakpoints.down('sm')]: {
        fontSize: '2.5em'
      }
    },
    finishedText: {
      padding: '0',
      margin: '0 auto 0 auto',
      borderRadius: '20vh',
      backgroundColor: '#a65451cc',
      color: '#ffffff',
      fontSize: '2.6em',
      [theme.breakpoints.down('sm')]: {
        fontSize: '2.6em'
      }
    },
    stepWord: {
      margin: '-5px auto -10px auto',
      display: 'none',
      fontSize: '.75em',
      padding: '0 0 0 0',
      backgroundColor: '#a65451',
      [theme.breakpoints.down('sm')]: {
        display: 'inline'
      }
    }
  });

function onMenuClick(store: AppModel.Type) {
  // store.debate.resetQueue();
  // store.gotoHomeMenu();
  store.debate.endMatch();
}

// Random component
const Completionist = ({
  store,
  classes
}: {
  store: AppModel.Type;
  classes: any;
}) => (
  <div style={{ textAlign: 'center' }}>
    <Button
        variant="contained"
        color="primary"
        onClick={() => onMenuClick(store)}
      >
      Leave & Give Review
    </Button><br/><br/>
    <Typography variant="h1" align="center" className={classes.finishedText}>
      Debate Finished
    </Typography>
    
  </div>
);

// const agreed = store.debate.agreed;
const AgreementStep = ({ store }: { store: AppModel.Type }) => (
  <div style={{ textAlign: 'center' }}>
    {store.debate.quarter > 1 && !store.debate.agreed && (
      <Button
        variant="contained"
        onClick={() => store.debate.madeAgreement(true)}
        color={'primary'}
      >
        Agreement Found?
      </Button>
    )}
    {store.debate.agreed && (
      <Button variant="contained" onClick={() => store.debate.endMatch()}>
        Leave & Give Review
      </Button>
    )}
  </div>
);

function track(step:number, store: AppModel.Type) {
  window.gtag('event', 'debate_step_'+step, {
    event_category: 'debate',
    step,
    topic: store.debate.topic,
    position: store.debate.position,
    sameSide: store.debate.position === store.debate.match!.otherState!.position
  });
}

// Renderer callback with condition
let step = 0; // state hack
const renderer = (
  classes,
  store: AppModel.Type,
  { hours, minutes, seconds, completed }
) => {
  
  const steps = ['Introductions', 'Debate', 'Find an Agreement'];
  const lastStep = step;
  if (Number(minutes) < 14) {
    step = 1;
  }
  if (Number(minutes) < 5) {
    step = 2;
  }
  if (completed) {
    step = 3;
  }
  if(lastStep !== step) track(step, store);

  if (step !== store.debate.quarter)
    setTimeout(() => store.debate.setQuarter(step), 1);

  if (completed) return <Completionist store={store} classes={classes} />;

  let hoursDisplay = '';
  if (Number(hours) > 0) {
    hoursDisplay = '{hours}:';
  }
  // Render a countdown
  return (
    <div style={{ padding: 0, margin: 0 }}>
      <Typography variant="h1" align="center" className={classes.timerText}>
        {hoursDisplay}
        {minutes < 10 ? '0' + minutes : minutes}:
        {seconds < 10 ? '0' + seconds : seconds} <br />
        {step === 2 ? null : (
          <span className={classes.stepWord}>{steps[step]}</span>
        )}
      </Typography>

      <br />
      {step === 2 ? (
        <AgreementStep store={store} />
      ) : (
        <Stepper activeStep={step} className={classes.stepper}>
          {steps.map(label => {
            const props = {};
            const labelProps = {};
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
    </div>
  );
};

interface Props {
  onCompleted: () => void;
  store: any;
}

function DebateTimer(props) {
  const { classes, t, onCompleted, store } = props;
  step = 0;

  return (
    <Countdown
      onComplete={onCompleted}
      date={Date.now() + 1000 * 60 * 16}
      renderer={renderer.bind(null, classes, store)}
    />
  );
}

export default inject('store')(HOC(DebateTimer, styles));
