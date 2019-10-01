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
import ConfMakerList from 'components/conf/ConfMakerList';

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
  confid: string | null,
  data?: {conf:string, user:string, ready:boolean, questions: any[]};
  updater: number;
}

const PAGE_NAME = 'Event Debate Tool';

export default observer(function CMaker(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState<State>({
    confid: null,
    updater: 0
  });

  // const id = ''; // props.id;
  const confid = state.confid;
  const user = store.getRID();

  useEffect(() => {
    store.hideNavbar();
  }, []);

  async function handleSubmit(data: {conf:string, user:string, maxGroups:number, minGroupUserPairs:number} | any) {
    if(!data.user) throw new Error('no user');
    if(!data.conf) throw new Error('no conf');
    if(data.conf.length < 3) throw new Error('conf id must be longer than 3 characters');
    if(!data.questions || data.questions.length===0) throw new Error('must have at least one question');

    const existing = await ConfService.idGet(data.conf);
    if(existing && existing.user !== user) throw new Error('conference id already taken by another user');

    
    console.log('saving', JSON.stringify(data));
    try {
      await ConfService.idSubmit(data.conf, data.user, data.questions, data.maxGroups, data.minGroupUserPairs);
      alert('saved');
      setState(p=>({...p, updater: p.updater+1 }));
    } catch(e) {
      console.error(e);
      if(e.toString().indexOf('authorized ') > 0) alert('Error: not authorized to update these questions');
    }
  }

  // Ensure use is not unregistered guest
  useEffect(() => {
    if(store.isGuest()) store.login();
  }, [store.isGuest()]);

  // TODO cleanup
  useEffect(() => {
    if(!confid) return;

    window.gtag('event', ('conf_new_splash_'+confid), {
      event_category: 'conf',
      confid: confid
    });
  }, [confid]);

  // Get Row Data
  useEffect(() => {
    if (!state.confid) {
      const x = ConfService.idNewQuestions('', user!);
      setState(p => ({ ...p, data: x as ConfService.ConfIdRow }));
      return;
    }

    ConfService.idGet(state.confid as string).then(x => {
      if (x && x.user !== user) {
        alert('Error: This is owned by a different user. Read-only mode.');
      }
      // init model if not exists
      if (!x) {
        x = ConfService.idNewQuestions('', user!);
      }

      if (x !== null) {
        const data = x as ConfService.ConfIdRow;
        setState(p => ({ ...p, data }));
        // Populate state with question data
        // setState(p => ({ ...p, questions: data.questions || [] }));
      }
    })
  }, [state.confid, state.updater]);

  if (store.auth.isNotLoggedIn) {
    store.auth.login();
    return (
      <div className={classes.pagebody}>
        <h3>Authorizing...</h3>
      </div>
    );
  }
  
  const onEdit = (conf:string | null) => {
    setState(p=>({...p, confid: conf, updater: p.updater+1 }));
  }

  const onIdDel = async (conf:string) => {
    if(!conf) throw new Error('no conf id');

    var r = window.confirm("Are you sure you want to delete?");
    if(!r) return;

    await ConfService.idDel(conf, store.getRID()!)
    setState(p=>({...p, confid: null, updater: p.updater+1 }));
  }
  
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
              {state.confid!==null && state.data && store.getRID() && 
                <>
                  <ConfMakerForm user={store.getRID()!} data={state.data} confid={state.confid} onSubmit={handleSubmit} onClose={()=>onEdit(null)} updater={state.updater}/>
                </>
              }
              {state.confid===null && store.getRID() && <ConfMakerList user={store.getRID()!} onEdit={onEdit} onIdDel={onIdDel} updater={state.updater} /> }
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
