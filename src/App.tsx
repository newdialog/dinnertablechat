import React, { useEffect } from 'react';
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
  store: import('./models/AppModel').Type;
  history: any;
}
export default observer(function App(props: Props) {
  (window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; // mui
  const store = props.store;
  const history = props.history;

  useEffect(() => {
    const path = (store.router.location as any).pathname;
    // console.log('path', path);

    const isTest = path === '/test' || path === '/test2';
    if(isTest) return;

    const isHome = path === '/' || path === '';
    const isDebateTime = TimeSerive.isDuringDebate(store.isLive);
    // console.log('isHomeisHome', isHome, TimeSerive.isDuringDebate(store.isLive))
    if(!isHome) return; // j1, not sure if this fixes anything
    // console.log('--')
    // App flow
    if (
      store.isStandalone() &&
      store.auth.isNotLoggedIn &&
      !localStorage.getItem('quickmatch')
    ) {
      store.router.push('/tutorial');
    }
    // Auth guest to signup
    else if (localStorage.getItem('signup')) {
     if(store.auth.isNotLoggedIn) {
      console.log('Auth guest to signup');
      store.auth.login();
     } else if(!store.isGuest() && !store.auth.isNotLoggedIn) {
      // console.log('finished Auth guest to signup');
      // localStorage.removeItem('signup');
     }
      // return <Loading />;
    }
    // Feature: force quickmatch flow
    else if (store.isQuickmatch() && store.auth.isNotLoggedIn) {
      console.log('isQuickmatch');
      localStorage.setItem('quickmatch', 'y');
      store.auth.doGuestLogin();
      // return <Loading />;
      // cant do this as it would cause quickmatch to bug
      // else if(s.auth.isAuthenticated()) s.router.push('/quickmatch');
    }
    // Feature: faster flow
    else if (store.auth.isNotLoggedIn && isDebateTime) {
      console.log('setting quickmatch');
      // localStorage.setItem('quickmatch', 'y');
      store.auth.doGuestLogin();
      //  return <Loading />;
    } else if(isHome && isDebateTime && store.auth.isAuthenticated()) {
      store.router.push('/quickmatch'); // /home
    }
  }, [store.auth.isNotLoggedIn, store.auth.user]);

  return (
    <WorkerUpdate store={store}>
      <AuthWrapper store={store} login={store.auth.doLogin} />
      <AppBar store={store} />
      <AppRouter history={history} store={store} />
    </WorkerUpdate>
  );
});
