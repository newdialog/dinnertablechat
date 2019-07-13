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
  prefix?: string;
  onSubmit: (selected:any) => void;
}

export default function PositionSelector(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = React.useState<any>({ready:false, selected: {}, submitted: false});

  const data: TopicInfo.Card[] = React.useMemo(
    () => TopicInfo.getSaaSTopics(props.id, t, props.prefix),
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
      <Grid container spacing={2} justify="center">
        {data.map((card, i) => (
          <Grid key={i} sm={10} md={10} lg={10} item>
            <Card className={classes.card + ' ' + classes.bgCardColor}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h5">{card.proposition}</Typography>
              </CardContent>
              <CardActions style={{ justifyContent: 'center' }}>
                {card.positions.map((p, positionIndex) => (
                  <Button
                    disabled={state.selected[card.id]===positionIndex}
                    variant="contained"
                    // size="small"
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
