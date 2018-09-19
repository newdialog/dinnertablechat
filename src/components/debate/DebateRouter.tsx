import * as React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Tester from './DebateTester'
import LoadingScene from './LoadingScene'
import { observer, inject } from 'mobx-react';
import withRoot from '../../withRoot';
import DebateScene from './DebateScene'

import * as AppModel from '../../models/AppModel';
interface Props {
  store: AppModel.Type;
}

const DebateRouter = ( props: Props ) => {
  const store = props.store;
  let stage = 0;

  const ds = props.store.debate;
  const inSync = ds.match && ds.match!.sync;
  
  if(ds.position === -1 || ds.contribution === -1) stage = 0;
  else stage = 1;
  if(inSync) stage = 2;

  console.log('stage', stage, ds.position, ds.contribution, 'ds.match set '+ !!ds.match, inSync)

  if(stage === 0) {
    console.log('lost state');
    store.router.push('./play');
  }

  return (
    <React.Fragment>
      { stage === 1 && <LoadingScene store={store}/> }
      { stage === 2 && <DebateScene store={store}/> }
    </React.Fragment>
  );
};
/*
{ stage === 0 && <Tester store={store}/> }

<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default inject('store')(withRoot(observer(DebateRouter)));