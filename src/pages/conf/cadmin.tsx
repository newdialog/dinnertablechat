import { Button, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import ConfAdmin from 'components/conf/ConfAdminPanel';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Reveal from 'react-reveal/Reveal';

import * as AppModel from '../../models/AppModel';
import ConfAdminPanelDash from 'components/conf/ConfAdminPanelDash';
import ConfAdminPanelSlides from 'components/conf/ConfAdminPanelSlides';
import { ConfUIQuestion } from 'services/ConfService';

import * as ConfService from '../../services/ConfService';

import QRCode from 'qrcode.react';

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
      width: '100%',
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
      zIndex: 0,
      // backgroundColor: '#1b6f7b',
      // padding: theme.spacing(6)
      width: '100%',
      margin: '2em auto 0.07em auto',
      // position: 'absolute',
      // bottom: '.15em',
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
      textAlign: 'center',
      margin: '1.4em auto 0 auto',
      // position: 'absolute',
      // minWidth: '100%',
      width: '100%',
      maxWidth: '1400px',
      minHeight: 'calc(100vh - 250px)'
      // top: '50%',
      // left: '50%',
      /* transform: 'translateY(-50%) translateX(-50%)',
      '@media screen and ( max-height: 495px )': {
        bottom: '1em',
        top: 'auto'
      }*/
    },
    herotext: {
      fontSize: '1.2em',
      fontWeight: 400,
      paddingBottom: '0',
      // width: '400px',
      [theme.breakpoints.down(500)]: {
        fontSize: '4.85vw'
        // width: '100vw'
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
  { name: 'CAdmin' }
);

interface Props {
  isTest?: boolean;
  id: string;
}

interface State {
  view: 'slides' | 'dash';
  show: boolean;
  kill: boolean;
  table?: ConfService.ConfIdRow;
  questions?: ConfUIQuestion[];
}

const PAGE_NAME = 'Mix Opinions';

export default observer(function CAdmin(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState<State>({
    view: 'slides',
    show: false,
    kill: false
  });

  const confid = props.id;
  // const confid = id;

  const isAuthUser = store.isNotGuest();

  // console.log(store.auth.snapshot());

  // Guest login
  useEffect(() => {
    store.hideNavbar();
  }, []);

  const refreshTable = async () => {
    if (!confid) return null;
    const d = await ConfService.idGet(confid);
    if (!d) {
      alert('no id exists');
      window.location.href = '/';
      return null;
    }
    const a = d.questions.map(
      (x, i): ConfUIQuestion => {
        return {
          version: d.version,
          positions: x.answer.split(', '),
          proposition: x.question,
          id: x.id! || `q${i}-id` // TODO x.i
        };
      }
    );

    setState(p => ({ ...p, table: d, questions: a }));

    return d!;
  };

  // Get question from DB
  useEffect(() => {
    refreshTable();
  }, []);

  /*
  useEffect(() => {
    // already redirecting to login
    if (state.kill) return;
    if (!store.auth.isAuthenticated()) return;

    if (!isNotGuest) {
      console.log('isAdmin', isNotGuest);
      window.alert('Please login to continue.');
      store.auth.logoutLogin();
      setState(p => ({ ...p, kill: true }));
    } else {
      // if (store.auth.isNotLoggedIn) return;
      console.log('Admin user:', store.auth.user);
    }
  }, [store.auth.isNotLoggedIn, store.auth.user, isNotGuest]);
  */

  useEffect(() => {
    // store.setSaas(true);

    const isTest = !!localStorage.getItem('test');
    localStorage.removeItem('test');

    if (isTest) console.log('props.isTest', isTest);
    if (isTest !== store.debate.isTest) {
      store.debate.setTest(isTest);
    }
    handleReset();

    window.gtag('event', 'conf_admin_splash_' + confid, {
      event_category: 'conf',
      confid: confid
    });
  }, []);

  const handleReset = () => {
    if (store.conf.positions) {
      store.conf.resetQueue();
      window.gtag('event', 'conf_admin_reset_' + confid, {
        event_category: 'conf',
        confid: confid,
        non_interaction: false
      });
    }
  };

  /*
  if (store.auth.isNotLoggedIn) {
    store.auth.login();
    return (
      <div className={classes.pagebody}>
        <h3>Authorizing...</h3>
      </div>
    );
  }
  */

  let step = 0;
  const posBit = state.show ? 1 : 0;
  step = posBit;

  if (step === 1) {
    // console.log('move to next step');
  }

  const show = () => {
    setState(p => ({ ...p, show: true }));
  };

  const toggleView = () => {
    if (state.view !== 'slides') setState(p => ({ ...p, view: 'slides' }));
    else setState(p => ({ ...p, view: 'dash' }));
  };

  const viewComp =
    state.view === 'dash' ? ConfAdminPanelDash : ConfAdminPanelSlides;

  // url gen
  let url = window.location.origin + '/c/' + confid;
  if (store.isMixerProd()) url = 'https://mxop.at/' + confid; // window.location.origin + '/' + confid; // use root
  // console.log('store.isMixerProd()', store.isMixerProd());

  if (state.table && state.table.curl) url = state.table.curl;

  const visualURL = url.replace('http://', '').replace('https://', '');
  // url += 'aaaaaaaaaaaa.';

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
              <div style={{ textAlign: 'right', float: 'right' }}>
                {isAuthUser && (
                  <button onClick={() => store.auth.logout()}>logout</button>
                )}
                {
                  <button onClick={() => toggleView()}>
                    switch to {state.view === 'slides' ? 'dash' : 'slides'}
                  </button>
                }
              </div>
              {props.isTest && <h2>TEST MODE (/test)</h2>}
              {step === 0 && (
                <>
                  <Typography
                    variant="h1"
                    align="left"
                    color="textSecondary"
                    className={classes.heroLogoText}
                    gutterBottom
                  >
                    {PAGE_NAME}
                  </Typography>

                  <Typography
                    className={classes.herotext}
                    variant="h3"
                    align="left"
                    color="textSecondary"
                    gutterBottom
                  >
                    Mix people with different opinions
                    <br />
                    in groups for a respectful discussion
                  </Typography>
                </>
              )}
            </div>
          </div>

          {step === 0 && (
            <div className={classes.verticalCenter}>
              <QRCode value={url} />
              <br />
              <br />
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
                  style={{ fontSize: 200 / url.length + 'vmin' }}
                >
                  {visualURL}
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
            <div
              style={{ marginBottom: '2em' }}
              className={classes.verticalCenter}
            >
              <Typography
                variant="h2"
                align="center"
                color="textSecondary"
                style={{ fontSize: 200 / url.length + 'vmin' }}
              >
                {visualURL}
              </Typography>
              <Reveal effect="fadeInUp" duration={1100}>
                {state.table && (
                  <ConfAdmin
                    id={confid}
                    refreshTable={refreshTable}
                    store={store}
                    view={viewComp}
                    table={state.table}
                    questions={state.questions!}
                  />
                )}
              </Reveal>
            </div>
          )}
        </main>
        <div className={classes.footer}>
          <b>
            Powered by{' '}
            <a
              href="https://www.newdialogue.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              NewDialogue.org
            </a>
          </b>
        </div>
      </div>
    </>
  );
});
