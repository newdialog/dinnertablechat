import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './services/i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import { Provider } from 'mobx-react';
import * as AppModel from './models/AppModel';
import AuthModel from './models/AuthModel';

import { connectReduxDevtools } from 'mst-middlewares';
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';

// Setup History
const routerModel = RouterModel.create();
const history = syncHistoryWithStore(createBrowserHistory(), routerModel);

// Configure MST Store
const fetcher = url => window.fetch(url).then(response => response.json());
const store = AppModel.create(routerModel, history);

connectReduxDevtools(require('remotedev'), store);

ReactDOM.render(
  <I18nextProvider i18n={i18n} initialLanguage="en">
    <Provider store={store}>
      <App history={history} />
    </Provider>
  </I18nextProvider>,
  document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// const onSuccess = (registration: ServiceWorkerRegistration) => null;
// const onUpdate = (registration: ServiceWorkerRegistration) => null;
// serviceWorker.register({onSuccess, onUpdate});
serviceWorker.unregister();
