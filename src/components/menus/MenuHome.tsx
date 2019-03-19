import React, { useState, useEffect, useContext } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@material-ui/core';
import * as AppModel from '../../models/AppModel';
import PositionSelector from './PositionSelector';

import CharacterSelection from './CharacterSelection';
import Footer from '../home/Footer';
import HistoryIcon from '@material-ui/icons/History';
import * as Times from '../../services/TimeService';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
import AppFloatMenu from './dash/AppFloatMenu';
import MicPermissionsBtn from './MicPermissionsBtn';

const useStyles = makeStyles((theme: Theme) => ({
  pagebody: {
    backgroundColor: theme.palette.primary.light,
    minHeight: '100vh'
  },
  container: {
    marginTop: '0px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '1000px',
    minWidth: '300px'
  },
  appBar: {
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    // backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    textAlign: 'center',
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 0}px`
  },
  micButton: {
    maxWidth: 600,
    textAlign: 'center',
    margin: '0 auto',
    padding: `0px 0 0px`
  },
  stepper: {
    padding: theme.spacing.unit * 0
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: theme.palette.primary.dark
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  },
  linkhome: {
    color: theme.palette.primary.dark
  }
}));

interface Props {
  isTest?: boolean;
}

function getSteps() {
  return ['Pick your character to start', 'Select Postion']; // , 'Set contribution']
}

function onHistory(store: AppModel.Type) {
  store.router.push('/home');
}

function getStepContent(step: number, store: AppModel.Type) {
  switch (step) {
    case 0:
      return <CharacterSelection store={store} />;
    case 1:
      return <PositionSelector store={store} />;
    case 2:
      return null; // <ContributionSelector store={store} />;
    default:
      return (
        <Typography>
          Hmm, something went wrong. Please try again after refreshing the page.
        </Typography>
      );
  }
}

const renderStepButtons = (activeStep, classes, handleBack) => {
  return (
    <div className={classes.actionsContainer}>
      <Button
        disabled={activeStep === 0}
        onClick={handleBack}
        className={classes.button}
        color="secondary"
      >
        Reset Selections
      </Button>
    </div>
  );
};

export default observer(function MenuHome(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState({ open: false, activeStep: 0 });

  useEffect(() => localStorage.removeItem('quickmatch'), []);

  useEffect(() => {
    if (!Times.isDuringDebate(store.isLive())) {
      store.router.push('/home');
    }
    if (Boolean(props.isTest) !== store.debate.isTest) {
      store.debate.setTest(props.isTest === true);
    }
    handleReset();

    window.gtag('event', 'debate_match_menu', {
      event_category: 'splash',
      guest: store.isGuest()
    });
  }, []);

  const handleBack = () => {
    handleReset();
  };

  const handleReset = () => {
    store.debate.resetQueue();
  };

  if (store.auth.isNotLoggedIn) {
    store.router.push('/');
    return <div />;
  }
  let step = 3;

  if (store.debate.contribution === -1) step = 2; // skip contribution
  if (!store.debate.topic || store.debate.position === -1) step = 1;
  if (store.debate.character === -1) step = 0;

  // if(store.debate.position !== -1 && store.debate.contribution !== -1) step = 2;
  // if(store.debate.character !== -1) step = 3;
  if (step === 3 && store.micAllowed) store.router.push('/match');
  // console.log('step', step)
  const steps = getSteps();

  return (
    <div className={classes.pagebody}>
      <main className={classes.container}>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            {props.isTest && <h2>TEST MODE (/test)</h2>}
            <Typography
              style={{
                fontSize: '2.5em',
                paddingBottom: '0',
                color: '#ffffff'
              }}
              variant="h3"
              align="center"
              color="textSecondary"
            >
              Quickmatch
            </Typography>
            <Typography
              style={{ fontSize: '1em', paddingBottom: '0', color: '#ffffff' }}
              variant="h3"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Get matched with people with different opinions and talk with
              them!
            </Typography>
            {store.isGuest() && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => store.router.push('/')}
                style={{
                  lineHeight: '1.4em',
                  backgroundColor: '#93cad2',
                  marginRight: '12px'
                }}
              >
                About Us
              </Button>
            )}
            <Button
              // className={classes.linkhome}
              // color="secondary"
              // style={{backgroundColor:'#a3a3a3'}}
              style={{ lineHeight: '1.4em', backgroundColor: '#93cad2' }}
              variant="contained"
              color="secondary"
              onClick={() => onHistory(store)}
            >
              Profile History and Awards
            </Button>
          </div>
        </div>
        {/* End hero unit */}
        <div className={classes.stepper}>
          <Stepper
            color="primary"
            activeStep={step}
            orientation="vertical"
            style={{ backgroundColor: '#2db8cc' }}
          >
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {getStepContent(index, store)}
                    {step === 0
                      ? null
                      : renderStepButtons(step, classes, handleBack)}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
          
        </div>
        <div className={classes.micButton}>
          <MicPermissionsBtn store={store}/>
        </div>
        <AppFloatMenu />
      </main>
    </div>
  );
});

// took this out as height is a little wierd on page
// <Footer className={classes.footer}/>
