import React from 'react';
// import Index from './components/home/home';
import AppBar from './components/AppBar';
import AppRouter from './components/Router';
// import { withRouter } from 'react-router';
import { observer } from 'mobx-react-lite';
import AuthWrapper from './components/aws/AuthWrapper';
import WorkerUpdate from './components/WorkerUpdate';
import Loading from './components/Loading';
import * as TimeSerive from './services/TimeService';

interface Props {
  store: import('./models/AppModel').Type,
  history: any
}
export default observer( function App(props:Props) {
  (window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; // mui
  const store = props.store;
  const history = props.history;

  if(localStorage.getItem('signup') && store.auth.isNotLoggedIn) {
    localStorage.removeItem('signup');
    store.auth.login();
  }
  // Feature: force quickmatch flow
  else if (store.isQuickmatch()) {
    console.log('isQuickmatch');
    if (store.auth.isNotLoggedIn) {
      localStorage.setItem('quickmatch', 'y');
      store.auth.doGuestLogin();
      return <Loading />;
    }
    if (store.auth.isAuthenticated()) {
      localStorage.setItem('quickmatch', 'y');
      store.router.push('/quickmatch');
    }
    // cant do this as it would cause quickmatch to bug
    // else if(s.auth.isAuthenticated()) s.router.push('/quickmatch');
  } else if (localStorage.getItem('quickmatch')) {
    if (store.auth.isAuthenticated()) {
      // localStorage.removeItem('quickmatch');
      store.router.push('/quickmatch');
    }
  } else if(TimeSerive.isDuringDebate()) {
    // Feature: faster flow
    if (store.auth.isNotLoggedIn) {
      localStorage.setItem('quickmatch', 'y');
      store.auth.doGuestLogin();
      return <Loading />;
    }
    if (localStorage.getItem('quickmatch') && store.auth.isAuthenticated() && store.isGuest()) {
      // localStorage.setItem('quickmatch', 'y');
      store.router.push('/quickmatch');
    }
  }
  return (
    <WorkerUpdate store={store}>
      <AuthWrapper store={store} login={store.auth.doLogin} />
      <AppBar store={store} />
      <AppRouter history={history} store={store} />
    </WorkerUpdate>
  );
});
