import React, { useState, useEffect, useContext } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@material-ui/core';
import * as AppModel from '../../../models/AppModel';
import PositionSelector from './SPositionSelector';
import Footer from '../../home/Footer';
import * as Times from '../../../services/TimeService';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
import AppFloatMenu from '../../menus/dash/AppFloatMenu';
import { Auther } from '../../Auther';

import DebateFeedback from '../../debate/DebateFeedback';
import LoadingScene from '../../debate/LoadingScene';
import DebateScene from '../../debate/DebateScene';
import SMenuHome from './SMenuHome';
import DebateTester from '../../debate/DebateTester';

const useStyles = makeStyles((theme: Theme) => ({
  pagebody: {
  }
}), { withTheme: true, name: 'MenuHome' });

interface Props {
  isTest?: boolean;
}

function onHistory(store: AppModel.Type) {
  store.router.push('/home');
}

export default observer(function SRouter(props: Props) {
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
  
    if (ds.position === -1 || ds.contribution === -1 || ds.character < 0) stage = 0;
    else stage = 1;
  
    if (inSync) stage = 2;
    // If this is a test, skip Loading stage for syncing
    else if (isTest) stage = 2;
  
    if (ds.finished) stage = 3;
  
    // TODO: not sure why this is needed
    // if(stage === 2 && !this.state.peer) stage = 1;
  
    console.log(
      'saas debate route stage:',
      stage,
      ds.position,
      ds.contribution,
      'ds.match set ' + !!ds.match,
      'sync done:' + inSync
    );

    if (stage === 0) {
        console.log('lost state');
        store.router.push('/saas');
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
});