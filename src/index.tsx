import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

// import Index from './pages/index';
// import AWSApp from './aws/AWSApp';
import App from './App'
// import { Provider } from 'react-redux'
// import { Provider } from 'mobx-react'
// import { observable, reaction } from 'mobx'
import AppModel from './models/AppModel'

// import makeInspectable from 'mobx-devtools-mst';
import { connectReduxDevtools } from 'mst-middlewares'

const fetcher = url => window.fetch(url).then(response => response.json())
const store = AppModel.create(
  {},
  {
      fetch: fetcher,
      alert: m => console.log(m) // Noop for demo: window.alert(m)
  }
)
// makeInspectable(store);
connectReduxDevtools(require('remotedev'), store)

// import App from './App';
ReactDOM.render(
  (
    <App store={store} />
  ),
  document.getElementById('root') as HTMLElement
);


registerServiceWorker();
