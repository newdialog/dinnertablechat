import * as React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Tester from './DebateTester'
import LoadingScene from './LoadingScene'
import { inject } from 'mobx-react';
import DebateScene from './DebateScene'
import PeerService from '../../services/PeerService'
import DebateFeedback from './DebateFeedback';

import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';
import DebateTester from './DebateTester';
interface Props {
  store: AppModel.Type;
}
interface State {
  peer?:PeerService,
}
class DebateRouter extends React.Component<Props,State> {
  constructor(props:Props) {
    super(props);
    console.log('debate con');
    this.state = {};
  }

  private onPeer = (peer:any) => {
    this.setState( {peer} )
  }

  public render() {
    const props = this.props;
    const store = props.store;
    if(store.auth.isNotLoggedIn) {
      store.router.push('/');
      return (<div/>);
    }

    const ds = props.store.debate;
    const isTest = ds.isTest;
    let stage = 0;
  
    const inSync = ds.match && ds.match!.sync && this.state.peer;
    
    if(ds.position === -1 || ds.contribution === -1) stage = 0;
    else stage = 1;

    if(inSync) stage = 2;
    // If this is a test, skip Loading stage for syncing
    else if(isTest) stage = 2;

    if(ds.finished) stage = 3;

    // TODO: not sure why this is needed
    // if(stage === 2 && !this.state.peer) stage = 1;
  
    console.log('debate route stage:', stage, ds.position, ds.contribution, 'ds.match set '+ !!ds.match, 'sync done:' + inSync)
  
    if(stage === 0) {
      console.log('lost state');
      store.gotoHomeMenu();
    }
  
    return (
      <React.Fragment>
        { stage === 1 && <LoadingScene store={store} onPeer={this.onPeer} /> }
        { stage === 2 && !isTest && <DebateScene store={store} peer={this.state.peer!} /> }
        { stage === 2 && isTest && <DebateTester store={store} peer={this.state.peer!} /> }
        { stage === 3 && <DebateFeedback store={store} /> }
      </React.Fragment>
    );
  }
}

/*
{ stage === 0 && <Tester store={store}/> }

<Route path="/rtc" component={RTCHome}/>
<DefaultRoute component={Home} />
*/
export default inject('store')(HOC(DebateRouter, null, true));