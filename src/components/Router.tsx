import * as React from 'react';
import { Router, Route } from 'react-router-dom';
import Home from './home/home'

const DTCRouter = ( {history}:{history:any} ) => (
  <Router history={history}>
    <React.Fragment>
      <Route exact="true" path="/" component={Home} />
      <Route path="/signin" component={Home} />
      <Route path="/signout" component={Home} />
    </React.Fragment>
  </Router>
);

export default DTCRouter