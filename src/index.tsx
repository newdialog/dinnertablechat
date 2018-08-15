import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

// import Index from './pages/index';
// import AWSApp from './aws/AWSApp';
import App from './App'

// ReactDOM.render(<AWSApp />, document.querySelector('#root'));


// import App from './App';
ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);


registerServiceWorker();
