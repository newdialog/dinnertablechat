import { Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from 'react-reveal/Reveal';

import * as AppModel from '../../models/AppModel';
import * as Times from '../../services/TimeService';
import PositionSelector from '../../components/saas/menus/SPositionSelector';
import PleaseWaitResults from 'components/conf/PleaseWaitResults';

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

export default observer(function CIndex(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const id = props.id;
  // console.log('id', props.id);

  // console.log(store.auth.snapshot());

  // Guest login
  useEffect(() => {
    store.hideNavbar();
  }, []);

  useEffect(() => {
    // console.log('aa', store.auth.isAuthenticated , !store.auth.isNotLoggedIn)
    if(store.auth.isAuthenticated()) return;
    if(!store.auth.isNotLoggedIn) return;

    console.log('--logging in as guest');
    
    if(!store.auth.user) {
      store.auth.login();
    }
    else console.log('user', store.auth.user);
  }, [store.auth.isNotLoggedIn, store.auth.user]);

  useEffect(() => {
    // store.setSaas(true);

    const isTest = !!localStorage.getItem('test');
    localStorage.removeItem('test');

    if (isTest) console.log('props.isTest', isTest);
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
    if(store.conf.positions) store.conf.resetQueue();
  };

  if (store.auth.isNotLoggedIn) {
    // store.auth.login();
    return <div className={classes.pagebody}><h3>Authorizing...</h3></div>;
  }

  let step = 0;
  const posBit = store.conf.positions ? 1 : 0;
  step = posBit;

  if (step === 1) {
    console.log('move to next step');
  }

  const handleStep = step2 => () => {
    store.debate.resetQueue();
  };

  const onSubmit = (positions:any) => {
    store.conf.setPosition(positions);
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
              DebateConference
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
              Discussion via mixed viewpoint matchmaking.
            </Typography>
          </div>
        </div>

        <div className={classes.verticalCenter}>
          {step === 0 && (
            <Reveal effect="fadeInUp" duration={2200}>
              <PositionSelector onSubmit={onSubmit} id={props.id} store={store} prefix="conf" />
            </Reveal>
          )}
          {step === 1 && (
            <Reveal effect="fadeInUp" duration={1100}>
              <PleaseWaitResults id={id} store={store}/>
            </Reveal>
          )}
        </div>
      </main>
      <div className={classes.footer}>
        <b>
          Powered by <a href="https://www.dinnertable.chat/about" target="_blank" rel="noopener noreferrer">dinnertable.chat</a>
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
