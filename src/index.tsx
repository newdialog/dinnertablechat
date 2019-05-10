import './index.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { createBrowserHistory } from 'history';
import { connectReduxDevtools } from 'mst-middlewares';
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';
import React, { Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import App from './App';
import LoadingMsg from './components/Loading';
import * as AppModel from './models/AppModel';
import i18n from './services/i18n';
import { theme } from './withRoot';

// Setup History
const routerModel = (RouterModel as any).create(); // TS Hack
const history = syncHistoryWithStore(createBrowserHistory(), routerModel);

// Configure MST Store
const fetcher = url => window.fetch(url).then(response => response.json());
const store = AppModel.create(routerModel, fetcher);

// if(!store.isLive)
connectReduxDevtools(require('remotedev'), store); // enable to troubleshooting, prob bundled anyway

console.log('v1.2.851');

ReactDOM.render(
  <Suspense fallback={LoadingMsg()}>
    <I18nextProvider i18n={i18n}>
        <AppModel.Context.Provider value={store}>
          <MuiThemeProvider theme={theme}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App history={history} store={store} />
            </ThemeProvider>
          </MuiThemeProvider>
        </AppModel.Context.Provider>
    </I18nextProvider>
  </Suspense>,
  document.getElementById('root') as HTMLElement
);
