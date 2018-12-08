import React from 'react';
// import Index from './components/home/home';
import AppBar from './components/AppBar';
import AppRouter from './components/Router'
// import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react'
import AuthWrapper from './components/aws/AuthWrapper'
import WorkerUpdate from './components/WorkerUpdate';

const App = inject('store')(
  observer(({ store, history }) => {
    (window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; // mui
    // console.log('page', store.router.location);
    return (
        <WorkerUpdate store={store}>
          <AuthWrapper store={store} login={store.auth.doLogin} />
          <AppBar store={store} />
          <AppRouter history={history} store={store}></AppRouter>
        </WorkerUpdate>
    )
  })
)

export default App;