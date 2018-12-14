import React from 'react';

import * as Store from '../../models/AppModel';
import { observer } from 'mobx-react';
import * as AuthService from '../../services/AuthService';
import HOC from '../HOC';
import { inject } from 'mobx-react';
import { Typography } from '@material-ui/core';

interface Props {
  store: Store.Type;
  login: boolean;
}

interface State {
  init: boolean;
}

//
class AuthSignin extends React.Component<Props, any> {
    refresh = false;
  constructor(props: Props) {
    super(props);
  }

  public componentWillMount() {
    const props: any = this.props;
  }

  public componentDidMount() {
    
  }

  public render() {
    const {store} = this.props;
    if(!this.refresh && store.auth.isAuthenticated()) {
        window.gtag('event', 'logged_in', {
            event_category: 'auth'
          });

        if(store.isStandalone()) store.router.push('/play');
        else store.router.push('/tutorial');
        this.refresh = true;
    }

    return <React.Fragment><br/><br/><br/><Typography variant="h3" align="center" style={{color:'#555555'}}>Signing in...</Typography>
      </React.Fragment>;
  }
}

export default inject('store')(observer(AuthSignin));
// withOAuth
