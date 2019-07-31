import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import * as TopicInfo from '../../utils/TopicInfo';
import useInterval from '@use-it/interval';

import {
  submit,
  getAll,
  isReady,
  getResults,
  submitReady,
  init,
  waitForReady,
  delAll
} from '../../services/ConfService';
import { match, match2, findMyGroup } from '../../services/ConfMath';
import ConfGraph from './ConfGraph';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import ConfAdminTable from './ConfAdminTable';
import ConfBars from './ConfBars';

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
    },
    submit: {
      width: '100px',
      fontSize: '1.1em',
      color: '#ffffff'
    },
    cardGrid: {
      // padding: `${theme.spacing(4)}px 0`,
    },
    card: {
      // minWidth: '300px',
      // width: '50vw',
      // maxWidth: '500px',
      // height: '100%',
      textAlign: 'center',
      flexDirection: 'column'
    },
    bgCardColor: {
      backgroundColor: '#eceadb'
    },
    cardMedia: {},
    cardContent: {
      flexGrow: 1
    },
    imgLink: {
      textDecoration: 'none'
    },
    chip: {
      margin: theme.spacing(1)
    }
  }),
  { name: 'PositionSelector' }
);

interface Props {
  store: AppModel.Type;
  id: string;
}

interface User {
  user: string;
  answers: Array<any>;
  answersHash?: Array<any>;
}
type Data = Array<User>;
interface State {
  checks: number;
  data: any[];
  myGroup?: any;
  ready: boolean;
  submitBlocked: boolean;
  numUsers?: number;
}

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

function showDataAdmin(state: State, classes: any) {
  const responses = state.numUsers || 0;
  /* state.data
    .map(x => Object.keys(x).length)
    .reduce((a, b) => a + b, 0); */

  return (
    <>
      <Chip
        icon={<FaceIcon />}
        label={'Groups: ' + state.data.length}
        className={classes.chip}
        color="primary"
      />
      <Chip
        icon={<FaceIcon />}
        label={'Responses: ' + responses}
        className={classes.chip}
        color="primary"
      />
    </>
  );

  // =====
  /* 
  const data = state.data;
  return data.map((users, index) => {
    let groupId = -1;
    if (state.myGroup) groupId = state.myGroup.gid;

    let test = (
        <span key={index}>{'Group ' + index + ': ' + Object.keys(users).join(', ')}<br/></span>
    );
    return test;
    // <div>myGroup: {JSON.stringify(state.myGroup)}</div>
  });
  */
}

let checking = false;
export default function PleaseWaitResults(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState<State>({
    data: [],
    checks: 0,
    ready: false,
    submitBlocked: false
  });

  const pos = store.conf.positions;
  const isAdminPage = !pos || Object.keys(pos).length === 0;
  const confid = props.id || '111';
  const user = store.getRID();

  const numGroups = Number.parseInt(t(`conf-${confid}-maxGroups`)) || 1;

  /* const checkReady = async (forceReady: boolean | null = null) => {
    // if(state.ready) return; // end checking if ready is true
    const ready = forceReady === null ? await isReady(conf) : forceReady;

    // we have an update to submit but couldnt at start as we were in ready-state
    if (!ready && state.submitBlocked === true) {
      setState(p => ({ ...p, submitBlocked: false }));
      await submit(pos, conf, user); // .then(onSelect);
    }

    setState(p => ({ ...p, ready }));
    return ready;
    // !ready && // check even if Ready, because admin might unready
  }; */

  const onStart = async () => {
    console.log('sending data');

    const ready = state.ready; // await checkReady();

    if (!ready) await submit(pos, confid, user);
    // .then(checkReady);
    else {
      setState(p => ({ ...p, submitBlocked: true }));
    }
    await onRefresh();

    console.log('finished start');
  };

  React.useEffect(() => {
    console.log('user', user);
    if (isAdminPage) {
      onRefresh();
      // is teacher
      return;
    }
    onStart();
  }, []);

  const matchUp = async () => {
    console.log('matchup: numGroups', numGroups);
    const rdata = await getAll(confid);
    // if (rdata.results) await checkReady(rdata.meta ? rdata.meta.ready : null);

    var data: Data = rdata.results;
    const result = match2(data, numGroups); // TODO: numGroups

    console.log('result', JSON.stringify(result));

    return result;
  };

  const onRefresh = async () => {
    const result = (await getResults(confid)) || [];
    const ready = result.length > 0;

    // console.log('onRefresh result', result);

    if (isAdminPage) {
      const rdata = await getAll(confid);
      // console.warn(rdata);

      const numUsers = rdata.results.length;
      setState(p => ({ ...p, numUsers }));
    }

    setState(p => ({ ...p, data: result, ready }));
    // console.log('r', JSON.stringify(result));
  };

  const onInterval = React.useCallback(() => {
    if (state.checks > 5) return;
    onRefresh();
    setState(p => ({ ...p, checks: state.checks + 1 }));
  }, [confid, user, state.checks]);

  useInterval(onInterval, 20 * 1000);

  const onAdminReady = async (toggle: boolean) => {
    const results = await matchUp();
    await submitReady(toggle, confid, results); // .then(x=>checkReady());

    // checkReady();
    onRefresh();
  };

  const onDeleteAll = async () => {
    var r = window.confirm('Delete All Responses: Are you sure?');
    if(!r) {
      console.log('cancelling');
      return;
    }

    console.warn('deleting all responses from: ' + confid);

    await delAll(confid);

    // checkReady();
    onRefresh();
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <div className={classes.layout}>
      <Grid container spacing={2} justify="center" style={{ width: '100%' }}>
        <Grid sm={12} md={6} lg={6} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
                {showDataAdmin(state, classes)}
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="small"
                // size="small"
                color="secondary"
                className={classes.btn}
                onClick={() => onRefresh()}
              >
                Reload
              </Button>

              <Button
                variant="contained"
                size="small"
                // disabled={state.ready}
                // size="small"
                color="secondary"
                className={classes.btn}
                onClick={() => onAdminReady(!state.ready)}
              >
                {!state.ready ? 'Assign All' : 'UnAssign All'}
              </Button>

              <Button
                variant="contained"
                size="small"
                // disabled={state.ready}
                // size="small"
                color="secondary"
                className={classes.btn}
                onClick={() => onDeleteAll()}
              >
                {'Delete All'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid sm={12} md={6} lg={6} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2">Group Layout</Typography>
              <ConfGraph store={store} data={state.data as any} />
            </CardContent>
          </Card>
        </Grid>

        <Grid sm={12} md={6} lg={6} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2">Response Bars</Typography>
              <ConfBars store={store} data={state.data as any} id={confid} />
            </CardContent>
          </Card>
        </Grid>

        <Grid sm={12} md={6} lg={6} item>
          <ConfAdminTable data={state.data}/>
        </Grid>
      </Grid>
    </div>
  );
}
