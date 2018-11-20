import * as React from 'react';
import classNames from 'classnames';
import { createStyles, WithStyles } from '@material-ui/core/styles';
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
import HOC from '../HOC';
import * as TopicInfo from '../../utils/TopicInfo';

const styles = theme =>
  createStyles({
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
      paddingTop: '44.25%' // 16:9
    },
    cardContent: {
      flexGrow: 1
    }
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  t: any;
}
interface State {
  noop: boolean;
}

class PositionSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { noop: false };
  }

  private onSelect = (position: number, card: TopicInfo.Card) => {
    this.props.store.debate.setPosition(position, card.id);
  };

  public render() {
    const { classes, store, t } = this.props;

    const data: TopicInfo.Card[] = TopicInfo.getTopics(t);

    return (
      <div className={classNames(classes.layout, classes.cardGrid)}>
        <Grid container spacing={0} justify="center">
          {data.map((card, i) => (
            <Grid key={i} sm={10} md={10} lg={10} item>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={card.photo}
                  title={card.topic}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {card.topic}
                  </Typography>
                  <Typography>{card.proposition}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => this.onSelect(0, card)}
                  >
                    {card.positions[0]}
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => this.onSelect(1, card)}
                  >
                    {card.positions[1]}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default HOC(PositionSelector, styles);
