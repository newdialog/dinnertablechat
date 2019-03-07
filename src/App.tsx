import React from 'react';
// import Index from './components/home/home';
import AppBar from './components/AppBar';
import AppRouter from './components/Router';
// import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react';
import AuthWrapper from './components/aws/AuthWrapper';
import WorkerUpdate from './components/WorkerUpdate';
import Loading from './components/Loading';

const App = observer(({ store, history }) => {
  (window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; // mui
  const s = store as import('./models/AppModel').Type;

  // let showLoading = false;
  if (s.isQuickmatch()) {
    console.log('isQuickmatch');
    if (s.auth.isNotLoggedIn) {
      localStorage.setItem('quickmatch', 'y');
      s.auth.doGuestLogin();
      return <Loading />;
    }
    if (s.auth.isAuthenticated()) {
      localStorage.setItem('quickmatch', 'y');
      s.router.push('/quickmatch');
    }
    // cant do this as it would cause quickmatch to bug
    // else if(s.auth.isAuthenticated()) s.router.push('/quickmatch');
  } else if (localStorage.getItem('quickmatch')) {
    if (s.auth.isAuthenticated()) {
      // localStorage.removeItem('quickmatch');
      s.router.push('/quickmatch');
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

export default App;
