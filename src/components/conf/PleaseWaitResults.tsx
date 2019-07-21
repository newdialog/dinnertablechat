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

import { submit, getAll } from '../../services/ConfService';
import { match, match2, findMyGroup } from '../../services/ConfMath';
import ConfGraph from './ConfGraph';

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
  data: any;
  myGroup?: any;
}

function showData(state: State) {
  const data = state.data;

  let groupId = -1;
  if (state.myGroup) groupId = state.myGroup.gid;

  const msg = 'please see table: ' + groupId;
  let test = groupId > -1 ? msg : 'group error';
  return test;
  // <div>myGroup: {JSON.stringify(state.myGroup)}</div>
}

function showDataAdmin(state: State) {
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
}

export default function PleaseWaitResults(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState<State>({ data: [], checks: 0 });

  const pos = store.conf.positions;
  const isAdmin = !pos || Object.keys(pos).length === 0;
  const conf = props.id || '111';
  const user = store.getRID();

  React.useEffect(() => {
    if (isAdmin) {
      // is teacher
      return;
    }

    console.log('sending data');
    submit(pos, conf, user).then(x => onSelect());
  }, []);

  // console.log('TopicInfo.Card data', data);
  const onSelect = async () => {
    var data: Data = await getAll(conf);
    const result = match2(data);

    if (!isAdmin) {
      const myGroup = findMyGroup(store.getRID(), result);
      if (myGroup) setState(p => ({ ...p, myGroup }));
    }

    console.log('r', JSON.stringify(result));
    setState(p => ({ ...p, data: result }));
  };

  useInterval(() => {
    if (state.checks > 0) return; // stop
    console.log('state.checks', state.checks);
    setState(p => ({ ...p, checks: p.checks + 1 }));
    onSelect();
  }, 1000);

  return (
    <div className={classes.layout}>
      <Grid container spacing={2} justify="center">
        <Grid sm={10} md={10} lg={10} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              {state.data.length < 1 && <Typography variant="h5">Please Wait</Typography>}
              <Typography variant="body2">
                {isAdmin ? showDataAdmin(state) : showData(state)}
              </Typography>
              <ConfGraph store={store} data={state.data as any}/>
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                // size="small"
                color="secondary"
                className={classes.btn}
                onClick={() => onSelect()}
              >
                Retry
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
