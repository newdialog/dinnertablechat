import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './services/i18n';
import './index.css';

import App from './App';
import { Provider } from 'mobx-react';
import * as AppModel from './models/AppModel';

import { connectReduxDevtools } from 'mst-middlewares';
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';

// Setup History
const routerModel = RouterModel.create({ location: null });
const history = syncHistoryWithStore(createBrowserHistory(), routerModel);

// Configure MST Store
const fetcher = url => window.fetch(url).then(response => response.json());
const store = AppModel.create(routerModel, fetcher);

if(!store.isLive()) connectReduxDevtools(require('remotedev'), store);

ReactDOM.render(
  <I18nextProvider i18n={i18n} initialLanguage="en">
    <Provider store={store}>
      <App history={history} />
    </Provider>
  </I18nextProvider>,
  document.getElementById('root') as HTMLElement
);