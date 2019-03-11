import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as AppModel from '../../../models/AppModel';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    paddingLeft: '10vw'
    // marginTop: '55px',
    //background: '#a69c92',
    // backgroundImage: `url(${'./imgs/woodgrain.jpg'})`,
    // backgroundPosition: 'center',
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat'
  },
  groupItem: {},
  item: {
    // paddingLeft: '2em',
    textAlign: 'left',
    minWidth: '100px',
    maxWidth: '260px'
    // fontSize: '1em'
  },
  icon: {
    color: '#4dadef',
    fontSize: '1.7em',
    float: 'left',
    marginRight: '.5em'
  },
  icon2: {
    color: '#ef6c6c',
    fontSize: '1.7em',
    float: 'left',
    marginRight: '.5em'
  }
}));

interface Props {
  store: AppModel.Type;
}

export default observer(function UserStats(props: Props) {
  const { store } = props;
  const classes = useStyles({});

  const numDebates = store.auth.user ? store.auth.user.numDebates : 0;
  const m = 20;
  const xpPerLevel = 3 * m; // 60
  const startingXP = 0;
  const xpTotal = numDebates * m + startingXP;
  const xp = xpTotal % xpPerLevel;
  const level = Math.floor(xpTotal / xpPerLevel) + 1;
  const nextLevel = xpPerLevel;

  // (xpPerLevel*.15) is visual starting point for progress meter
  const normalise = value =>
    xpPerLevel * 0.15 + (value * 100) / (xpPerLevel * 0.85);

  let title = 'Beginner Apprentice';
  if (level > 3) title = 'Traveling Journeyperson';
  if (level > 6) title = 'Experienced Rhetorician';
  if (level > 12) title = 'Most Honorable Host';

  return (
    <div className={classes.root}>
      <Grid container justify="space-around" alignItems="center" spacing={16}>
        <Grid item xs={3}>
          <div className={classes.groupItem}>
            <i className={"fas fa-trophy " + classes.icon} />
            <Typography
              variant="h5"
              align="left"
              color="textPrimary"
              className={classes.item}
            >
              lvl {level}
              <br />
            </Typography>
            <LinearProgress
              color="primary"
              variant="determinate"
              value={normalise(xp)}
              style={{ height: '8px' }}
            />
          </div>
        </Grid>

        <Grid item xs={3}>
          <div className={classes.groupItem}>
            <i
              className={"fas fa-comments " + classes.icon2}
            />
            <Typography
              variant="h5"
              align="center"
              color="textPrimary"
              gutterBottom
              className={classes.item}
            >
              {numDebates} chats
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
});

/*
{xp}/{nextLevel}
        <Grid item xs={3} className={classes.item}>
          <div className={classes.groupItem}>
            <i className="fas fa-star" style={{color:'#aee2ea', fontSize: '1.2em'}}></i>
            <Typography
                variant="h5"
                align="center"
                color="textPrimary"
                className={classes.item}
              >
                {xp}/{nextLevel} xp
              </Typography>
              
          </div></Grid>

          <LinearProgress
                  color="primary"
                  variant="determinate"
                  value={normalise(xp)}
                  style={{height: '6px'}}
              />
          */
