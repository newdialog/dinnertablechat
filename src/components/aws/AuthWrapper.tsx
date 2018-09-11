import React from 'react';

import * as Store from '../../models/AppModel';
import { observer } from 'mobx-react';
import * as AuthService from '../../services/AuthService';
import { withOAuth } from 'aws-amplify-react';

interface Props {
  store: Store.Type;
  login: boolean
}

let init = false;

interface State {
  init: boolean;
}

@observer
class Auth extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { init: false };
  }

  public render() {
    const props:any = this.props; // required for OAuthSignIn
    // const { init } = this.state;
    if (!init) {
      init = true;
      AuthService.auth(this.handleAuth.bind(this, props.store));
    }
    if(props.login) {
        props.OAuthSignIn()
    }

    return <React.Fragment>{props.children}</React.Fragment>;
  }

  private handleAuth(store: Store.Type, awsUser: AuthService.AwsAuth | null) {
    if(!awsUser) return;
    // console.log('handleAuth', awsUser)
    store.auth.authenticated(awsUser);
  }
}

export default withOAuth(Auth);
