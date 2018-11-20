import React from 'react';
// import Index from './components/home/home';
import AppBar from './components/AppBar';
import AppRouter from './components/Router'
// import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react'
import AuthWrapper from './components/aws/AuthWrapper'

const App = inject('store')(
  observer(({ store, history }) => {
    (window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; // mui
    // console.log('page', store.router.location);
    return (
        <React.Fragment>
          <AuthWrapper store={store} login={store.auth.doLogin} />
          <AppBar store={store} />
          <AppRouter history={history} store={store}></AppRouter>
        </React.Fragment>
    )
  })
)

export default App;
