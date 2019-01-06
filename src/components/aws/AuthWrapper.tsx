import React from 'react';

import * as Store from '../../models/AppModel';
import { observer } from 'mobx-react';
import * as AuthService from '../../services/AuthService';
// import { withOAuth } from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';
import MediaQuery from 'react-responsive';

interface Props {
  store: Store.Type;
  login: boolean;
}

let init = false;

interface State {
  init: boolean;
}

//
class AuthComp extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    // this.state = { init: false };
  }

  // Auth/Provider/withOAuth.jsx
  public signIn() {
    if (!Auth || typeof Auth.configure !== 'function') {
      throw new Error(
        'No Auth module found, please ensure @aws-amplify/auth is imported'
      );
    }

    const config = (Auth.configure(null) as any).oauth;
    console.log('withOAuth configuration', config);

    const { domain, redirectSignIn, redirectSignOut, responseType } = config;

    const options = config.options || {};
    const url =
      'https://' +
      domain +
      '/login?redirect_uri=' +
      redirectSignIn +
      '&response_type=' +
      responseType +
      '&client_id=' +
      (Auth.configure(null) as any).userPoolWebClientId;
    window.location.assign(url);
  }

  public componentWillMount() {
    const props: any = this.props; // required for OAuthSignIn
    // const { init } = this.state;
    if (!init) {
      init = true;
      AuthService.auth(this.handleAuth);
    }
  }

  public render() {
    /// console.time('AuthComp');
    const props: any = this.props;

    if (props.login) {
      // props.OAuthSignIn()
      this.signIn();
    }

    return <React.Fragment>{props.children}
        <MediaQuery query="(display-mode: standalone)">
        {(matches) => {
          if (matches && !this.props.store.isStandalone()) this.props.store.setStandalone();
          // if(matches) return <p>p1</p>
          // else return <p>w1</p>
          return null;
        }}
        </MediaQuery>
      </React.Fragment>;
  }

  private handleAuth = (awsUser: AuthService.AwsAuth | null) => {
    if (!awsUser)  {
      console.log('+not logged in');
      // if(this.props.store.isStandalone()) this.signIn(); // MOBILE
      
      this.props.store.auth.notLoggedIn();
      // AuthService.guestLogin();
      return;
    } 
    console.log('+logged in');
    // console.log('handleAuth', awsUser)
    this.props.store.auth.authenticated(awsUser);
    // if(awsUser.user.email==='guest@dinnertable.chat') 
    this.props.store.router.push('/home');
    

    /* if(awsUser.event !== AuthService.LOGIN_EVENT) {
      if(this.props.store.isStandalone()) this.props.store.router.push('/home');
    } */
    
  }
}

export default observer(AuthComp);
// withOAuth
