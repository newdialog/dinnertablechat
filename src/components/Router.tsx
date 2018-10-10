import * as React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './home/home'
// import MenuHome from './menus/MenuHome'
// import RTCHome from './debate/DebateScene'
// import LoadingMatch from './debate/DebateTester'
// import DebateRouter from './debate/DebateRouter'
// import Privacy from './privacy/Privacy';
import Loadable from 'react-loadable';

const asyncPlay = Loadable({
  loader: () => import('./menus/MenuHome'),
  loading: Loading,
  delay: 200,
});

const asyncPrivacy = Loadable({
  loader: () => import('./privacy/Privacy'),
  loading: Loading,
  delay: 200,
});

const asyncDebate = Loadable({
  loader: () => import('./debate/DebateRouter'),
  loading: Loading,
  delay: 200,
});

const asyncDisplay = Loadable({
  loader: () => import('./debate/DebateTester'),
  loading: Loading,
  delay: 200,
});


const NoMatch = ({ location }) => (
  <div>
    <h1>...</h1>
    <h3>No page match for <code>{location.pathname}</code></h3>
    <p><a href="/">Return home</a></p>
  </div>
)
// <Route component={NoMatch} />

const DTCRouter = ( {history}:{history:any} ) => (
  <Router history={history}>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route exact={true} path="/callback" component={Home} />

     <Route path="/privacy" component={asyncPrivacy}/>
      <Route path="/play" component={asyncPlay}/>
      <Route path="/match" component={asyncDebate}/>
      <Route path="/test" component={asyncDisplay}/>

      <Redirect from="/signin" to="/"/>
      <Redirect from="/signout" to="/"/>
      
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  </Router>
);

function Loading(props:any) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

/*
<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default DTCRouter