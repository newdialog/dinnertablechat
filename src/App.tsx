import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from'@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import { connectReduxDevtools } from 'mst-middlewares';
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';
import React, { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import LoadingMsg from './components/Loading';
import AppRouter from './components/Router';
import WorkerUpdate from './components/WorkerUpdate';
import * as AppModel from './models/AppModel';
import i18n from './services/i18n';
import * as TimeSerive from './services/TimeService';
import { theme } from './withRoot';

const CookieCheck = React.lazy(() => import('./components/CookieCheck'));
const AppBar = React.lazy(() => import('./components/AppBar'));
const AuthWrapper = React.lazy(() => import('./components/aws/AuthWrapper'));

let _cache: any = null;
function init() {
  if (_cache) return _cache;
  const routerModel = RouterModel.create(); // TS Hack
  const history = syncHistoryWithStore(createBrowserHistory(), routerModel);

  // Configure MST Store
  const fetcher = url => window.fetch(url).then(response => response.json());
  const store = AppModel.create(routerModel, fetcher);

  if(!store.isLive) {
    connectReduxDevtools(require('remotedev'), store); // enable to troubleshooting, prob bundled anyway
    console.log('dev mode');
  }

  return (_cache = { history, store });
}

export const App = () => {
  let initO: any = null;
  try {
    // test for compatibility
    initO = init();
  }
  catch(e) {
    console.log('possible browser compatibility issue');
    console.error(e);
    throw new Error(e);
  }
  const { history, store } = initO;

  console.log('v1.3.11');

  const AppBase = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={LoadingMsg()}>
        <I18nextProvider i18n={i18n}>
          <AppModel.Context.Provider value={store}>
            <Base history={history} store={store} />
          </AppModel.Context.Provider>
        </I18nextProvider>
      </Suspense>
    </ThemeProvider>
  );

  return AppBase;
};

interface Props {
  store: import('./models/AppModel').Type;
  history: any;
}
export const Base = observer(function _Base(props: Props) {
  (window as any).__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; // mui
  const store = props.store;
  const history = props.history;

  const path = (store.router.location as any).pathname;
  const isTest = path === '/test' || path === '/test2';
  const isSaasDomain = window.location.hostname.match('debateplatform');
  const isMixer = store.isMixer();

  useEffect(() => {
    if (isTest) return;

    const isHome = path === '/' || path === '';
    const isDebateTime = TimeSerive.isDuringDebate(store.isLive);
    // console.log('isHomeisHome', isHome, TimeSerive.isDuringDebate(store.isLive))
    if (!isHome) return; // j1, not sure if this fixes anything

    // App flow
    if (isMixer) {
      // ignore other root rules
    } else if (isSaasDomain) {
      store.router.push('/r');
    } else if (
      store.isStandalone() &&
      store.auth.isNotLoggedIn &&
      !localStorage.getItem('quickmatch')
    ) {
      store.router.push('/tutorial');
    } else if (localStorage.getItem('signup')) {
      // Auth guest to signup
      if (store.auth.isNotLoggedIn) {
        console.log('Auth guest to signup');
        store.auth.login();
      } else if (!store.isGuest() && !store.auth.isNotLoggedIn) {
        // localStorage.removeItem('signup');
      }
    } else if (store.isQuickmatch()) {
      // Feature: force quickmatch flow
      console.log('isQuickmatch');
      localStorage.setItem('quickmatch', 'y');
      store.router.push('/quickmatch');
      // cant do this as it would cause quickmatch to bug
      // else if(s.auth.isAuthenticated()) s.router.push('/quickmatch');
    } else if (isHome && isDebateTime && store.auth.isAuthenticated()) {
      // Move both guest and auth user here
      store.router.push('/quickmatch'); // /home
    }
  }, [store, store.auth, store.auth.user]);

  // disable worker prompt
  useEffect(() => {
    if (!isMixer) return;
    require('./serviceWorker').unregister();
    window.addEventListener('beforeinstallprompt', function(e:any) {
      e.preventDefault();
      return false;
    });
  }, []);

  const root = (
    <>
      <Suspense fallback={null}>
        <AppBar store={store} />
        <AuthWrapper store={store} login={store.auth.doLogin} />
      </Suspense>
      <Suspense fallback={LoadingMsg()}>
        <AppRouter history={history} store={store} />
      </Suspense>
      <Suspense fallback={null}>
        { store.isGuest() && <CookieCheck /> }
      </Suspense>
    </>
  );

  // dont even install a worker
  if (isMixer) return root;

  return <WorkerUpdate store={store}>{root}</WorkerUpdate>;
});
