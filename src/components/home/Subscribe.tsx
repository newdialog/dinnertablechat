import React, { useState, createRef, useMemo } from 'react';

import { Typography, TextField, Button } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Reveal from 'react-reveal/Reveal';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles((theme: any) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  },
  centered: {
    paddingTop: '2%',
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingBottom: '8%',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '1000px',
    minWidth: '300px'
  },
  textField: {
    // width: '90%',
  }
}));

interface Props {
  offHome?: boolean;
}

function validEmail(email: string) {
  if (!email) return false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function ButtonAppBar(props: Props) {
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState({
    subscribe: 'form',
    submitting: false
  });
  const [istate, setIstate] = useState('');

  const onSubmit = useMemo(() => async (e) => {
    e.preventDefault();
    gtag('event', 'subscribe_action', {
      event_category: 'splash',
      non_interaction: false
    });
  
    const email = istate;
    console.log('email ' + email);
    if (!validEmail(email)) {
      console.log('!validEmail');
      setState({ ...state, subscribe: 'Please enter a valid email first' });
      return;
    }
    let subscribe = 'form';
    setState({ ...state, submitting: true });
    fetch('https://subscribe.api.dinnertable.chat/', {
      method: 'post',
      body: JSON.stringify({ email }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      }
    })
      .then((res: any) => {
        subscribe = res && res.status && res.status < 299 ? 'success' : res.err;
        setState({ ...state, subscribe });
      })
      .catch((err: any) => {
        subscribe = err;
        setState({ ...state, subscribe });
      });
  }, [state, istate]);

  const renderForm = (classes: any, t: any) => {
    return (
      <div className={classes.centered}>
        <br />
        <form
          onSubmit={onSubmit}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <Typography
            gutterBottom
            align="center"
            color="secondary"
            variant={!props.offHome ? 'h4' : 'h4'}
            style={{
              color: '#61618e',
              fontSize: !props.offHome ? '1.9em' : '1em'
            }}
          >
            {t('home-signup')}
          </Typography>
          <TextField
            value={istate}
            onChange={(event: any)=>setIstate(event.target.value)}
            type="email"
            label="Your email"
            fullWidth
            style={{ paddingTop: '2%', paddingBottom: '2%' }}
            disabled={state.submitting}
            // style={classes.textField}
            required
          />
          <p />
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={state.submitting}
          >
            Subscribe
          </Button>
          <br />
        </form>
      </div>
    );
  };

  const { subscribe } = state;
  if (subscribe === 'success') {
    window.gtag('event', 'subscribed', {
      event_category: 'splash',
      non_interaction: false
    });
    return (
      <div className={classes.centered}>
        <Typography gutterBottom align="center" color="primary" variant="h4">
          <Reveal effect="fadeIn" duration={1500}>
            Thanks for subscribing to DTC!
          </Reveal>
        </Typography>
      </div>
    );
  } else if (subscribe === 'error') {
    window.gtag('event', 'subscribe_error', {
      event_category: 'splash',
      non_interaction: false
    });
    return (
      <div className={classes.centered}>
        <Typography gutterBottom align="center" color="primary" variant="h4">
          <Reveal effect="fadeIn" duration={1500}>
            Hmm, something went wrong. {subscribe}
          </Reveal>
        </Typography>
        {renderForm(classes, t)}
      </div>
    );
  }
  return renderForm(classes, t);
}
