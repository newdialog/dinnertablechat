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
// import bannerImg from '../../public/assets/banner2.jpg'
// const bannerImg = require('../assets/banner2.jpg')

const styles = (theme: any) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridGap: `${theme.spacing.unit * 3}px`
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
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '800px',
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
        <Grid container spacing={24}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom align="center">
              Have a polite talk with your opposite
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Fade bottom>
              <Paper className={classes.paper}>
                In today’s polarizing environment, the news and social media only create isolating bubbles and benefit
                from instilling fear and singular narratives. Dinnertable.chat is a community that uses live
                conversational experiences to allow people to come together to express their viewpoints and feelings,
                under the guidance of a moderator who will help keep the conversation flowing. Instead of fighting, we
                can enjoy the activity of debating and learning from each other.
              </Paper>
            </Fade>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>xs=3</Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper className={classes.paper}>xs=8</Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>xs=4</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>xs=12</Paper>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
        <Typography variant="display1" gutterBottom>
          Material-UI
        </Typography>
        <Typography variant="subheading" gutterBottom>
          example project
        </Typography>
        <Button variant="contained" color="secondary" onClick={this.handleClick}>
          Super Secret Password
        </Button>
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
