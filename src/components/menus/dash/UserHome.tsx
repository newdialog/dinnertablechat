import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Helmet } from 'react-helmet';
import DailyTimer from './DailyTimer';
import * as Times from '../../../services/TimeService';
import * as AppModel from '../../../models/AppModel';
import Tooltip from './Tooltip';
import DebateHistory from './DebateHistory';
import Footer from '../../home/Footer';
import UserStats from './UserStats';
import GuestNotice from './GuestNotice';

import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
import AppFloatMenu from './AppFloatMenu';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop:'40px',
    background: '#ddd1bb'
  },
  backgroundImg: {
    display: 'block',
    margin: '0.5em auto 0em',
    width: 'auto',
    maxWidth: '1000px',
    maxHeight: '35vh',
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      maxHeight: '50vh',
    }
  },
  divider: {
    margin: `${theme.spacing.unit * 4}px 0`
  }
}));
const debateOpen = Times.isDuringDebate();
interface Props {}
interface State {}

export default function UserHome(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();

  // Auth guard
  if (store.auth.isNotLoggedIn) store.router.push('/');
  else if (!store.auth.user) return null;

  // <UserStats store={store} />
  return (
    <>
      <Helmet title="Dinnertable.chat Press">
        <meta name="og:url" content="https://dinnertable.chat/home" />
        <meta name="og:title" content="Dinnertable.chat Home" />
      </Helmet>
      <div className={classes.container}>
        <img src="imgs/press/01-scene1.png" className={classes.backgroundImg} />
        <div className={classes.divider} />

        <div style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}>
          <Grid
            container
            spacing={0}
            justify="space-around"
            alignItems="center"
          >
            {(debateOpen || !store.isLive()) && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ padding: '1em' }}
                  onClick={() => store.router.push('/quickmatch')}
                >
                  <Typography variant="h4" align="center" color="textSecondary">
                    QuickMatch
                  </Typography>
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
          <GuestNotice store={store}/>
          <Tooltip />
        </div>
        <div className={classes.divider} />
        <DebateHistory store={store}/>
      </div>
      <AppFloatMenu />
      <Footer />
    </>
  );
}
