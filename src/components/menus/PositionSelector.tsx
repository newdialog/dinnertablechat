import * as React from 'react';
import classNames from 'classnames';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@material-ui/core'
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';

const styles = theme => 
  createStyles({
    layout: {
      width: 'auto',
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
        width: 1100,
        // marginLeft: 'auto',
        // marginRight: 'auto',
      },
    },
    cardGrid: {
      padding: `${theme.spacing.unit * 4}px 0`,
    },
    card: {
      minWidth: '300px',
      width: '50vw',
      maxWidth: '500px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      // width: '100%'
      // width:'auto!important'
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  t: any;
}
interface State {
  open: boolean;
}

 
class PositionSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  private onSelect = (position: number, proposition: string, topic: string) => {
    this.props.store.debate.setPosition(position, topic)
  }

  public render() {
    const { classes, store, t } = this.props;
    const { open } = this.state;
    const topics = Number.parseInt(t('topics-num'), 10);

    const data:any[] = [];
    for(let i = 0; i < topics; i++) data.push({
      topic: t('topic' + i + '-topic'),
      photo: t('topic' + i + '-photo'),
      positions: t('topic' + i + '-positions').split(', '),
      proposition: t('topic' + i + '-proposition'),
    })
    // console.log('data', data)

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
        <Grid container spacing={0} justify="center">
        {data.map((card, i) => (
            <Grid key={i} sm={3} md={3} lg={3} item>
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
                  <Typography>
                      {card.proposition}
                  </Typography>
                  </CardContent>
                  <CardActions>
                  <Button size="small" color="primary" onClick={() => this.onSelect(1, card.proposition, card.topic)}>
                      {card.positions[0]}
                  </Button>
                  <Button size="small" color="primary"onClick={() => this.onSelect(0, card.proposition, card.topic)}>
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
