import { observer } from 'mobx-react-lite';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../models/AppModel';
import * as Times from '../services/TimeService';
import { Auther } from '../components/Auther';
import Footer from '../components/home/Footer';
import AppFloatMenu from '../components/menus/dash/AppFloatMenu';
import DailyTimer from '../components/menus/dash/DailyTimer';
import DebateHistory from '../components/menus/dash/DebateHistory';
import GuestNotice from '../components/menus/dash/GuestNotice';
import Tooltip from '../components/menus/dash/Tooltip';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: '40px',
    background: '#ddd1bb'
  },
  backgroundImg: {
    display: 'block',
    margin: '0.5em auto 0em',
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '35vh',
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      maxHeight: '50vh',
      maxWidth: '1000px'
    }
  },
  divider: {
    margin: `${theme.spacing(4)}px 0`
  },
  startLabel: {
    fontSize: '1.7em',
    fontWeight: 'normal',
    color: '#fff',
    lineHeight: '1.17',
    letterSpacing: '-0.02em'
  }
}));

interface Props {}
export default observer((props: Props) => {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const debateOpen = Times.isDuringDebate(store.isLive);

  // Auth guard
  if (store.auth.isNotLoggedIn || !store.auth.user) {
    store.router.push('/');
    return null;
  }

  // <UserStats store={store} />
  return (
    <Auther>
      <Helmet title="DTC User Dashboard">
        <meta name="og:url" content="https://dinnertable.chat/home" />
        <meta name="og:title" content="DTC User Dashboard" />
      </Helmet>
      <div className={classes.container}>
        <img src="imgs/press/01-scene1.png" className={classes.backgroundImg} alt="scene" />
        <div className={classes.divider} />

        <div style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}>
          <Grid
            container
            spacing={0}
            justify="space-around"
            alignItems="center"
          >
            {(debateOpen) && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ padding: '1em' }}
                  onClick={() => store.router.push('/quickmatch')}
                >
                  <span className={classes.startLabel}>Begin QuickMatch</span>
                </Button>
              </Grid>
            )}

            {!debateOpen && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => store.router.push('/')}
                >
                  Dinner is finished.
                  <br /> come back next time!
                </Button>
              </Grid>
            )}
          </Grid>
          <div className={classes.divider} />
          <DailyTimer store={store} />
          <GuestNotice store={store} />
          <Tooltip />
        </div>
        <div className={classes.divider} />
        <DebateHistory store={store} />
      </div>
      <AppFloatMenu />
      <Footer />
    </Auther>
  );
});
