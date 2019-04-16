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
import * as AppModel from '../../../models/AppModel';
import PositionSelector from './SPositionSelector';
import Footer from '../../home/Footer';
import * as Times from '../../../services/TimeService';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
import AppFloatMenu from '../../menus/dash/AppFloatMenu';
import MicPermissionsBtn from './SMicPermissionsBtn';
import { Auther } from '../../Auther';

const useStyles = makeStyles((theme: Theme) => ({
  pagebody: {
    backgroundColor: '#d5d5d5',
    minHeight: '100vh'
  },
  container: {
    marginTop: '0px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '100%',
    padding: '1em 1em 0 1em',
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
    // maxWidth: 800,
    textAlign: 'left',
    margin: '0 auto',
    padding: `0`
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
    // backgroundColor: '#1b6f7b',
    // padding: theme.spacing.unit * 6
    width: '100%',
    margin: '0 auto',
    position: 'absolute',
    bottom: '1em',
    textAlign: 'center'
  },
  linkhome: {
    color: theme.palette.primary.dark
  },
  stepLabel: {
    fontSize: '1.1em !important',
    color: '#ffffff !important',
    fontWeight: 'bold'
  },
}), { withTheme: true, name: 'MenuHome' });

interface Props {
  isTest?: boolean;
}

function onHelp(store: AppModel.Type) {
  store.router.push('/tutorial');
}

export default observer(function MenuHome(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  // const [state, setState] = React.useState({ open: false, activeStep: 0 });

  useEffect(() => localStorage.removeItem('quickmatch'), []);

  useEffect(() => {
    store.setSaas(true);
    if(store.auth.isNotLoggedIn) {
      store.auth.doGuestLogin();
    }

    const isTest = !!localStorage.getItem('test');
    localStorage.removeItem('test');

    if (isTest) console.log('props.isTest', isTest);
    if (!Times.isDuringDebate(store.isLive)) {
      // store.router.push('/home');
      // TODO: show end-debate popup :sass
    }
    if (isTest !== store.debate.isTest) {
      store.debate.setTest(isTest);
    }
    handleReset();

    window.gtag('event', 'saas_debate_match_menu', {
      event_category: 'splash',
      guest: store.isGuest()
    });
  }, []);
  
  const handleReset = () => {
    store.debate.resetQueue();
  };

  if (store.auth.isNotLoggedIn) {
    return <div />;
  }
  let step = 3;

  if (store.debate.contribution === -1) step = 2; // skip contribution
  if (!store.debate.topic || store.debate.position === -1) step = 1;
  if (store.debate.character === -1) step = 0;

  if (step === 3) store.router.push('/match'); //  && store.micAllowed :SAAS

  const handleStep = step => () => {
    store.debate.resetQueue();
  };

  return (
    <div className={classes.pagebody}>
      <main className={classes.container}>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            {props.isTest && <h2>TEST MODE (/test)</h2>}
            <img src="./logos/appbar-logo-color.png" 
              crossOrigin="anonymous"
              title="DTC Home"
              style={{ height: '3em', cursor: 'pointer' }}/>
            <Typography
              style={{
                fontSize: '1.2em',
                fontWeight: 400,
                paddingBottom: '0',
                width:'400px'
              }}
              variant="h3"
              align="left"
              color="textSecondary"
              gutterBottom
            >
              Get matched with people with different opinions and talk with
              them!
            </Typography>
          </div>
        </div>

        <div className={classes.stepper}>
          <PositionSelector store={store} />
        </div>
        
      </main>
      <div className={classes.footer}>
        <b>Limited time:</b> You can debate every sunday from 18:00 till 19:00.<br/>
        <b>Feedback:</b> <input type="input" defaultValue="Enter your feedback here"/>
      </div>
    </div>
  );
});

// took this out as height is a little wierd on page
// <Footer className={classes.footer}/>
/*
<div className={classes.micButton}>
          <MicPermissionsBtn store={store} />
        </div>
*/