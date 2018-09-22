import * as React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './home/home'
import MenuHome from './menus/MenuHome'
// import RTCHome from './debate/DebateScene'
// import LoadingMatch from './debate/DebateTester'
import DebateRouter from './debate/DebateRouter'

const DTCRouter = ( {history}:{history:any} ) => (
  <Router history={history}>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route exact={true} path="/callback" component={Home} />

      <Route path="/play" component={MenuHome}/>
      <Route path="/match" component={DebateRouter}/>

      <Redirect from="/signin" to="/"/>
      <Redirect from="/signout" to="/"/>
    </Switch>
  </Router>
);
/*
<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default DTCRouter