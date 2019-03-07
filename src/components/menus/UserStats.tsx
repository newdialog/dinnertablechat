import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import HOC from '../HOC';
import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';

const styles = theme =>
  createStyles({
    root: {
      justifyContent: 'center',
      marginTop: '60px',
    },
    item: {

    },
    xp: {

    },

  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}

function UserStats(props: Props) {
  const { classes, store } = props;

    // TODO: update store and read this value
  const numDebates = 10; //this.state.data.length;
    const m = 20;
    const xpPerLevel = 3 * m; // 60
    const startingXP = 0;
    const xpTotal = numDebates * m + startingXP;
    const xp = xpTotal % xpPerLevel;
    const level = Math.floor(xpTotal / xpPerLevel) + 1;
    const nextLevel = xpPerLevel;

  const normalise = value => ((value - 0) * 100) / (xpPerLevel - 0);

  let title = 'Beginner Apprentice';
  if (level > 3) title = 'Traveling Journeyman';
  if (level > 6) title = 'Experienced Rhetorician';
  if (level > 12) title = 'Most Honorable Host';


  return (
    <div className={classes.root}>
    <Grid id="top-row" container spacing={24}>
        <Grid item xs={4}>
        <i className="fas fa-star"></i>
            <Typography
                variant="body2"
                align="left"
                color="textPrimary"
                gutterBottom
                className={classes.item}
                style={{ fontWeight: 'normal', fontSize: '1em' }}
            >
                {xp}/{nextLevel}
            </Typography>
            <LinearProgress
                color="secondary"
                variant="determinate"
                value={normalise(xp)}
            />
            </Grid>
        <Grid item xs={4}>
        <i className="fas fa-trophy"></i>
            <Typography
                variant="body2"
                align="left"
                color="textPrimary"
                gutterBottom
                className={classes.item}
                style={{ fontWeight: 'normal', fontSize: '1em' }}
            >
                {level}: {title}
            </Typography>
        </Grid>
        <Grid item xs={4}>
        <i className="fas fa-comments"></i>
            <Typography
                variant="body2"
                align="left"
                color="textPrimary"
                gutterBottom
                className={classes.item}
                style={{ fontWeight: 'normal', fontSize: '1em' }}
            >
                {numDebates || 'zero'}
            </Typography>
        </Grid>
    </Grid>
    </div>
  );
}

export default inject('store')(HOC(UserStats, styles));
