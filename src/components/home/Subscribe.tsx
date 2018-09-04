import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import NProgress from 'nprogress';
// import { styleTextField } from '../components/SharedStyles';
// import withLayout from '../lib/withLayout';
// import { subscribeToNewsletter } from '../lib/api/public';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    centered: {
      paddingTop: '0',
      paddingLeft: '1em',
      paddingRight: '1em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    }
  })

class Subscribe extends React.Component<any,any> {
  public emailInput:any
  public onSubmit = async e => {
    e.preventDefault();
    const email = (this.emailInput && this.emailInput.value) || null;
    if (this.emailInput && !email) {
      return;
    }
    // NProgress.start();
    try {
      // await subscribeToNewsletter({ email });
      if (this.emailInput) {
        this.emailInput.value = '';
      }
      // NProgress.done();
      console.log('non-error response is received');
    } catch (err) {
      console.log(err); // eslint-disable-line
      // NProgress.done();
    }
  };
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.centered}>
        <br />
        <form onSubmit={this.onSubmit} style={{ marginLeft: 'auto', marginRight: 'auto', width:'100%', textAlign:'center' }}>
          <p>We will email you when a new tutorial is released:</p>
          <TextField
            inputRef={ (elm) => {
              this.emailInput = elm;
            }}
            type="email"
            label="Your email"
           //  style={styleTextField}
            required
          />
          <p />
          <Button variant="raised" color="primary" type="submit">
            Subscribe
          </Button>
        </form>
      </div>
    );
  }
}
export default (withStyles(styles)(Subscribe));
