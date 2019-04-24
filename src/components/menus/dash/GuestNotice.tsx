import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../../models/AppModel';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    maxWidth: '600px',
    margin: '30px auto 0 auto',
    flexDirection: 'row',
    padding: '1em',
    borderRadius: '2vh',
    backgroundColor: theme.palette.primary.light,
    boxShadow:
      '0px 1px 3px 0px rgba(0,0,0,0.28), 0px 1px 1px 0px rgba(0,0,0,0.2), 0px 2px 1px -1px rgba(0,0,0,0.2)'
  },
  name: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '2.5em'
  },
  nameSubstat: {
    color: '#ffffff'
  }
}));

interface Props {
  store: AppModel.Type;
}

export default function Tooltip(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();

  const signOutGuest = (e: any) => {
    e.preventDefault();
    window.gtag('event', 'guest_signup_click', {
      event_category: 'splash'
    });
    store.auth.guestSignup();
    // store.auth.login();
    return true;
  };

  if (!store.isGuest()) return null;
  return (
    <div className={classes.headerContainer}>
      <>
        <Button
          style={{
            marginTop: '1vh',
            marginLeft: '12px',
            float: 'right',
            color: 'white' // hack TODO look at theme
          }}
          onClick={signOutGuest}
          variant="contained"
          color="secondary"
          size="large"
        >
          Signup now
        </Button>
        <Typography
          variant="h1"
          align="left"
          color="textPrimary"
          className={classes.name}
          gutterBottom
          style={{ fontSize: '1.25em' }}
        >
          <Info style={{ margin: '0px 3px -6px 0px' }} /> Temporary guest
          account
        </Typography>
        <Typography
          variant="body2"
          align="left"
          color="textPrimary"
          gutterBottom
          className={classes.nameSubstat}
          style={{ fontWeight: 'normal', fontSize: '1em' }}
        >
          Guests can join others in matchmaking but will <b> not gain</b>{' '}
          xp/levels or any of the member perks. Registered users also have
          priority in matchmaking. Please signup to start building your
          character!
        </Typography>
      </>
    </div>
  );
}
