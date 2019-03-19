import * as React from 'react';
import classNames from 'classnames';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@material-ui/core';
import * as AppModel from '../../models/AppModel';
import * as TopicInfo from '../../utils/TopicInfo';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  layout: {
    width: 'auto',
    marginLeft: 'auto', // theme.spacing.unit * 3,
    marginRight: 'auto', // theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      // width: 1100,
      // marginLeft: 'auto',
      // marginRight: 'auto',
    }
  },
  btn: {
    marginLeft: '1.5em'
    // color: theme.palette.secondary.main
  },
  cardGrid: {
    // padding: `${theme.spacing.unit * 4}px 0`,
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
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={0} justify="center">
        {data.map((card, i) => (
          <Grid key={i} sm={10} md={10} lg={10} item>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                // image={card.photo}
                title={card.topic}
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.topic}
                </Typography>
                <Typography>{card.proposition}</Typography>
              </CardContent>
              <CardActions>
                {card.positions.map((p, i) => (
                  <Button
                    variant="contained"
                    // size="small"
                    key={i}
                    color="secondary"
                    className={classes.btn}
                    onClick={() => onSelect(i, card)}
                  >
                    {p}
                  </Button>
                ))}
              </CardActions>
            </Card>
            <Typography variant="caption">
              <a
                href="https://goo.gl/forms/TA1urn48JVhtpsO13"
                className={classes.imgLink}
                target="_blank"
              >
                Suggest a topic for next week ⬏
              </a>
            </Typography>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
