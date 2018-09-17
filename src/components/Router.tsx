import * as React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Home from './home/home'
import DebateHome from './menus/MenuHome'
import RTCHome from './debate/DebateScene'
import LoadingMatch from './debate/DebateTester'

const DTCRouter = ( {history}:{history:any} ) => (
  <Router history={history}>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/callback" component={Home} />
      <Route path="/signin" component={Home} />
      <Route path="/signout" component={Home} />
      

      <Route path="/play" component={DebateHome}/>
      
      <Route path="/match" component={LoadingMatch}/>
    </Switch>
  </Router>
);
/*
<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default DTCRouter