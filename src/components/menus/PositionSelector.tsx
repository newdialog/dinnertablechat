import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from'@material-ui/core/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import * as TopicInfo from '../../utils/TopicInfo';

const useStyles = makeStyles((theme: Theme) => ({
  layout: {
    width: 'auto',
    marginLeft: 'auto', // theme.spacing(3),
    marginRight: 'auto', // theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
      // width: 1100,
      // marginLeft: 'auto',
      // marginRight: 'auto',
    }
  },
  btn: {
    marginLeft: '1.5em'
    // color: theme.palette.secondary.main
  },
  card: {
    minWidth: '300px',
    width: '50vw',
    maxWidth: '500px',
    height: '100%',
    // display: 'flex',
    flexDirection: 'column'
    // width: '100%'
    // width:'auto!important'
  },
  cardMedia: {
    /// paddingTop: '44.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  imgLink: {
    textDecoration: 'none'
  }
}));

interface Props {
  store: AppModel.Type;
}

export default function PositionSelector(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();

  // state = { noop: false };

  const onSelect = (position: number, card: TopicInfo.Card) => {
    props.store.debate.setPosition(position, card.id);
  };

  const data: TopicInfo.Card[] = TopicInfo.getTopics(t);

  return (
    <div className={classes.layout}>
      <Grid container spacing={0} justify="center">
        {data.map((card, i) => (
          <Grid key={i} sm={10} md={10} lg={10} item>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.topic}
                </Typography>
                <Typography>{card.proposition}</Typography>
              </CardContent>
              <CardActions>
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