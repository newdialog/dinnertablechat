import * as React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import HOC from '../HOC';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {Helmet} from "react-helmet";
import DailyTimer from './DailyTimer';
import * as Times from '../../services/TimeService';
import * as AppModel from '../../models/AppModel';
import Tooltip from './Tooltip';
import DebateHistory from './DebateHistory';
import Footer from '../home/Footer';
import {inject} from 'mobx-react';

const styles = (theme: Theme) =>
  createStyles({
    container: {
    },
    backgroundImg: {
      display: 'block',
      margin: 'auto',
      //maxWidth: '900px',
    },
    divider: {
      margin: `${theme.spacing.unit * 4}px 0`
    },
    largeIcon: {
      width: 80,
      height: 60
    },
  });
const debateOpen = Times.isDuringDebate();
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}
interface State {}

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {  };
  }

  public render() {
    const { classes, store } = this.props;

    return (
      <React.Fragment>
        <Helmet title="Dinnertable.chat Press">
          <meta name="og:url" content="https://dinnertable.chat/home" />
          <meta name="og:title" content="Dinnertable.chat Home" />
        </Helmet>
        <div className={classes.container}>
          <div className={classes.backgroundImg}>
            <img src="imgs/press/01-scene1.png" width="100%" />
          </div>
          <div className={classes.divider} />
          
          <div
            style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}
          >
            <Grid
              container
              spacing={0}
              justify="space-around"
              alignItems="center"
            >
              
              {(debateOpen || !store.isLive()) && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ padding: '1em' }}
                    onClick={() => store.router.push('/quickmatch')}
                  >
                    <Typography
                        variant="h4"
                        align="center"
                        color="textSecondary"
                    >
                        QuickMatch
                    </Typography>
                  </Button>
                </Grid>
              )}

              {!debateOpen && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => store.router.push('/')}
                  >
                    Dinner is finished.
                    <br /> come back next time!
                  </Button>
                </Grid>
              )}
            </Grid>
            <div className={classes.divider} />
            <DailyTimer />
            <Tooltip />
          </div>
          <div className={classes.divider} />
          <DebateHistory />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}
export default inject('store')(HOC(Index, styles));
