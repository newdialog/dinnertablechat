import { Theme } from '@material-ui/core/styles';
import { makeStyles } from'@material-ui/core/styles';
import useInterval from '@use-it/interval';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useFocus } from 'utils/useFocus';

import * as AppModel from '../../models/AppModel';
import { match2 } from '../../services/ConfMath';
import { ConfIdRow, delAll, getAll, init, submitReady, UserRows } from '../../services/ConfService';
import ConfThinking from './ConfThinking';

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
  table: ConfIdRow;
  refreshTable: () => Promise<ConfIdRow | null>;
  questions: any;
}
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

  // TODO CHANGE THIS NOW
  const numGroups = props.table.maxGroups || 2;
  const minGroupUserPairs = props.table.minGroupUserPairs || 1;

  React.useEffect(() => {
    console.log('user', user);
    onRefresh();
  }, []);

  const matchUp = async () => {
    const table = await props.refreshTable();
    if(!table) throw new Error('no table found ' + table);
    const rdata = await getAll(confid, table.version);

    let data: UserRows = rdata.data;
    
    // #section: hack in case questions are removed
    console.log('q', table.questions);
    console.log('data ans', data.map(x=>x.answers));

    

    // filter out users with bad question
    const questions = table.questions;
    // Every user answer matches to Some table definition of that id
    // fixes users who over (bad question) or under answered since updates
    data = data.filter(x => Object.entries(x.answers).every( ([k,v]) => questions.some(q => q.id === k) ));

    console.log('pruned', data);
    // throw new Error('-');
    // #endsection

    // OVERRIDE numgroups for now
    const numUsers = data.length;
    // Users 100 / 10pairs(20ppl per table) = 5 tables
    let NUM_GROUPS = Math.ceil(numUsers / (minGroupUserPairs * 2));
    if (NUM_GROUPS < 2) NUM_GROUPS = 2;

    // console.log('data, NUM_GROUPS, minGroupUserPairs', data, NUM_GROUPS, minGroupUserPairs);

    const result = match2(data, NUM_GROUPS, minGroupUserPairs); // TODO: numGroups

    // console.log('result', JSON.stringify(result));
    return result;
  };

  const onRefresh = async () => {
    // const result = (await getResults(confid)) || [];
    // console.log('onRefresh result', result);

    const table = await props.refreshTable();
    if(!table) return;

    const rdata = await getAll(confid, table.version);
    // debugger;
    const results = table.results || []; // rdata.meta.results!;
    const ready = results.length > 0 || table.ready;

    const numUsers = rdata.data.length;

    console.log(rdata, numUsers, table.version);

    const payload = { data: rdata.data, results };

    if (JSON.stringify(payload) === JSON.stringify(state.payload)) {
      // console.log('no change')
      return; // already have its
    }

    setState(p => ({ ...p, payload, ready, numUsers }));
    // console.log('r', JSON.stringify(result));
  };

  const inFocus = useFocus(null, true, inFocus => {
    inFocus && onRefresh();
  });

  const onInterval = React.useCallback(() => {
    if (state.checks < 1 || !inFocus) return;
    onRefresh();
    setState(p => ({ ...p, checks: p.checks - 1 }));
  }, [state.checks]);

  useInterval(onInterval, 9 * 1000);

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

    window.gtag('event', ('conf_admin_ready_' + confid + '_' + toggle), {
      event_category: 'conf',
      confid: confid
    });

    if (toggle) {
      setState(p => ({ ...p, thinking: true }));
      return; // do THinking
    } else {
      // const results = await matchUp();
      await submitReady(false, confid, [], store.getRID()!); // .then(x=>checkReady());

      onRefresh();
      resetChecks();
    }
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

    await delAll(confid, store.getRID()!);

    onRefresh();
    resetChecks();
  };

  React.useEffect(() => {
    init();
  }, []);

  const onCloseThinking = async () => {
    setState(p => ({ ...p, thinking: false }));
    const results = await matchUp();
    await submitReady(true, confid, results, store.getRID()!); // .then(x=>checkReady());

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
    showRefresh: state.checks < 1 || !inFocus,
    questions: props.questions
  };

  return (
    <>
      {state.thinking && <ConfThinking onClose={onCloseThinking} />}
      <AdminView store={store} {...vprops} />
    </>
  );
}
