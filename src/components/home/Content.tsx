// tslint:disable-next-line:max-line-length
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import Lottie from 'react-lottie';
const Fade = require('react-reveal/Fade');
// import * as logoData from '../assets/logo.json';
const logoData = require('../../assets/logo.json');
const talkingData = require('../../assets/splash-talking.json');

import Waypoint from 'react-waypoint';
// import bannerImg from '../../public/assets/banner2.jpg'
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
        padding: '0'
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
        padding: '0'
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
  animationData: logoData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const talkingOptions = {
  loop: true,
  autoplay: true,
  animationData: talkingData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props extends WithStyles<typeof styles> {}
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
    const { classes } = this.props;
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
                In today’s polarizing environment it can be hard to have thoughtful debates among differing ideologies.
                DTC is a virtual experience that connects you with the “other side” to playfully challenge each other
                under the guidance of a moderator.
              </Typography>
            </Fade>
          </Grid>
        </Grid>
        <Grid container spacing={24} className={classes.containerRev}>
          <Grid item xs={12}>
            <div className={classes.divider} />

            <Typography variant="body1" gutterBottom align="center">
              Curious to learn more and be notified when we launch, sign up below!
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="title" gutterBottom align="left">
              <div className={classes.divider} />
              Basic Rules
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
                DTC is a safe place to share often emotionally fueled discussions. Our community embraces being fully
                honest, passionate, and engaged with new ideas… even if it makes us a little frightened or warm blooded.
                On the other paw, personal attacks, being disrespectful, and otherwise being a jerk is not welcomed.
                There’s a zero tolerance for bad behavior, and the moderator is allowed to end sessions early as well as
                ban intentional bad actors.
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="title" gutterBottom align="left">
              <div className={classes.divider} />
              What to bring to the table
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
                Like any good dinner guest, you can bring your own food and drink. You effectively decide how much to
                tip the moderator, and you’ll be matched with a debate partner that selected the same amount. The higher
                the tip, the more likely you’ll be debating with someone who is as much of a upstanding individual as
                you are.
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="title" gutterBottom align="left">
              Select your character
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
                You will control a virtual character that will talk as you talk, listen to your matched partner, and
                also represents your mood. There’s several characters to choose from that all have their own personality
                and style. Unlock new characters as you perform in more debates.
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="title" gutterBottom align="left">
              Select your topic
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
                Get started by selecting a desired topic. Topics are selected via news trends, online discussions, and
                your vote in DTC polls. After picking the topic, gage your position on this issue. (Do you support more
                or less gun regulations?) Our system will then match you with someone who holds a contrasting viewpoint.
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="title" gutterBottom align="left">
              Enjoy talking about what’s truly meaningful
            </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
                We all have our own way of looking at the world. Sharing our thoughts and discoveries is more fun when
                we respectfully challenge each other. Perhaps you can share a perspective that’s typically overlooked or
                can be persuaded to reframe your opinion.
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

export default withRoot(withStyles(styles)(Index));
