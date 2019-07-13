import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import * as TopicInfo from '../../utils/TopicInfo';

import {submit, getAll} from '../../services/ConfService';

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
      backgroundColor: '#eceadb',
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



export default function PleaseWaitResults(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState<any>({data:{}});

  const conf = props.id || '111';

  React.useEffect( () => {
    const pos = store.conf.positions;
    const user = store.getRID();

    if(!pos || Object.keys(pos).length === 0) return;

    console.log('starting test');
    submit(pos, conf, user);
  }, []);

  // console.log('TopicInfo.Card data', data);
  const onSelect = async () => {
    const data = await getAll(conf);
    console.log('data', data);
    setState(p=>({...p, data}));
  };

  return (
    <div className={classes.layout}>
      <Grid container spacing={2} justify="center">
        
          <Grid sm={10} md={10} lg={10} item>
            <Card className={classes.card + ' ' + classes.bgCardColor}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h5">Please Wait</Typography>
                <Typography variant="body2">{JSON.stringify(state.data)}</Typography>
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
