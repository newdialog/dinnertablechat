import * as React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Home from './home/home'
import DebateHome from './debate/DebateHome'
import RTCHome from './debate/RTC'
import LoadingMatch from './debate/LoadingMatch'

const DTCRouter = ( {history}:{history:any} ) => (
  <Router history={history}>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/callback" component={Home} />
      <Route path="/signin" component={Home} />
      <Route path="/signout" component={Home} />

      <Route path="/play" component={DebateHome}/>
      <Route path="/rtc" component={RTCHome}/>
      <Route path="/match" component={LoadingMatch}/>
    </Switch>
  </Router>
);

export default DTCRouter