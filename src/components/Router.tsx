// @ts-ignore
import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import * as AppModel from '../models/AppModel';
import {observer} from 'mobx-react-lite';
import LoadingMsg from './Loading';

const AsyncHome = lazy(() => import('./home/home'));
const AsyncPlay = lazy(() => import('./menus/MenuHome'));
const AsyncPrivacy = lazy(() => import('./pages/Privacy'));
const AsyncEducation = lazy(() => import('./pages/EducationHome'));
const AsyncMediaKit = lazy(() => import('./mediakit/MediaKit'));
const AsyncDebate = lazy(() => import('./debate/DebateRouter'));
const AsyncTester = lazy(() => import('./debate/DebateTester'));
const UserHome = lazy(() => import('./menus/dash/UserHome'));
const DebateFeedback = lazy(() => import('./debate/DebateFeedback'));
const GettingStarted = lazy(() => import('./menus/GettingStarted'));
const AuthSignin = lazy(() => import('./aws/AuthSignin'));

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

// <Route component={NoMatch} />
const DTCRouter = ({
  history,
  store
}: {
  history: any;
  store: AppModel.Type;
}) => (
  <Router history={history}>
    <Suspense fallback={LoadingMsg()}>
      <Switch>
        <Route exact={true} path="/" component={AsyncHome} />
        <Route exact={true} path="/callback" component={AuthSignin} />
        <Route exact={true} path="/CALLBACK" component={AuthSignin} />
        <Route exact={true} path="/signin" component={AuthSignin} />
        <Route exact={true} path="/feedback" component={DebateFeedback} />
        <Route exact={true} path="/tutorial" component={GettingStarted} />

        <Route path="/press" component={AsyncMediaKit} />
        <Route path="/privacy" component={AsyncPrivacy} />

        <Route path="/campus" component={AsyncEducation} />

        <Route path="/home" component={UserHome} />
        <Route path="/quickmatch" component={AsyncPlay} />
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

        <Redirect from="/education" to="/campus" />
        <Redirect from="/signout" to="/" />
        <Redirect from="/play" to="/home" /> { /* legacy route */ }

        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Suspense>
  </Router>
);

const authenticated = (store:AppModel.Type, Component:React.LazyExoticComponent<any>) => {
  const isAuth = store.auth.isAuthenticated();
  // console.log('store.auth.loggedIn', isAuth);
  if(isAuth) return <Component/>;
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
export default observer(DTCRouter);
