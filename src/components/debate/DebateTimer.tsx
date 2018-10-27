import React from 'react';
import Countdown from 'react-countdown-now';
import { Typography, withStyles } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import HOC from '../HOC';

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
        margin: 0
    },
    stepWord: {
      margin: '-5px auto -10px auto',
      display: 'none',
      fontSize: '60%',
      padding: '0 0 0 0',
      [theme.breakpoints.down('sm')]: {
        display: 'inline'
      }
    }
  });

// Random component
const Completionist = () => (
  <div>
    <Typography variant="h1" align="center">
      Debate Completed
    </Typography>
  </div>
);

// Renderer callback with condition
const renderer = (classes, { hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    const steps = ['Introductions', 'Debate', 'Find an Agreement'];

    let step = 0;
    if (Number(minutes) < 14) {
      step = 1;
    }
    if (Number(minutes) < 5) {
      step = 2;
    }
    // Render a countdown
    return (
      <div style={{padding:0, margin:0}}>
        <Typography variant="h1" align="center" className={classes.timerText}>
          {hours}:{minutes}:{seconds} <br />
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
    onCompleted:() => void;
}

function DebateTimer(props) {
  const { classes, t, onCompleted } = props;

  return (
    <Countdown
      completed={onCompleted}
      date={Date.now() + 1000 * 60 * 15}
      renderer={renderer.bind(null, classes)}
    />
  );
}

export default HOC(DebateTimer, styles);
