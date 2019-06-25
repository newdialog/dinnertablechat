// @ts-ignore
import { observer } from 'mobx-react-lite';
import React, { lazy } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import * as AppModel from '../models/AppModel';
import AsyncPitch from './saas/pitch/SPitch';

// import SMenuHome from './saas/menus/SMenuHome';
const SMenuHome = lazy(() => import('./saas/menus/SMenuHome'));

const SClosedDialog = lazy(() => import('./saas/menus/SClosedDialog'));
const AsyncHome = lazy(() => import('./home/home'));
const AsyncPlay = lazy(() => import('./menus/MenuHome'));
const AsyncPrivacy = lazy(() => import('./pages/Privacy'));
const AsyncEducation = lazy(() => import('./pages/EducationHome'));
const AsyncMediaKit = lazy(() => import('./pages/MediaKit'));
const AsyncDebate = lazy(() => import('./debate/DebateRouter'));
const AsyncTester = lazy(() => import('./debate/DebateTester'));
const UserHome = lazy(() => import('./menus/dash/UserHome'));
const DebateFeedback = lazy(() => import('./debate/DebateFeedback'));
const GettingStarted = lazy(() => import('./menus/GettingStarted'));
const AuthSignin = lazy(() => import('./aws/AuthSignin'));

const Saas = lazy(() => import('./saas/menus/SRouter'));
  // lazy(() => import('./saas/pitch/SPitch'));

// https://news.ycombinator.com/item?id=19449279
// const scrollToTop = () => document.getElementById('root').scrollIntoView();

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
}) => {
  const live = store.isLive;
  return (
    <Router history={history}>
      <Switch>
        <Redirect from="/education" to="/campus" />
        <Redirect from="/signout" to="/" />
        <Route
          exact
          path="/saas"
          render={props => (
            <Redirect to={`/r`} />
          )}
        />
        <Route exact path="/" component={AsyncHome} />
        <Route exact path="/about" component={AsyncHome} />
        <Route path="/callback" component={AuthSignin} />
        <Route path="/CALLBACK" component={AuthSignin} /> { /* do not redirect */ }
        <Route exact path="/signin" component={AuthSignin} />
        <Route exact path="/feedback" component={DebateFeedback} />
        <Route exact path="/tutorial" component={GettingStarted} />
        <Route exact path="/press" component={AsyncMediaKit} />
        <Route exact path="/privacy" component={AsyncPrivacy} />
        <Route exact path="/campus" component={AsyncEducation} />
        <Route exact path="/home" component={UserHome} />
        <Route exact path="/quickmatch" component={AsyncPlay} />
        <Route exact path="/match" component={AsyncDebate} />
        <Route exact path="/hosting" component={AsyncPitch} />
        
        <Route exact path="/r/:id" render={props => (
            <SMenuHome id={props.match.params.id} />
          )} />
        <Route exact path="/r" render={props => (
            <SMenuHome id={''} />
        )} />
        {!live && (
          <Route exact path="/saasend" component={SClosedDialog} />
        )}
        {!live && <Route exact path="/saasmatch" component={Saas} />}
        {!live && <Route exact path="/test2" component={AsyncTester} />}
        {!live && (
          <Route
            exact={true}
            path="/test"
            render={() => {
              localStorage.setItem('test', 'y');
              return <AsyncPlay />;
            }}
          />
        )}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
};

/*
const authenticated = (
  store: AppModel.Type,
  Component: React.LazyExoticComponent<any>
) => {
  const isAuth = store.auth.isAuthenticated();
  // console.log('store.auth.loggedIn', isAuth);
  if (isAuth) return <Component />;
  return <div>Loading...</div>;
};
*/

/* function Loading(props: any) {
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
*/

/*
<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default observer(DTCRouter);

/*
<Route
        exact={true}
        path="/signout"
        render={() => {
          // PATCH, redirects not working
          store.router.push('/');
          return null;
        }}
      />
*/
