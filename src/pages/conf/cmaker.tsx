import { Button, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Reveal from 'react-reveal/Reveal';

import * as ConfService from '../../services/ConfService';

import * as AppModel from '../../models/AppModel';
import ConfMakerForm from 'components/conf/ConfMakerForm';

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
  { name: 'CAdmin' }
);

interface Props {
  id?: string;
}

interface State {
  data?: any[];
}

const PAGE_NAME = 'Event Debate Tool';

export default observer(function CMaker(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState<State>({
    // data: []
  });

  const id = ''; // props.id;
  const confid = id;

  useEffect(() => {
    store.hideNavbar();
  }, []);

  useEffect(()=> {
    ConfService.idGet('bbb').then(x=>{
      setState(p=>({...p, data:x}));
    })
  }, []);

  useEffect(() => {
    handleReset();

    window.gtag('event', ('conf_new_splash_'+confid), {
      event_category: 'conf',
      confid: confid
    });
  }, []);

  const handleReset = () => {
    if (store.conf.positions) {
      // store.conf.resetQueue();
      window.gtag('event', ('conf_new_reset_'+confid), {
        event_category: 'conf',
        confid: confid,
        non_interaction: false
      });
    }
  };

  if (store.auth.isNotLoggedIn) {
    store.auth.login();
    return (
      <div className={classes.pagebody}>
        <h3>Authorizing...</h3>
      </div>
    );
  }

  const show = () => {
    setState(p => ({ ...p, show: true }));
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
              <div style={{textAlign:'right', float:'right'}}>
              </div>
              {true && (
              <><Typography
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
                </Typography></>
              )}
            </div>
          </div>

          
            <div className={classes.verticalCenter}>
              {state.data!==undefined && <ConfMakerForm data={state.data}/> }
            </div>
          
        </main>
        <div className={classes.footer}>
          <b>
            Powered by{' '}
            <a
              href="https://www.newdialog.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              NewDialog.org
            </a>
          </b>
        </div>
      </div>
    </>
  );
});
