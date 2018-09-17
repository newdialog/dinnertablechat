import * as React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Tester from './DebateTester'
import LoadingScene from './LoadingScene'


const DTCRouter = ( {history}:{history:any} ) => (
  <Router history={history}>
    <Switch>
      <Route exact={true} path="/" component={Tester} />
      <Route path="/loading" component={LoadingScene} />

    </Switch>
  </Router>
);
/*
<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default DTCRouter