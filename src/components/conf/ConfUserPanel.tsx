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
  waitForReady
} from '../../services/ConfService';
import { match, match2, findMyGroup } from '../../services/ConfMath';
import ConfGraph from './ConfGraph';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

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
      maxWidth: '500px',
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
  numUsers?:number;
}

function showData(state: State, confid:string, t:any) {
  // console.log('state.ready', state.ready);

  let groupId = -1;
  if (state.myGroup) groupId = state.myGroup.gid;

  const groupName = TopicInfo.getGroupByIndex(confid, groupId, t)

  const msg = groupName;
  let test = groupId > -1 ? msg : null; // 'Sorry, groups already assigned.'; // no group yet
  return test;
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
  const confid = props.id || '111';
  const user = store.getRID();

  if(!user) throw new Error('no user');

  const onStart = async () => {
    console.log('sending data');

    // const ready = state.ready; // await checkReady();

    // if (!ready) 
    await submit(pos, confid, user);
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
  }, [user]);

  const onRefresh = async () => {
    const result = (await getResults(confid)) || [];
    const ready = result && result.length > 0;

    // console.log('onRefresh result', result);

    if (ready) {
      console.log('store.auth.user!.id', user);
      const myGroup = findMyGroup(user, result);
      console.log('myGroup', myGroup);

      if (myGroup!==null) setState(p => ({ ...p, myGroup }));
    }

    setState(p => ({ ...p, data: result, ready  }));
    // console.log('r', JSON.stringify(result));
  };

  const onInterval = React.useCallback(() => {
    if (state.checks > 5) return;
    onRefresh();
    setState(p => ({ ...p, checks: state.checks + 1 }));
  }, [confid, user, state.checks]);

  useInterval(onInterval, 20 * 1000);

  React.useEffect(() => {
    init();
  }, []);

  const group = state.ready ? showData(state, confid, t) : '';

  return (
    <div className={classes.layout}>
      <Grid container spacing={2} justify="center">
        <Grid sm={10} md={10} lg={10} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              {state.data.length < 1 && (
                <Typography variant="h5">Please Wait</Typography>
              )}
              <Typography variant="body2">
                {!state.ready && 'Waiting for assignments...'}
                {state.ready && !group && 'Sorry, groups already assigned.'}
                {group && `Your assigned group is:`}
              </Typography>
              {group && 
                <Chip
                  label={group}
                  className={classes.chip}
                  color="secondary"
                />
              }
             
                
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                // size="small"
                color="secondary"
                className={classes.btn}
                onClick={() => onRefresh()}
              >
                Reload
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
