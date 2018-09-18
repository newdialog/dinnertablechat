import * as React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Tester from './DebateTester'
import LoadingScene from './LoadingScene'
import { observer, inject } from 'mobx-react';
import withRoot from '../../withRoot';

import * as AppModel from '../../models/AppModel';
interface Props {
  store: AppModel.Type;
}

const DebateRouter = ( props: Props ) => {
  const store = props.store;
  const ds = props.store.debate;
  return (
    <React.Fragment>
      { ds.position === -1 && <Tester store={store}/> }
      { ds.position > -1 && <LoadingScene store={store}/> }
    </React.Fragment>
  );
};
/*
<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default inject('store')(withRoot(observer(DebateRouter)));