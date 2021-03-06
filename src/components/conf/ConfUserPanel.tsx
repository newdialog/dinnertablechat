import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useTimeoutFn, useInterval, useDebounce } from 'react-use';
import Prando from 'prando';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useFocus } from 'utils/useFocus';

import * as AppModel from '../../models/AppModel';
import { findMyGroup, groupByIndex } from '../../services/ConfMath';
import {
  ConfIdRow,
  getResults,
  init,
  submit
} from '../../services/ConfService';
import * as TopicInfo from '../../utils/TopicInfo';
import ConfUserBars from './ConfUserBars';

// import * as Zoom from './Zoom';

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
      fontSize: '1.1em'
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
      minWidth: '300px',
      width: '50vw',
      maxWidth: '100%',
      height: '100%',
      textAlign: 'center',
      flexDirection: 'column',

      [theme.breakpoints.down('md')]: {
        width: '80vw'
      },
      [theme.breakpoints.down('sm')]: {
        width: '100vw'
      }
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
      margin: theme.spacing(1),
      fontSize: '2em'
    }
  }),
  { name: 'PleaseWaitResults' }
);

interface Props {
  store: AppModel.Type;
  id: string;
  table: ConfIdRow;
  questions: any;
  handleReset: (soft?: boolean) => void;
  // data: any;
}
// type Data = Array<User>;
interface State {
  checks: number;
  data: any[];
  myGroup?: any;
  ready: boolean;
  submitBlocked: boolean;
  numUsers?: number;
  isLate?: boolean;
  version: number;
  refresh: number;
}

function showGroup(groupId: any, confid: string, t: any) {
  if (groupId === null || groupId === -1) return null;
  // console.log('state.ready', state.ready);

  const groupName = TopicInfo.getGroupByIndex(confid, groupId, t); // cant

  const msg = groupName;
  let test = groupId > -1 ? msg : null; // 'Sorry, groups already assigned.'; // no group yet
  return test;
}

let assignedTag = false;
export default function ConfUserPanel(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState<State>({
    data: [],
    checks: 6 * 15, // 15min
    ready: false,
    submitBlocked: false,
    version: -1,
    myGroup: null,
    refresh: 0
  });

  const pos = store.conf.positions;

  const confid = props.id;
  const user = store.getRID();

  if (!user) throw new Error('no user');

  const onStart = async () => {
    if (!confid) return;
    // console.log('sending data');

    // const ready = state.ready; // await checkReady();

    // if (!ready)
    window.scrollTo(0, 0);
    await submit(pos, confid, user, props.table.version);
    // .then(checkReady);
    // else {
    //   setState(p => ({ ...p, submitBlocked: true }));
    // }
    await onRefresh();

    console.log('finished start');
  };

  React.useEffect(() => {
    console.log('user', user);
    onStart();
  }, [user, pos, confid]);

  const onZoom = async (group:string | null) => {
    const win = window.open();
    win!.document.write("<h2>Please wait while connecting you to your group...</h2>");

    console.log('onZoom click');
    if(group===null) {
      alert('no group assigned  yet');
      return;
    }
    // const config = Zoom.makeConfig(confid + '' + group);
    const meeting = confid + '' + group;
    // const url = await Zoom.zoomConnect(meeting);
    const url = `https://meet.jit.si/${meeting}`;
    console.log('onZoom', url);

    // window.open(url, '_blank');
    // alert('Redirecting you to Zoo')
    win!.location.href = url;
  }

  const onRefresh2 = async () => {
    console.log('onRefresh2');
    const _data = await getResults(confid);
    if (!_data) throw new Error('cannot find results');

    // console.log('data', _data);
    const result = _data.results || [];
    const version = _data.version;

    const ready = _data.ready;

    // const resetOnUnReady = !ready && state.ready === true; // already being accounted for
    // Version changed Flag
    const resetFlag = version !== state.version && state.version > -1;
    if (resetFlag)
      console.log('trig: resetFlag', resetFlag, version, state.version);

    // Version changed
    if (resetFlag) {
      setState(p => ({
        ...p,
        data: [],
        ready: false,
        version: -1,
        myGroup: null,
        isLate: false
      }));
      props.handleReset();
      return;
    }

    let myGroup: any = null;

    if (ready) {
      // console.log('store.auth.user!.id', user);
      myGroup = findMyGroup(user, result);
      // if (myGroup !== null) setState(p => ({ ...p, myGroup }));
    }

    // If ready changed or group changed
    const groupNotMatched = (!!myGroup !== !!state.myGroup && !state.isLate);
    const readyChange = state.ready !== ready;
    const verChange = state.version !== version;
    
    if (readyChange || groupNotMatched || verChange) {
      
      if (readyChange)
        console.log('trig: ready [state, new]', state.ready, ready);
      if (verChange)
        console.log('trig: version [state, new]', state.version, version);
      if (groupNotMatched)
        console.log(
          'trig: groupNotMatched [state, new]',
          state.myGroup,
          myGroup
        );

      // metrics
      if (ready && myGroup && groupNotMatched) {
        // !assignedTag) {
        // assignedTag = true;
        window.scrollTo(0, 0);

        if (window.gtag)
          window.gtag('event', 'conf_user_assigned', {
            event_category: 'conf',
            event_label: confid,
            non_interaction: false
          });
        console.log('logging: conf_user_assigned');
      }

      // User late, assign random table
      let isLate = false;
      if (ready && !myGroup) {
        isLate = true;
        const numGroups = props.table.maxGroups || 1;
        let rng = new Prando(user);
        // ensure dont pick group with no users
        const maxCurrentGroups = Math.min(numGroups, result.length);
        // find random group
        const gid = Math.floor(rng.next() * maxCurrentGroups);
        myGroup = groupByIndex(gid, result);
        // console.log('rnd myGroup', myGroup, gid);

        if (readyChange) {
          //(!assignedTag)
          if (window.gtag)
            window.gtag('event', 'conf_user_assigned_late', {
              event_category: 'conf',
              event_label: confid,
              non_interaction: false
            });
          // assignedTag = true;
          console.log('logging: conf_user_assigned_late');
        }
      }

      console.log(
        'myGroup',
        myGroup,
        'isLate',
        isLate,
        'version',
        version,
        'ready',
        ready,
        'data',
        result
      );

      setState(p => ({ ...p, data: result, ready, myGroup, version, isLate }));
    }
  };

  useDebounce(onRefresh2, 2500, [state.refresh]);
  const onRefresh = () => {
    setState(p => ({ ...p, refresh: p.refresh + 1 }));
  };

  const inFocus = useFocus(null, true, _inFocus => {
    if (_inFocus) onRefresh(); // This causes a bug that clears state
  });

  const onInterval = React.useCallback(() => {
    console.log('state.checks', state.checks, inFocus);
    // if (state.checks < 1 || !inFocus) return;
    onRefresh();
    setState(p => ({ ...p, checks: p.checks - 1 }));
  }, [state.checks, inFocus, state.ready]);

  const pauseTimer = state.checks < 1 || !inFocus;
  useInterval(onInterval, pauseTimer ? null : 9 * 1000);

  React.useEffect(() => {
    init();
  }, []);

  let tooLate = !!state.isLate;

  let group: string | null = null;
  let groupInfo: any = { members: [], gid: -1 };
  // User has been assigned
  if (state.ready && state.myGroup) {
    group = showGroup(state.myGroup.gid, confid, t);
    // groupInfo = state.myGroup;
    groupInfo.gid = state.myGroup.gid;
    groupInfo.membersHash = { ...state.myGroup };
    delete groupInfo.membersHash.gid;
    groupInfo.members = Object.values(groupInfo.membersHash);
  }

  const showRefresh = !state.ready; // !group && (state.checks < 1 || !inFocus);

  return (
    <div className={classes.layout}>
      <Grid container spacing={2} justify="center">
        <Grid sm={10} md={10} lg={10} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              {state.data.length < 1 && (
                <>
                  <Typography variant="h5">
                    {!state.ready && 'Waiting for assignments...'}
                    {state.ready && !group && 'Sorry, groups already assigned.'}
                    {!tooLate && group && `Please join your group`}
                  </Typography>
                  {!!props.table!.waitmsg && (
                    <Typography variant="body1" align="left">
                      {props.table!.waitmsg}
                      <br />
                      <br />
                      <br />
                    </Typography>
                  )}
                  {!props.table!.waitmsg && (
                    <>
                      <Typography variant="body1">
                        till everyone else has answered...
                        <br />
                        While you wait please be quite and you may want to study
                        the <i>Rules of the Game: </i>
                        <br />
                        <br />
                      </Typography>
                      <Typography variant="body1" align="left">
                        You don’t have to talk about all the questions. Maybe
                        pick the group’s favourites first. <br />
                        <br />
                        Be honest, dare to say what you think. Argue rationally
                        and based on facts. Don’t generalize. <br />
                        <br />
                        Don’t insult and, in turn, don’t take anything
                        personally. Avoid a one-(wo)man show - everyone in the
                        group should talk. Everyone’s on eye level. Shake your
                        opponents' hands after the discussion!
                        <br />
                        <br />
                        <br />
                      </Typography>
                    </>
                  )}
                </>
              )}
              <Typography variant="body2">
                {tooLate && (
                  <>
                    Groups have already been formed.
                    <br />
                    Assigning to random table:
                    <br />
                  </>
                )}
              </Typography>
              {group && (
                <>
                  <Chip
                    label={group}
                    className={classes.chip}
                    color="secondary"
                  />
                  <br />
                  <Button
                    variant="contained"
                    // size="small"
                    color="secondary"
                    className={classes.btn}
                    onClick={() => onZoom(group)}
                  >
                    Click to join group online
                </Button>
                  <br /><br />
                  <Typography variant="body1" align="center" style={{ padding: '0 2em' }}>
                    <b>
                      In your group, there are {groupInfo.members.length} people
                      with the opinions:
                    </b>
                  </Typography>
                  <br/>
                  <ConfUserBars
                    id={confid}
                    store={store}
                    data={groupInfo}
                    qdata={state.data}
                    questions={props.questions}
                  />
                  <br />
                  <br />
                </>
              )}
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              {showRefresh && (
                <Button
                  variant="contained"
                  // size="small"
                  color="secondary"
                  className={classes.btn}
                  onClick={() => onRefresh()}
                >
                  Refresh
                </Button>
              )}

              {group && (
                <>
                <Typography align="center" style={{ padding: '.1em' }}>
                Do you like this tool? Use our service at your next onference or event.
                <br/>Visit <a href="https://www.mixopinions.com" target="_bank">MixOpinions.com</a>
                </Typography>
                </>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
