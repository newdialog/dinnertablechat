// tslint:disable-next-line:max-line-length
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import Lottie from 'react-lottie';
const Fade = require('react-reveal/Fade');
// import * as logoData from '../assets/logo.json';
const logoData = require('../../assets/logo.json');
const mooseData = require('../../assets/moose.json');
// import bannerImg from '../../public/assets/banner2.jpg'
// const bannerImg = require('../assets/banner2.jpg')

const styles = (theme: any) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    container: {
      marginTop: '30px',
      // display: 'grid',
      // gridTemplateColumns: 'repeat(12, 1fr)',
      // gridGap: `${theme.spacing.unit * 3}px`
      // gridAutoFlow: 'column',
      // gridAutoColumns: '200px'
    },
    paper: {
      padding: theme.spacing.unit,
      textAlign: 'center',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing.unit
    },
    centered: {
      paddingLeft: '2em',
      paddingRight: '2em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    },
    divider: {
      margin: `${theme.spacing.unit * 2}px 0`
    }
  });

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: logoData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const mooseOptions = {
  loop: false,
  autoplay: true,
  animationData: mooseData,
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
            <div className={classes.paper}><Lottie options={defaultOptions} /></div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
                In today’s polarizing environment, the news and social media only create isolating bubbles and benefit from instilling fear and singular narratives. Dinnertable.chat is a community that uses live
                conversational experiences to allow people to come together to express their viewpoints and feelings, under the guidance of a moderator who will help keep the conversation flowing. Instead of fighting, we
                can enjoy the activity of debating and learning from each other.
              </Typography>
            </Fade>
          </Grid>
          
          <Grid item xs={12} md={6}>
           <Typography variant="title" gutterBottom align="left">
              Enjoy talking about what’s truly meaningful
           </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              We all have our own way of looking at the world and desire to share our thoughts and discoveries. DTC provides a virtual experience that allows you to playfully talk with others that hold different 
              views. Perhaps you can share a perspective that is overlooked or be persuaded of a compelling viewpoint. 
              </Typography>
            </Fade>
          </Grid>
          
          <Grid item xs={12} md={6}>
          <div className={classes.paper}><Lottie options={mooseOptions} /></div>
          </Grid>
          <Grid item xs={12} md={6}>
           <Typography variant="title" gutterBottom align="left">
            Select your topic
           </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              Get started by selecting a desired topic. Sets of topics are picked by forecasted trends in the news and online discussions, as well as user voting. After picking the topic, then you choose on how 
              you roughly feel about it. Example: do you support less gun regulations or more? This will allow the system to match you with your opposite.
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>

          <Grid item xs={12} md={6}>
           <Typography variant="title" gutterBottom align="left">
            What to bring to the table
           </Typography>
            <Fade bottom>
              <Typography variant="body1" gutterBottom align="left">
              Like any good dinner guest, you can bring your own food and drink. You effectively decide how much to tip the moderator, and you’ll be matched with a debate partner that selected the same amount. The higher the tip, the more likely you’ll be debating with someone who is as much of a upstanding individual as you are.
              </Typography>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>Curious to learn more and be notified when we launch, sign up below!</Paper>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
      </div>
    );
  }

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
