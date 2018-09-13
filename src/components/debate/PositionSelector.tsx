import * as React from 'react';
import classNames from 'classnames';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@material-ui/core'
import { data } from './sampleSelectionJSON';
import withRoot from '../../withRoot';
import { observer } from 'mobx-react';
import * as AppModel from '../../models/AppModel';

// const logoData = require('../../assets/logo.json');

const styles = theme => 
  createStyles({
    layout: {
      width: 'auto',
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
        width: 1100,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    cardGrid: {
      padding: `${theme.spacing.unit * 4}px 0`,
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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
}
interface State {
  open: boolean;
}

@observer
class PositionSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  private onSelect = (position: string, proposition: string, topic: string) => {
    this.props.store.debate.setPosition(position, proposition, topic)
    this.props.store.debate.setStep(1)
  }

  public render() {
    const { classes, store } = this.props;
    const { open } = this.state;

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
        <Grid container spacing={40} justify="center">
        {data.map((card, i) => (
            <Grid item key={i} sm={6} md={4} lg={3}>
            <Card className={classes.card}>
                <CardMedia
                className={classes.cardMedia}
                image={card.photo}
                title={card.topic}
                />
                <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="headline" component="h2">
                    {card.topic}
                </Typography>
                <Typography>
                    {card.proposition}
                </Typography>
                </CardContent>
                <CardActions>
                <Button size="small" color="primary" onClick={() => this.onSelect(card.positions[1], card.proposition, card.topic)}>
                    {card.positions[1]}
                </Button>
                <Button size="small" color="primary"onClick={() => this.onSelect(card.positions[0], card.proposition, card.topic)}>
                    {card.positions[0]}
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

export default withRoot(withStyles(styles)(PositionSelector));
