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
import classNames from 'classnames';
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
      marginLeft: '1.5em',
      color: '#ffffff',
      fontSize: '1.2em'
      // color: theme.palette.secondary.main
    },
    cardGrid: {
      // padding: `${theme.spacing(4)}px 0`,
    },
    card: {
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: '300px',
      width: '50vw',
      maxWidth: '500px',
      height: '100%',
      textAlign: 'center',
      flexDirection: 'column',
      backgroundColor: '#eceadb',
      [theme.breakpoints.down('md')]: {
        width: '80vw'
      },
      [theme.breakpoints.down('sm')]: {
        width: '100vw'
      }
    },
    cardMedia: {},
    cardContent: {
      flexGrow: 1
    },
    imgLink: {
      textDecoration: 'none'
    }
  }),
  { withTheme: true, name: 'PositionSelector' }
);

interface Props {
  store: AppModel.Type;
  id: string;
}

export default function PositionSelector(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();

  // state = { noop: false };

  const onSelect = (position: number, card: TopicInfo.Card) => {
    // store.debate.setCharacter(1);
    store.debate.setPosition(position, card.id);
  };

  const data: TopicInfo.Card[] = React.useMemo(
    () => TopicInfo.getSaaSTopics(props.id, t),
    [props.id, t]
  );
  // console.log('TopicInfo.Card data', data);

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={0} justify="center">
        {data.map((card, i) => (
          <Grid key={i} sm={10} md={10} lg={10} item>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h5">{card.proposition}</Typography>
              </CardContent>
              <CardActions style={{ justifyContent: 'center' }}>
                {card.positions.map((p, positionIndex) => (
                  <Button
                    variant="contained"
                    // size="small"
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
      </Grid>
    </div>
  );
}

/*
<CardMedia
className={classes.cardMedia}
// image={card.photo}
title={card.topic}
/>
*/
