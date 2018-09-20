// tslint:disable-next-line:max-line-length
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import { translate } from 'react-i18next';

import Lottie from 'react-lottie';
import Reveal from 'react-reveal/Reveal';

import Waypoint from 'react-waypoint';
// const bannerImg = require('../assets/banner2.jpg')

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    container: {
      marginTop: '30px',
      paddingLeft: '3em',
      paddingRight: '3em',
      // display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      // gridGap: `${theme.spacing.unit * 4}px`,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '2em',
        paddingRight: '2em'
      }

      // gridAutoFlow: 'column',
      // gridAutoColumns: '200px'
    },
    containerRev: {
      marginTop: '0px',
      paddingLeft: '3em',
      paddingRight: '3em',
      // display: 'grid',
      // gridTemplateColumns: 'repeat(12, 1fr)',
      // gridGap: `${theme.spacing.unit * 4}px`,
      [theme.breakpoints.down('sm')]: {
        // padding: '0'
      },
      flexWrap: 'wrap-reverse'
    },
    paper: {
      padding: theme.spacing.unit,
      textAlign: 'center',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing.unit,
      flex: '1 1 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },
    paperimg: {
      height: 'auto',
      width: 'auto',
      maxWidth: '100%',
      margin: 'auto',
      display: 'block',
      objectFit: 'contain',
      pointerEvents: 'none',
      [theme.breakpoints.down('sm')]: {
        paddingTop: `${theme.spacing.unit * 5}px`,
        maxWidth: '80%'
      },
      [theme.breakpoints.down('xs')]: {
        maxWidth: '100%'
      }
    },
    centered: {
      paddingTop: '0',
      paddingLeft: '1em',
      paddingRight: '1em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    },
    divider: {
      margin: `${theme.spacing.unit * 6}px 0`,
      [theme.breakpoints.down('sm')]: {
        margin: `${theme.spacing.unit * 1}px 0`
      }
    }
  });

const logoOptions = {
  loop: false,
  autoplay: false,
  path: 'assets/logo.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const talkingOptions = {
  loop: true,
  autoplay: false,
  path: 'assets/splash-talking.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const topicsOptions = {
  loop: true,
  autoplay: false,
  path: 'assets/topics.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props extends WithStyles<typeof styles> {
  t: any;
}
interface State {
  open: boolean;
}

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  private logoRef = React.createRef<Lottie | any>();
  private topicsRef = React.createRef<Lottie | any>();
  private talkingRef = React.createRef<Lottie | any>();
  private handlers: { [k: string]: any } = {};

  private _handleLogoWaypointEnter = () => {
    if (!this.logoRef.current) return;
    // console.log('this.logoRef.current', this.logoRef.current)
    this.logoRef.current.stop();
    this.logoRef.current.play();
  };

  private _handleLogoWaypointLeave = () => {
    if (!this.logoRef.current) return;
    // console.log('this.logoRef.current', this.logoRef.current)
    // this.logoRef.current.stop();
  };

  private memoizedHandler = (id: any, onLeave: boolean = false) => {
    const handlers = this.handlers;
    const _id = !onLeave ? id : id + 'leave';
    if (handlers[_id]) {
      return handlers[_id];
    }
    if (!onLeave)
      return (handlers[_id] = () => {
        // console.log('playing', _id);
        if (this[id].current) this[id].current.play();
      });
    else
      return (handlers[_id] = () => {
        // console.log('stopping', _id);
        if (this[id].current) this[id].current.stop();
      });
  };

  public render() {
    const { classes, t } = this.props;
    const { open } = this.state;
    // <img className={classes.banner} src="./banner2.jpg" />
    // s
    /* 
    <Typography variant="display1" gutterBottom align="center" className={classes.bannerText}>
            Have a polite talk with your opposite
          </Typography>
    */
    return (
      <div className={classes.centered}>
        <Grid container spacing={24} className={classes.container}>
          <Grid item xs={12} md={6}>
            <div className="paperimg">
              <Waypoint
                topOffset="-10%"
                bottomOffset="0"
                onEnter={this._handleLogoWaypointEnter}
                onLeave={this._handleLogoWaypointLeave}
              />
              <Lottie
                options={logoOptions}
                ref={this.logoRef}
                isClickToPauseDisabled={true}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom align="left">
              {t('home-intro')}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.containerRev}>

          <Grid item xs={12} md={6}>
            <Reveal effect="fadeInUp">
              <Typography variant="title" gutterBottom align="left">
                <div className={classes.divider} />
                {t('home-rules-title')}
              </Typography>

              <Typography variant="body1" gutterBottom align="left">
                {t('home-rules')}
              </Typography>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <img src="./imgs/02-topics.png" className={classes.paperimg} />
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Reveal effect="fadeInUp">
              <Typography variant="title" gutterBottom align="left">
                <div className={classes.divider} />
                {t('home-tiers-title')}
              </Typography>

              <Typography variant="body1" gutterBottom align="left">
                {t('home-tiers')}
              </Typography>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <img src="./imgs/02-topics.png" className={classes.paperimg} />
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Reveal effect="fadeInUp">
              <Typography variant="title" gutterBottom align="left">
                {t('home-char-title')}
              </Typography>

              <Typography variant="body1" gutterBottom align="left">
                {t('home-char')}
              </Typography>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <img src="./imgs/02-topics.png" className={classes.paperimg} />
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Reveal effect="fadeInUp">
              <Typography variant="title" gutterBottom align="left">
                {t('home-topic-title')}
              </Typography>

              <Typography variant="body1" gutterBottom align="left">
                {t('home-topic')}
              </Typography>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <Waypoint
                topOffset="-10%"
                bottomOffset="0"
                onEnter={this.memoizedHandler('topicsRef')}
                onLeave={this.memoizedHandler('topicsRef', true)}
              >
                <div>
                  <Lottie
                    options={topicsOptions}
                    ref={this.topicsRef}
                    isClickToPauseDisabled={true}
                  />
                </div>
              </Waypoint>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="title" gutterBottom align="left">
              {t('home-overview-title')}
            </Typography>

            <Typography variant="body1" gutterBottom align="left">
              {t('home-overview')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <Waypoint
                topOffset="-10%"
                bottomOffset="0"
                onEnter={this.memoizedHandler('talkingRef')}
                onLeave={this.memoizedHandler('talkingRef', true)}
              >
                <div>
                  <Lottie
                    options={talkingOptions}
                    ref={this.talkingRef}
                    isClickToPauseDisabled={true}
                  />
                </div>
              </Waypoint>
            </div>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
      </div>
    );
  }
  // <img src="./section2.png" className={classes.paperimg} />
  private handleClose = () => {
    this.setState({
      open: false
    });
  };

  private handleClick = () => {
    this.setState({
      open: true
    });
  };
}

export default translate()(withRoot(withStyles(styles)(Index)));
