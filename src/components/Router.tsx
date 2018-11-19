// @ts-ignore
import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import * as AppModel from '../models/AppModel';
import {observer, inject} from 'mobx-react';

const AsyncHome = lazy(() => import('./home/home'));
const AsyncPlay = lazy(() => import('./menus/MenuHome'));
const AsyncPrivacy = lazy(() => import('./privacy/Privacy'));
const AsyncMediaKit = lazy(() => import('./mediakit/MediaKit'));
const AsyncDebate = lazy(() => import('./debate/DebateRouter'));
const AsyncTester = lazy(() => import('./debate/DebateTester'));
const DebateHistory = lazy(() => import('./menus/DebateHistory'));
const DebateFeedback = lazy(() => import('./debate/DebateFeedback'));

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
  <Router history={history}>
    <Suspense fallback={loader()}>
      <Switch>
        <Route exact={true} path="/" component={AsyncHome} />
        <Route exact={true} path="/callback" component={AsyncHome} />
        <Route exact={true} path="/feedback" component={DebateFeedback} />
        <Route exact={true} path="/history" component={DebateHistory} />

        <Route path="/press" component={AsyncMediaKit} />
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
    </Suspense>
  </Router>
);

const authenticated = (store:AppModel.Type, Component:React.LazyExoticComponent<any>) => {
  console.log('store.auth.loggedIn', store.auth.loggedIn);
  if(store.auth.loggedIn) return <Component/>;
  return <div>Loading...</div>;
}

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
export default inject('store')(observer(DTCRouter));
