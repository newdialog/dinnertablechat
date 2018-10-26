// @ts-ignore
import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './home/home';
import DebateFeedback from './debate/DebateFeedback'; // TODO: remove this and wire it up in DebateRouter
// import MenuHome from './menus/MenuHome'
// import RTCHome from './debate/DebateScene'
// import LoadingMatch from './debate/DebateTester'
// import DebateRouter from './debate/DebateRouter'
// import Privacy from './privacy/Privacy';

const asyncPlay = lazy(() => import('./menus/MenuHome'));
const asyncPrivacy = lazy(() => import('./privacy/Privacy'));
const asyncDebate = lazy(() => import('./debate/DebateRouter'));
const asyncDisplay = lazy(() => import('./debate/DebateTester'));

const NoMatch = ({ location }) => (
  <div>
    <h1>...</h1>
    <h3>
      No page match for <code>{location.pathname}</code>
    </h3>
    <p>
      <a href="/">Return home</a>
    </p>
  </div>
);

const loader = () => {
  return (
    <div>
      <br />
      <br />
      <br />
      <h1 style={{ textAlign: 'center' }}>Loading...</h1>
    </div>
  );
};
// <Route component={NoMatch} />

const DTCRouter = ({ history }: { history: any }) => (
  <Suspense fallback={loader()}>
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/callback" component={Home} />
        <Route exact={true} path="/feedback" component={DebateFeedback} />

        <Route path="/privacy" component={asyncPrivacy} />
        <Route path="/play" component={asyncPlay} />
        <Route path="/match" component={asyncDebate} />
        <Route path="/test" component={asyncDisplay} />

        <Redirect from="/signin" to="/" />
        <Redirect from="/signout" to="/" />

        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  </Suspense>
);

function Loading(props: any) {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
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
export default DTCRouter;
