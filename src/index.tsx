import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import App from './App'
import { Provider } from 'mobx-react'
import AppModel from './models/AppModel'

import { connectReduxDevtools } from 'mst-middlewares'
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterModel, syncHistoryWithStore } from 'mst-react-router';

// Setup History
const routerModel = RouterModel.create();
const history = syncHistoryWithStore(createBrowserHistory(), routerModel);

// Configure MST Store
const fetcher = url => window.fetch(url).then(response => response.json())
const store = AppModel.create(
  {
    text: 'DEFAULT VAL',
    router: routerModel
  },
  {
      fetch: fetcher,
      alert: m => console.log(m) // Noop for demo: window.alert(m)
  }
)
// makeInspectable(store);
connectReduxDevtools(require('remotedev'), store)

ReactDOM.render(
  (
    <Provider store={store}>
        <App history={history} />
    </Provider>
  ),
  document.getElementById('root') as HTMLElement
);


registerServiceWorker();
