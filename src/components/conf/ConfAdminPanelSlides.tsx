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
import ConfGraph from './ConfGraph';

import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import ConfAdminTable from './ConfAdminTable';
import ConfBars from './ConfAdminBars';

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
  { name: 'ConfAdminPanelSlides' }
);

interface Props {
  store: AppModel.Type;
  onRefresh: () => void;
  onAdminReady: (toggle: boolean) => void;
  onDeleteAll: () => void;
  confid: string;
  numUsers?: number;
  payload: any;
  ready?: boolean;
}

interface State {}

export default function ConfAdminPanelSlides(props: Props) {
  const store = props.store;
  const {
    ready,
    onRefresh,
    onAdminReady,
    onDeleteAll,
    confid,
    numUsers,
    payload
  } = props;

  const classes = useStyles({});
  const { t } = useTranslation();
  // const [state, setState] = React.useState<any>({});
  // const [page, setPage] = React.useState<any>(0);

  const responses = numUsers || 0;

  let page = 0;
  if(ready) page = 1;

  return (
    <div className={classes.layout}>
      <Grid container alignContent="center" alignItems="center" spacing={2} 
      justify="center" style={{ width: '100%', height:'80vh' }}>

        <Grid hidden={page!==1}  sm={12} md={12} lg={12} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2">Groups have been assigned...</Typography>
              <ConfGraph store={store} data={payload.results} confid={confid} />
            </CardContent>
          </Card>
        </Grid>

        <Grid hidden={page!==0} sm={12} md={12} lg={12} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2">Responses</Typography>
              <ConfBars large={true} store={store} payload={payload} id={confid} />
            </CardContent>
          </Card>
        </Grid>

        <Grid hidden={page!==2} sm={12} md={12} lg={12} item>
          <ConfAdminTable payload={payload} confid={confid} />
        </Grid>

        { /* bottom */ }
        <Grid sm={12} md={12} lg={12} item>
          <Card className={classes.card + ' ' + classes.bgCardColor}>
            <CardContent className={classes.cardContent}>
              <Chip
                icon={<FaceIcon />}
                label={'Groups: ' + payload.results.length}
                className={classes.chip}
                color="primary"
              />
              <Chip
                icon={<FaceIcon />}
                label={'Responses: ' + responses}
                className={classes.chip}
                color="primary"
              />
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
                // size="small"
                color="secondary"
                className={classes.btn}
                onClick={() => onAdminReady(!ready)}
              >
                {!ready ? 'Assign All' : 'UnAssign All'}
              </Button>

              <Button
                variant="contained"
                size="small"
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
      </Grid>
    </div>
  );
}
