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
      marginTop: '55px',
      //background: '#a69c92', 
      backgroundImage: `url(${'./imgs/woodgrain.jpg'})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    },
    groupItem: {
    },
    item: {
      textAlign: 'center',
      minWidth: '60px',
      maxWidth: '250px'
    },
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}

function UserStats(props: Props) {
  const { classes, store } = props;

  const numDebates = (store.auth.user) ? store.auth.user.numDebates : 0; 
  const m = 20;
  const xpPerLevel = 3 * m; // 60
  const startingXP = 0;
  const xpTotal = numDebates * m + startingXP;
  const xp = xpTotal % xpPerLevel;
  const level = Math.floor(xpTotal / xpPerLevel) + 1;
  const nextLevel = xpPerLevel;

  const normalise = value => ((value - 0) * 100) / (xpPerLevel - 0);

  let title = 'Beginner Apprentice';
  if (level > 3) title = 'Traveling Journeyperson';
  if (level > 6) title = 'Experienced Rhetorician';
  if (level > 12) title = 'Most Honorable Host';


  return (
    <div className={classes.root}>
    <Grid id="row" container justify="space-around" alignItems="center" spacing={16}>
        <Grid item xs={3} className={classes.item} justify="center" alignItems="center">
          <div className={classes.groupItem}>
            <i className="fas fa-trophy" style={{color:'#aee2ea', fontSize: '1.7em'}}></i>
            <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                gutterBottom
                className={classes.item}
            >
                {level}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={3} className={classes.item} justify="center" alignItems="center">
          <div className={classes.groupItem}>
            <i className="fas fa-star" style={{color:'#aee2ea', fontSize: '1.2em'}}></i>
            <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                gutterBottom
                className={classes.item}
              >
                {xp}/{nextLevel}
              </Typography>
              <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={normalise(xp)}
                  style={{height: '6px'}}
              />
          </div>
        </Grid>
        <Grid item xs={3} className={classes.item} justify="center" alignItems="center">
          <div className={classes.groupItem}>
            <i className="fas fa-comments" style={{color:'#aee2ea', fontSize: '1.7em'}}></i>
            <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                gutterBottom
                className={classes.item}
            >
                {numDebates || 'zero'}
            </Typography>
          </div>
        </Grid>
    </Grid>
    </div>
  );
}

export default inject('store')(HOC(UserStats, styles));
