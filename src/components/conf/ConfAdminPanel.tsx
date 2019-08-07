import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Chip
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import * as TopicInfo from '../../utils/TopicInfo';
import useInterval from '@use-it/interval';

import { getAll, submitReady, init, delAll } from '../../services/ConfService';
import { match2, findMyGroup } from '../../services/ConfMath';

import FaceIcon from '@material-ui/icons/Face';
import ConfAdminPanelDash from './ConfAdminPanelDash';
import ConfThinking from './ConfThinking';
import { useFocus } from 'utils/useFocus';

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
        // width: 1100,
        // marginLeft: 'auto',
        // marginRight: 'auto',
      }
    },
    btn: {
      // marginLeft: '1.5em',
      color: '#ffffff',
      fontSize: '0.9em',
      marginRight: '0.3em'
      // color: theme.palette.secondary.main
    }
  }),
  { name: 'ConfAdminPanel' }
);

interface Props {
  store: AppModel.Type;
  id: string;
  view: any;
}

interface User {
  user: string;
  answers: Array<any>;
  answersHash?: Array<any>;
}
type Data = Array<User>;
interface State {
  checks: number;
  payload: { results: any[]; data: any[] };
  myGroup?: any;
  ready: boolean;
  submitBlocked: boolean;
  numUsers?: number;
  thinking?: boolean;
}

const CHECKS = 6 * 5; // 5m

function showData(state: State) {
  // console.log('state.ready', state.ready);
  if (!state.ready) return 'Waiting for assignments...';

  let groupId = -1;
  if (state.myGroup) groupId = state.myGroup.gid;

  const msg = 'please see table: ' + groupId;
  let test = groupId > -1 ? msg : 'Sorry, groups already assigned.'; // no group yet
  return test;
  // <div>myGroup: {JSON.stringify(state.myGroup)}</div>
}

export default function ConfAdminPanel(props: Props) {
  const store = props.store;
  const AdminView = props.view;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState<State>({
    payload: { data: [], results: [] },
    // results: [],
    checks: CHECKS, 
    ready: false,
    submitBlocked: false
  });

  // const isAdminPage = !pos || Object.keys(pos).length === 0;
  const confid = props.id || '111';
  const user = store.getRID();
  const numGroups = Number.parseInt(t(`conf-${confid}-maxGroups`), 10) || 1;

  React.useEffect(() => {
    console.log('user', user);
    onRefresh();
  }, []);

  const matchUp = async () => {
    console.log('matchup: numGroups', numGroups);
    const rdata = await getAll(confid);

    var data: Data = rdata.data;
    const result = match2(data, numGroups); // TODO: numGroups

    // console.log('result', JSON.stringify(result));
    return result;
  };

  const onRefresh = async () => {
    // const result = (await getResults(confid)) || [];
    // console.log('onRefresh result', result);

    const rdata = await getAll(confid);
    // debugger;
    const results = rdata.meta.results;
    const ready = results.length > 0 || rdata.meta.ready;

    const numUsers = rdata.data.length;

    const payload = { data: rdata.data, results };

    if (JSON.stringify(payload) === JSON.stringify(state.payload)) {
      // console.log('no change')
      return; // already have its
    }

    setState(p => ({ ...p, payload, ready, numUsers }));
    // console.log('r', JSON.stringify(result));
  };

  const inFocus = useFocus();

  const onInterval = React.useCallback(() => {
    if (state.checks < 1 || !inFocus) return;
    onRefresh();
    setState(p => ({ ...p, checks: p.checks - 1 }));
  }, [state.checks]);

  useInterval(onInterval, 10 * 1000);

  const onAdminReady = async (toggle: boolean) => {
    let msg = '';
    if (toggle)
      msg =
        'Are you sure you want to assign seating now? Users that respond afterwards will be assigned to random tables.';
    else msg = 'Are you sure you want to remove all seat assignments?';
    var r = window.confirm(msg);
    if (!r) {
      console.log('cancelling');
      return;
    }

    if (toggle) {
      setState(p => ({ ...p, thinking: true }));
      return; // do THinking
    }

    const results = await matchUp();
    await submitReady(toggle, confid, results); // .then(x=>checkReady());

    onRefresh();
    resetChecks();
  };

  function resetChecks() {
    setState(p => ({ ...p, checks: CHECKS }));
  }

  const onDeleteAll = async () => {
    var r = window.confirm('Delete All Responses: Are you sure?');
    if (!r) {
      console.log('cancelling');
      return;
    }

    console.warn('deleting all responses from: ' + confid);

    await delAll(confid);

    onRefresh();
    resetChecks();
  };

  React.useEffect(() => {
    init();
  }, []);

  const onCloseThinking = async () => {
    setState(p => ({ ...p, thinking: false }));
    const results = await matchUp();
    await submitReady(true, confid, results); // .then(x=>checkReady());

    // checkReady();
    onRefresh();
  };

  const vprops = {
    onRefresh,
    onAdminReady,
    onDeleteAll,
    confid,
    numUsers: state.numUsers,
    payload: state.payload,
    ready: state.ready,
    showRefresh: state.checks < 1 || !inFocus
  };

  return (
    <>
      {state.thinking && <ConfThinking onClose={onCloseThinking} />}
      <AdminView store={store} {...vprops} />
    </>
  );
}
