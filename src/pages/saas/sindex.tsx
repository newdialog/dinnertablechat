import { Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from 'react-reveal/Reveal';

import * as AppModel from '../../models/AppModel';
import * as Times from '../../services/TimeService';
import SClosedDialog from './SClosed';
import SMicSelector from '../../components/saas/menus/SMicSelector';
import PositionSelector from '../../components/saas/menus/SPositionSelector';

const useStyles = makeStyles(
  (theme: Theme) => ({
    pagebody: {
      backgroundColor: '#ddd1bb',
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
      marginRight: theme.spacing(2)
    },
    heroUnit: {
      // backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
      maxWidth: '100vw',
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
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      color: theme.palette.primary.dark
    },
    actionsContainer: {
      marginBottom: theme.spacing(2)
    },
    resetContainer: {
      padding: theme.spacing(3)
    },
    footer: {
      // backgroundColor: '#1b6f7b',
      // padding: theme.spacing(6)
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
    verticalCenter: {
      margin: 0,
      position: 'absolute',
      marginTop: '1em',
      top: '50%',
      left: '50%',
      transform: 'translateY(-50%) translateX(-50%)',
      '@media screen and ( max-height: 495px )': {
        bottom: '1em',
        top: 'auto'
      }
    },
    herotext: {
      fontSize: '1.2em',
      fontWeight: 400,
      paddingBottom: '0',
      width: '400px',
      [theme.breakpoints.down(500)]: {
        fontSize: '4.85vw',
        width: '100vw',
      }
    },
    heroLogo: {
      height: '3em', 
      cursor: 'pointer',
      [theme.breakpoints.down(480)]: {
        width: '90vw',
      }
    },
    heroLogoText: {
      color: '#9f7b74',
      fontSize: '2.6em', 
      cursor: 'pointer',
      [theme.breakpoints.down(550)]: {
        fontSize: '8vw',
      }
    }
  }),
  { name: 'MenuHome' }
);

interface Props {
  isTest?: boolean;
  id:string;
}

function onHelp(store: AppModel.Type) {
  store.router.push('/tutorial');
}

export default observer(function MenuHome(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  // const [state, setState] = React.useState({ open: false, activeStep: 0 });

  useEffect(() => {
    if(store.auth.isAuthenticated && !store.auth.isNotLoggedIn) return;
    
    if(!store.auth.user) {
      store.auth.guestLogin();
    }
    else console.log('user', store.auth.user);
  }, [store.auth.isNotLoggedIn, store.auth]);



  useEffect(() => {
    store.setSaas(true);
    if (store.auth.isNotLoggedIn) {
      store.auth.guestLogin();
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
    store.auth.guestLogin();
    return <div className={classes.pagebody}><h3>Authorizing...</h3></div>;
  }
  let step = 0;

  const topicBit = store.debate.topic ? 1 : 0;
  const charBit = store.debate.character !== -1 ? 1 : 0;

  step = topicBit + charBit;

  // if (store.debate.contribution === -1) step = 2; // skip contribution
  // if (!store.debate.topic && store.debate.position > -1) step = 1;
  // if (store.debate.position === -1) step = 0;

  if (step === 2) {
    // goto 3rd page if debate session is not open
    if (Times.isDuringDebate(store.isLive) !== true) step = 3;
    else store.router.push('/saasmatch'); //  && store.micAllowed :SAAS
  }

  const handleStep = step2 => () => {
    store.debate.resetQueue();
  };

  const onSubmit = (positions:any) => {
    const firstCardID = Object.keys(positions)[0]; // HACK
    const firstKeyPosition = positions[firstCardID]; // HACK
    store.debate.setPosition(firstKeyPosition, firstCardID);
  }

  return (
    <div className={classes.pagebody}>
      <main className={classes.container}>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            {props.isTest && <h2>TEST MODE (/test)</h2>}
            <Typography
              variant="h1"
              align="left"
              color="textSecondary"
              className={classes.heroLogoText}
              gutterBottom
            >
              DebatePlatform
              </Typography>
            <Typography
              className={classes.herotext}
              variant="h3"
              align="left"
              color="textSecondary"
              gutterBottom
            >
              Talk to people with different opinions.
              <br />
              Anonymous discussion via audio call.
              <br />
              Every Sunday from 18:00 till 19:00.
            </Typography>
          </div>
        </div>

        <div className={classes.verticalCenter}>
          {step === 0 && (
            <Reveal effect="fadeInUp" duration={2200}>
              <PositionSelector onSubmit={onSubmit} id={props.id} store={store} />
            </Reveal>
          )}
          {step === 1 && (
            <Reveal effect="fadeInUp" duration={1100}>
              <SMicSelector store={store} />
            </Reveal>
          )}
          {step === 3 && (
            <Reveal effect="fadeInUp" duration={1100}>
              <SClosedDialog store={store} />
            </Reveal>
          )}
        </div>
      </main>
      <div className={classes.footer}>
        {false && (
          <>
            <b>Limited time:</b> You can debate every sunday from 18:00 till
            19:00.
            <br />
            <b>Feedback:</b>{' '}
            <input type="input" defaultValue="Enter your feedback here" />
          </>
        )}
        <b>
          Powered by <a href="https://dinnertable.chat/about" target="_blank" rel="noopener noreferrer">dinnertable.chat</a>
        </b>
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
