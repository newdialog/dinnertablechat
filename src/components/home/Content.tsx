// tslint:disable-next-line:max-line-length
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import { translate } from 'react-i18next';

import Lottie from 'react-lottie';
const Fade = require('react-reveal/Fade');

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
      // gridTemplateColumns: 'repeat(12, 1fr)',
      gridGap: `${theme.spacing.unit * 4}px`,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '2em',
        paddingRight: '2em',
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
      gridGap: `${theme.spacing.unit * 4}px`,
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
  autoplay: true,
  path: 'assets/logo.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const talkingOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/splash-talking.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const topicsOptions = {
  loop: true,
  autoplay: true,
  path: 'assets/topics.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props extends WithStyles<typeof styles> {
  t:any
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

  private _handleWaypointEnter = () => {
    if (!this.logoRef.current) return;
    // console.log('this.logoRef.current', this.logoRef.current)
    this.logoRef.current.stop();
    this.logoRef.current.play();
  }

  private _handleWaypointLeave = () => {
    if (!this.logoRef.current) return;
    // console.log('this.logoRef.current', this.logoRef.current)
    // this.logoRef.current.stop();
  }

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
                onEnter={this._handleWaypointEnter}
                onLeave={this._handleWaypointLeave}
              />
              <Lottie options={logoOptions} ref={this.logoRef} />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              {t('home-intro')}
              </Typography>
            </Fade>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.containerRev}>
          <Grid item xs={12}>
            <div className={classes.divider} />

            <Typography variant="body1" gutterBottom align="center">
              {t('home-signup')}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="title" gutterBottom align="left">
              <div className={classes.divider} />
              {t('home-rules-title')}
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              {t('home-rules')}
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}><img src="./imgs/02-topics.png" className={classes.paperimg} /></div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="title" gutterBottom align="left">
              <div className={classes.divider} />
              {t('home-tiers-title')}
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              {t('home-tiers')}
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}><img src="./imgs/02-topics.png" className={classes.paperimg} /></div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="title" gutterBottom align="left">
              {t('home-char-title')}
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              {t('home-char')}
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
          <div className={classes.paper}><img src="./imgs/02-topics.png" className={classes.paperimg} /></div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="title" gutterBottom align="left">
            {t('home-topic-title')}
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              {t('home-topic')}
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
                <Lottie options={topicsOptions} />
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="title" gutterBottom align="left">
              {t('home-overview-title')}
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
                {t('home-overview')}
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <Lottie options={talkingOptions} />
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
