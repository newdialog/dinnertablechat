// @ts-ignore
import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './home/home';

import DebateHistory from './menus/DebateHistory';
import DebateFeedback from './debate/DebateFeedback'; // TODO: remove this and wire it up in DebateRouter
import * as AppModel from '../models/AppModel';
// import MenuHome from './menus/MenuHome'
// import RTCHome from './debate/DebateScene'
// import LoadingMatch from './debate/DebateTester'
// import DebateRouter from './debate/DebateRouter'
// import Privacy from './privacy/Privacy';
import Loadable from 'react-loadable';
const AsyncPlay = Loadable({
  loader: () => import('./menus/MenuHome'),
  loading: Loading,
  delay: 200
});
const AsyncPrivacy = Loadable({
  loader: () => import('./privacy/Privacy'),
  loading: Loading,
  delay: 200
});
const AsyncDebate = Loadable({
  loader: () => import('./debate/DebateRouter'),
  loading: Loading,
  delay: 200
});
const AsyncTester = Loadable({
  loader: () => import('./debate/DebateTester'),
  loading: Loading,
  delay: 200
});
/*
const AsyncPlay = lazy(() => import('./menus/MenuHome'));
const AsyncPrivacy:any = lazy(() => import('./privacy/Privacy'));
const AsyncDebate = lazy(() => import('./debate/DebateRouter'));
const AsyncDisplay = lazy(() => import('./debate/DebateTester'));
*/
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

const DTCRouter = ({
  history,
  store
}: {
  history: any;
  store: AppModel.Type;
}) => (
  <Suspense fallback={loader()}>
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/callback" component={Home} />
        <Route exact={true} path="/feedback" component={DebateFeedback} />
        <Route exact={true} path="/history" component={DebateHistory} />

        <Route path="/privacy" component={AsyncPrivacy} />
        <Route path="/play" component={AsyncPlay} />
        <Route path="/match" component={AsyncDebate} />

        {store.isLive() === false && (
          <Route exact={true} path="/test2" component={AsyncTester} />
        )}
        {store.isLive() === false && (
          <Route
            exact={true}
            path="/test"
            render={() => <AsyncPlay isTest={true} />}
          />
        )}

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
