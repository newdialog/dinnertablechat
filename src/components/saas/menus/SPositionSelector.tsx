import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../../models/AppModel';
import * as TopicInfo from '../../../utils/TopicInfo';

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',

      [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
        // width: 1100,
        // marginLeft: 'auto',
        // marginRight: 'auto',
      }
    },
    full: {
      width:'100%',
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
      color: '#ffffff',
      margin: '.5em 0 2em 0'
    },
    cardGrid: {
      // padding: `${theme.spacing(4)}px 0`,
    },
    card: {
      width: '100%',
      // maxWidth: '500px',
      height: '100%',
      textAlign: 'center',
      flexDirection: 'column',
      
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      [theme.breakpoints.down('sm')]: {
        width: '100%',
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
  { name: 'SPositionSelector' }
);

interface Props {
  store: AppModel.Type;
  id: string;
  prefix?: string;
  data?: any[];
  onSubmit: (selected:any) => void;
}

export default function SPositionSelector(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState<any>({ready:false, selected: {}, submitted: false});

  const data: TopicInfo.Card[] = React.useMemo(
    () => props.data ? props.data : TopicInfo.getOtherTopics(props.id, t, props.prefix),
    [props.id, t]
  );

  const numQ = data.length;

  const onSelect = (position: number, card: TopicInfo.Card) => {
    if(state.submitted) return;
    setState(x=>({...x, selected: {...x.selected, [card.id]: position } }));
  };

  React.useEffect(()=>{
    if(Object.keys(state.selected).length === numQ) setState(x=>({...x, ready: true }));
  }, [state]);

  const submit = () => {
    setState(x=>({...x, submitted: true }));
    console.log('state', state.selected);

    props.onSubmit(state.selected);
  }

  // console.log('TopicInfo.Card data', data);

  return (
    <div className={classes.layout}>
      <Grid container spacing={1} justify="center" className={classes.full}>
        {data.map((card, i) => (
          <Grid key={i} sm={10} md={10} lg={10} item className={classes.full}>
            <Card className={classes.card + ' ' + classes.bgCardColor}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h5">{card.proposition}</Typography>
              </CardContent>
              <CardActions style={{ justifyContent: 'center' }}>
                {card.positions.map((p, positionIndex) => (
                  <Button
                    disabled={state.selected[card.id]===positionIndex}
                    variant="contained"
                    size="small"
                    style={{marginLeft: (positionIndex > 0) ? '1em':0}}
                    key={positionIndex}
                    color="secondary"
                    className={classes.btn}
                    onClick={() => onSelect(positionIndex, card)}
                  >
                    {p}
                  </Button>
                ))}
              </CardActions>
            </Card>
          </Grid>
        ))}

      <Grid sm={10} md={10} lg={10} item>
      <div className={classes.card}>
      <Button
          variant="contained"
          disabled={!state.ready || state.submitted}
          // size="small"
          color="secondary"
          className={classes.submit}
          onClick={submit}
        >
          SUBMIT
        </Button>
        </div>
        </Grid>
        
      </Grid>
      
    </div>
  );
}
