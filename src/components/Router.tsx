// @ts-ignore
import { observer } from 'mobx-react-lite';
import React, { lazy } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import * as AppModel from '../models/AppModel';

const Home = lazy(() => import('../pages/index'));
const Play = lazy(() => import('../pages/MenuHome'));
const Privacy = lazy(() => import('../pages/privacy'));
const Campus = lazy(() => import('../pages/campus'));
const Press = lazy(() => import('../pages/press'));
const Debate = lazy(() => import('../pages/DebateRouter'));
const Tester = lazy(() => import('./debate/DebateTester'));
const Dashboard = lazy(() => import('../pages/dashboard'));
const DebateFeedback = lazy(() => import('./debate/DebateFeedback'));
const Tutorial = lazy(() => import('../pages/tutorial'));
const AuthSignin = lazy(() => import('./aws/AuthSignin'));

const SRouter = lazy(() => import('../pages/saas/SRouter'));
const SPitch = lazy(() => import('../pages/saas/SPitch'));
const SClosed = lazy(() => import('../pages/saas/SClosed'));
const SHome = lazy(() => import('../pages/saas/sindex'));

const CHome = lazy(() => import('../pages/conf/cindex'));
const CAdmin = lazy(() => import('../pages/conf/cadmin'));
const CMaker = lazy(() => import('../pages/conf/cmaker'));

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
  const isMixer = window.location.hostname.match('mixer.');

  if (isMixer) {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" render={() => <p>No id provided</p>} />
          <Redirect from="/signout" to="/" />
          <Route path="/callback" component={AuthSignin} />
          <Route path="/CALLBACK" component={AuthSignin} />{' '}
          {/* do not redirect */}
          <Route exact path="/signin" component={AuthSignin} />
          <Route exact path="/privacy" component={Privacy} />
          {/* conference app */}
          <Route
            exact
            path="/admin"
            component={CMaker}
          />

          <Route
            exact
            path="/:id/edit"
            // component={CMaker}
            render={props => <CMaker id={props.match.params.id} />}
          />

          <Route
            exact
            path="/:id/admin"
            render={props => <CAdmin id={props.match.params.id} />}
          />
          <Route
            exact
            path="/:id"
            render={props => <CHome id={props.match.params.id} />}
          />
          <Route exact path="/" render={props => <CHome id={''} />} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    );
  }

  return (
    <Router history={history}>
      <Switch>
        <Redirect from="/signout" to="/" />
        <Route exact path="/saas" render={props => <Redirect to={`/r`} />} />
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={Home} />
        <Route path="/callback" component={AuthSignin} />
        <Route path="/CALLBACK" component={AuthSignin} />{' '}
        {/* do not redirect */}
        <Route exact path="/signin" component={AuthSignin} />
        <Route exact path="/feedback" component={DebateFeedback} />
        <Route exact path="/tutorial" component={Tutorial} />
        <Route exact path="/press" component={Press} />
        <Route exact path="/privacy" component={Privacy} />
        <Route exact path="/campus" component={Campus} />
        <Route exact path="/home" component={Dashboard} />
        <Route exact path="/quickmatch" component={Play} />
        <Route exact path="/match" component={Debate} />
        <Route exact path="/hosting" component={SPitch} />
        {/* saas */}
        <Route
          exact
          path="/r/:id"
          render={props => <SHome id={props.match.params.id} />}
        />
        <Route exact path="/r" render={props => <SHome id={''} />} />
        <Route exact path="/saasmatch" component={SRouter} />
        {/* conference app */}
        <Route
          exact
          path="/c/admin"
          component={CMaker}
        />

        <Route
            exact
            path="/c/:id/edit"
            // component={CMaker}
            render={props => <CMaker id={props.match.params.id} />}
          />

        <Route
          exact
          path="/c/:id/admin"
          render={props => <CAdmin id={props.match.params.id} />}
        />
        <Route
          exact
          path="/c/:id"
          render={props => <CHome id={props.match.params.id} />}
        />
        <Route exact path="/c" render={props => <CHome id={''} />} />
        {/* dev routes */}
        {!live && <Route exact path="/saasend" component={SClosed} />}
        {!live && <Route exact path="/test2" component={Tester} />}
        {!live && (
          <Route
            exact={true}
            path="/test"
            render={() => {
              localStorage.setItem('test', 'y');
              return <Play />;
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

export default observer(DTCRouter);
