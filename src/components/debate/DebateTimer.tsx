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
      backgroundColor:'#a65451cc',
    },
    stepWord: {
      margin: '-5px auto -10px auto',
      display: 'none',
      fontSize: '60%',
      padding: '0 0 0 0',
      backgroundColor:'#a65451',
      [theme.breakpoints.down('sm')]: {
        display: 'inline'
      }
    }
  });

function onMenuClick(store: AppModel.Type) {
  store.debate.resetQueue();
  store.gotoHomeMenu();
}

// Random component
const Completionist = ({ store }: { store: AppModel.Type }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      variant="contained"
      color="primary"
      onClick={() => onMenuClick(store)}
    >
      Back to Menu
    </Button>
    <Typography variant="h1" align="center">
      Debate Ended
    </Typography>
  </div>
);

// Renderer callback with condition
const renderer = (
  classes,
  store: AppModel.Type,
  { hours, minutes, seconds, completed }
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

    let hoursDisplay = '';
    if (Number(hours) > 0) {
      hoursDisplay = '{hours}:';
    }
    // Render a countdown
    return (
      <div style={{ padding: 0, margin: 0 }}>
        <Typography variant="h1" align="center" className={classes.timerText}>
          {hoursDisplay}
          {minutes}:{seconds} <br />
          <span className={classes.stepWord}>{steps[step]}</span>
        </Typography>

        <br />
        <Stepper activeStep={step} className={classes.stepper}>
          {steps.map((label, index) => {
            const props = {};
            const labelProps = {};
            /* if (this.isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (this.isStepSkipped(index)) {
              props.completed = false;
            }*/
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  }
};

interface Props {
  onCompleted: () => void;
}

function DebateTimer(props) {
  const { classes, t, onCompleted, store } = props;

  return (
    <Countdown
      completed={onCompleted}
      date={Date.now() + 1000 * 60 * 15}
      renderer={renderer.bind(null, classes, store)}
    />
  );
}

export default inject('store')(HOC(DebateTimer, styles));
