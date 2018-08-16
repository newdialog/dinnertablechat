import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import NProgress from 'nprogress';
// import { styleTextField } from '../components/SharedStyles';
// import withLayout from '../lib/withLayout';
// import { subscribeToNewsletter } from '../lib/api/public';

class Subscribe extends React.Component {
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
    return (
      <div style={{ padding: '10px 45px' }}>
        <br />
        <form onSubmit={this.onSubmit}>
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
export default Subscribe;
