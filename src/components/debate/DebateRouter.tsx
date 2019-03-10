import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Tester from './DebateTester';
import LoadingScene from './LoadingScene';
import { inject } from 'mobx-react';
import DebateScene from './DebateScene';
import PeerService from '../../services/PeerService';
import DebateFeedback from './DebateFeedback';
import { observer } from 'mobx-react-lite';
import * as AppModel from '../../models/AppModel';
import DebateTester from './DebateTester';
import { useTranslation } from 'react-i18next';

interface State {
  peer?: PeerService;
}
export default observer(function DebateRouter() {
  const store = useContext(AppModel.Context)!;
  const { t } = useTranslation();

  const [state, setState] = useState({ peer: null });

  // Auth guard
  if (store.auth.isNotLoggedIn) store.router.push('/');
  else if (!store.auth.user) return null;

  const onPeer = (peer: any) => {
    setState({ peer });
  };

  if (store.auth.isNotLoggedIn) {
    store.router.push('/');
    return <div />;
  }

  const ds = store.debate;
  const isTest = ds.isTest;
  let stage = 0;

  const inSync = ds.match && ds.match!.sync && state.peer;

  if (ds.position === -1 || ds.contribution === -1) stage = 0;
  else stage = 1;

  if (inSync) stage = 2;
  // If this is a test, skip Loading stage for syncing
  else if (isTest) stage = 2;

  if (ds.finished) stage = 3;

  // TODO: not sure why this is needed
  // if(stage === 2 && !this.state.peer) stage = 1;

  console.log(
    'debate route stage:',
    stage,
    ds.position,
    ds.contribution,
    'ds.match set ' + !!ds.match,
    'sync done:' + inSync
  );

  if (stage === 0) {
    console.log('lost state');
    store.gotoHomeMenu();
  }

  return (
    <>
      {stage === 1 && <LoadingScene store={store} onPeer={onPeer} />}
      {stage === 2 && !isTest && (
        <DebateScene store={store} peer={state.peer!} />
      )}
      {stage === 2 && isTest && (
        <DebateTester store={store} />
      )}
      {stage === 3 && <DebateFeedback store={store} />}
    </>
  );
})
// peer={state.peer!} 