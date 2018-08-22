import * as React from 'react';
import { Router, Route } from 'react-router-dom';
import Home from './home/home'

const DTCRouter = ( {history}:{history:any} ) => (
  <Router history={history}>
    <React.Fragment>
      <Route exact="true" path="/" component={Home} />
      <Route path="/signin" component={Home} />
      <Route path="/signout" component={Home} />
      
      <Route exact="true" path="dinnertablechat-homesite/" component={Home} />
      <Route path="dinnertablechat-homesite/signin" component={Home} />
      <Route path="dinnertablechat-homesite/signout" component={Home} />
    </React.Fragment>
  </Router>
);

export default DTCRouter