import { Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from'@material-ui/core/styles';
import ConfUserPanel from 'components/conf/ConfUserPanel';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Reveal from 'react-reveal/Reveal';

import PositionSelector from '../../components/saas/menus/SPositionSelector';
import ConfWelcome from '../../components/conf/ConfWelcome';
import * as AppModel from '../../models/AppModel';
import * as ConfService from '../../services/ConfService';

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
      maxWidth: '680px',
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
        fontSize: '4.85vw',
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
  { name: 'CIndex' }
);

interface Props {
  isTest?: boolean;
  id: string;
}

function onHelp(store: AppModel.Type) {
  store.router.push('/tutorial');
}

interface State {
  table?:ConfService.ConfIdRow;
  questions?:any;
  resetFlag: number;
}

const PAGE_NAME = 'Mix Opinions';

export default observer(function CIndex(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState<State>({ resetFlag:0 });

  // const id = props.id;
  const confid = props.id;
  // console.log('id', props.id);

  // console.log(store.auth.snapshot());

  // Guest login
  useEffect(() => {
    store.hideNavbar();
  }, []);

  useEffect(() => {
    // console.log('aa', store.auth.isAuthenticated , !store.auth.isNotLoggedIn)
    if (store.auth.isAuthenticated()) return;
    if (!store.auth.isNotLoggedIn) return;

    console.log('--logging in as guest');

    if (!store.auth.user) {
      store.auth.login();
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

    window.gtag('event', ('conf_user_splash_' + confid), {
      event_category: 'conf',
      confid: confid
    });
  }, []);

  // Get question from DB
  useEffect(() => {
    if(!confid) return;
    ConfService.idGet(confid).then(d => {
      if(!d) {
        alert('no id exists');
        window.location.href = '/';
        return;
      }
      const a = d.questions.map( (x,i) => {
        return {
          positions: x.answer.split(', '),
          proposition: x.question,
          id: x.id! || `q${i}-id`
        }
      });

      setState(p => ({ ...p, table: d, questions: a }));
    })
  }, [state.resetFlag]);

  const handleReset = () => {
    if (store.conf.positions) store.conf.resetQueue();
    setState(p => ({ ...p, resetFlag: Date.now() }));
  };

  if (store.auth.isNotLoggedIn) {
    // store.auth.login();
    return (
      <div className={classes.pagebody}>
        <h3>Authorizing...</h3>
      </div>
    );
  }

  let step = 0;
  const posBit = store.conf.positions ? 1 : 0;
  step = posBit;

  if (step === 1) {
    console.log('move to next step');
  }

  if(!confid) step = -1;

  const onSubmit = (positions: any) => {
    window.gtag('event', ('conf_user_submit_' + confid), {
      event_category: 'conf',
      confid: confid,
      non_interaction: false
    });
    store.conf.setPosition(positions);
  };

  return (
    <div className={classes.pagebody}>
      <Helmet title={PAGE_NAME}>
        <meta itemProp="name" content={PAGE_NAME} />
        <meta name="og:title" content={PAGE_NAME} />
        <meta name="title" property="og:title" content={PAGE_NAME} />
      </Helmet>
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
              {PAGE_NAME}
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
          {step === -1 && <ConfWelcome/> }
          {step === 0 && state.questions && (
            <Reveal effect="fadeInUp" duration={2200}>
              <PositionSelector
                onSubmit={onSubmit}
                data={state.questions}
                id={confid}
                store={store}
                prefix="conf"
              />
            </Reveal>
          )}
          {step === 1 && (
            <Reveal effect="fadeInUp" duration={1100}>
              {state.table && <ConfUserPanel key={state.resetFlag} id={confid} store={store} table={state.table} questions={state.questions} handleReset={handleReset}/>}
            </Reveal>
          )}
        </div>
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
  );
});

// took this out as height is a little wierd on page
// <Footer className={classes.footer}/>
/*
<div className={classes.micButton}>
          <MicPermissionsBtn store={store} />
        </div>
*/
