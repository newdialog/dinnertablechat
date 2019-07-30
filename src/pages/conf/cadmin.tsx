import { Button, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import ConfAdmin from 'components/conf/ConfAdminPanel';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Reveal from 'react-reveal/Reveal';

import * as AppModel from '../../models/AppModel';

const useStyles = makeStyles(
  (theme: Theme) => ({
    pagebody: {
      backgroundColor: '#ddd1bb',
      minHeight: '100vh',
      height: '100%'
    },
    container: {
      marginTop: '0px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '100%',
      padding: '1em 1em 0 1em',
      minWidth: '300px',
      minHeight: '100vh'
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
      textAlign: 'center',
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
        width: '100vw'
      }
    },
    heroLogo: {
      height: '3em',
      cursor: 'pointer',
      [theme.breakpoints.down(480)]: {
        width: '90vw'
      }
    },
    heroLogoText: {
      color: '#9f7b74',
      fontSize: '2.6em',
      cursor: 'pointer',
      [theme.breakpoints.down(550)]: {
        fontSize: '8vw'
      }
    }
  }),
  { name: 'MenuHome' }
);

interface Props {
  isTest?: boolean;
  id: string;
}

const PAGE_NAME = "DebateConference";

export default observer(function CAdmin(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState<any>({});

  const id = props.id;

  // console.log(store.auth.snapshot());

  // Guest login
  useEffect(() => {
    store.hideNavbar();
  }, []);

  useEffect(() => {
    if (store.auth.isAuthenticated() && !store.auth.isAdmin())
      store.auth.logout();
    // console.log('aa', store.auth.isAuthenticated , !store.auth.isNotLoggedIn)
    if (store.auth.isAuthenticated()) return;
    if (!store.auth.isNotLoggedIn) return;

    if (!store.auth.user) {
      store.auth.login(window.location.pathname);
    } else console.log('user', store.auth.user);
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
    if (store.conf.positions) store.conf.resetQueue();
  };

  if (store.auth.isNotLoggedIn) {
    store.auth.login();
    return (
      <div className={classes.pagebody}>
        <h3>Authorizing...</h3>
      </div>
    );
  }

  let step = 0;
  const posBit = state.show ? 1 : 0;
  step = posBit;

  if (step === 1) {
    console.log('move to next step');
  }

  const handleStep = step2 => () => {
    store.debate.resetQueue();
  };

  const show = () => {
    setState({ show: true });
  };

  return (
    <>
      <Helmet title={PAGE_NAME}>
        <meta itemProp="name" content={PAGE_NAME} />
        <meta name="og:title" content={PAGE_NAME} />
        <meta name="title" property="og:title" content={PAGE_NAME} />
      </Helmet>
      <div className={classes.pagebody}>
        <main className={classes.container}>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              {store.auth.isAdmin() ? (
                <button onClick={() => store.auth.logout()}>logout</button>
              ) : (
                'not an admin'
              )}
              {props.isTest && <h2>TEST MODE (/test)</h2>}
              <Typography
                variant="h1"
                align="left"
                color="textSecondary"
                className={classes.heroLogoText}
                gutterBottom
              >
                {PAGE_NAME} Admin
              </Typography>
              {step === 0 &&
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
              </Typography>}
            </div>
          </div>

          
            {step === 0 && (
              <div className={classes.verticalCenter}>
                <Reveal effect="fadeInUp" duration={2200}>
                  <Typography
                    variant="h4"
                    align="center"
                    color="textSecondary"
                    gutterBottom
                  >
                    To start matching, please visit:
                  </Typography>
                  <Typography
                    variant="h2"
                    align="center"
                    color="textSecondary"
                    gutterBottom
                  >
                    {window.location.origin}/c/{id}
                  </Typography>
                  <Button
                    variant="contained"
                    // size="small"
                    color="secondary"
                    onClick={show}
                  >
                    Show Results
                  </Button>
                </Reveal>
              </div>
            )}
            {step === 1 && (
              <div style={{marginBottom: '2em'}}>
                <Reveal effect="fadeInUp" duration={1100}>
                  <ConfAdmin id={id} store={store} />
                </Reveal>
              </div>
            )}
        </main>
        <div className={classes.footer}>
          <b>
            Powered by{' '}
            <a
              href="https://www.dinnertable.chat/about"
              target="_blank"
              rel="noopener noreferrer"
            >
              dinnertable.chat
            </a>
          </b>
        </div>
      </div>
    </>
  );
});

// took this out as height is a little wierd on page
// <Footer className={classes.footer}/>
/*
<div className={classes.micButton}>
          <MicPermissionsBtn store={store} />
        </div>
*/
