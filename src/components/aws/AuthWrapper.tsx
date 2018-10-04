import React from 'react';

import * as Store from '../../models/AppModel';
import { observer } from 'mobx-react';
import * as AuthService from '../../services/AuthService';
// import { withOAuth } from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';

interface Props {
  store: Store.Type;
  login: boolean
}

let init = false;

interface State {
  init: boolean;
}

@observer
class AuthComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { init: false };
  }

  // Auth/Provider/withOAuth.jsx
  public signIn() {
    if (!Auth || typeof Auth.configure !== 'function') {
        throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }

    const config = (Auth.configure(null) as any).oauth;
    console.log('withOAuth configuration', config);

    const { 
        domain,  
        redirectSignIn,
        redirectSignOut,
        responseType
    } = config;

    const options = config.options || {};
    const url = 'https://' + domain 
        + '/login?redirect_uri=' + redirectSignIn 
        + '&response_type=' + responseType 
        + '&client_id=' + ((Auth.configure(null) as any).userPoolWebClientId);
    window.location.assign(url);
}

  public render() {
    const props:any = this.props; // required for OAuthSignIn
    // const { init } = this.state;
    if (!init) {
      init = true;
      AuthService.auth(this.handleAuth.bind(this, props.store));
    }
    if(props.login) {
        // props.OAuthSignIn()
        this.signIn();
    }

    return <React.Fragment>{props.children}</React.Fragment>;
  }

  private handleAuth(store: Store.Type, awsUser: AuthService.AwsAuth | null) {
    if(!awsUser) return;
    // console.log('handleAuth', awsUser)
    store.auth.authenticated(awsUser);
  }
}

export default (AuthComp);
// withOAuth