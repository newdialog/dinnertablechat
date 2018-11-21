import React from 'react';

import { Typography, TextField, Button } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Reveal from 'react-reveal/Reveal';
import HOC from '../HOC'

const styles = (theme: Theme) =>
  createStyles({
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
      minWidth: '300px',
    },
    textField: {
      // width: '90%', 
    }
  })

  // const subscribeState = {
  //   'form': {'label': ''}, 
  //   'success': {'label': 'Thanks!'}, 
  //   'error': {'label': 'Hmm, something went wrong. '}, 
  // }
  interface State {
    subscribe: string;
    submitting:boolean;
  }
  interface Props extends WithStyles<typeof styles> {
    t: any;
    offHome?: boolean
  }
class Subscribe extends React.Component<Props,State> {
  public state: State = {
    subscribe: 'form',
    submitting: false
  }

  public emailInput:any

  private validEmail(email: string) {
    if (!email) return false;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public onSubmit = async e => {
    e.preventDefault();
    gtag('event', 'subscribe_action', {
      'event_category': 'splash',
      'non_interaction': false
    });

    const email = (this.emailInput && this.emailInput.value) || null;
    if (!this.validEmail(email)) {
      this.setState({subscribe: 'Please enter a valid email first'})
      return
    }
    let subscribe = 'form'
    this.setState({submitting:true})
    fetch('https://subscribe.api.dinnertable.chat/', {
      method: 'post',
      body : JSON.stringify({ email }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
         'X-Content-Type-Options': 'nosniff'
      }
    })
    .then((res: any) => {
      subscribe = (res && res.status && res.status < 299) ? 'success' : res.err
      this.setState({subscribe})
    }) 
    .catch((err: any) => {
      subscribe = err
      this.setState({subscribe})
    });
  };
  private renderForm(classes:any, t:any) {
    return (
      <div className={classes.centered}>
        <br />
        <form onSubmit={this.onSubmit} style={{ marginLeft: 'auto', marginRight: 'auto', width:'100%', textAlign:'center' }}>
          <Typography gutterBottom align="center" color="primary" variant={!this.props.offHome ? 'h4' : 'h4'}  style={{color:'#61618e', fontSize: !this.props.offHome?'1.9em':'1em'}}>
          {t('home-signup')}
          </Typography>
          <TextField
            inputRef={ (elm) => this.emailInput = elm }
            type="email"
            label="Your email"
            fullWidth
            style={{paddingTop:'2%', paddingBottom:'2%'}}
            disabled={this.state.submitting}
            // style={classes.textField}
            required
          />
          <p />
          <Button variant="contained" color="primary" type="submit" disabled={this.state.submitting}>
            Subscribe
          </Button>
          <br/>
        </form>
      </div>
    );
  }
  public render() {
    const { classes, t } = this.props;
    const { subscribe } = this.state;
    if (subscribe === 'success') {
      window.gtag('event', 'subscribed', {
        'event_category': 'splash',
        'non_interaction': false
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
        'event_category': 'splash',
        'non_interaction': false
      });
      return (
        <div className={classes.centered}>
          <Typography gutterBottom align="center" color="primary" variant="h4">
            <Reveal effect="fadeIn" duration={1500}>
              Hmm, something went wrong. {subscribe}
            </Reveal>
          </Typography>
          { this.renderForm(classes, t) }
        </div>
      );
    }
    return this.renderForm(classes, t)
  }
}
export default HOC(Subscribe, styles);
