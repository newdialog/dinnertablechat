import * as React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import HOC from '../HOC';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    container: {
      marginTop: '100px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '800px',
      minWidth: '300px',
      padding: '0 14px 0 14px'
    },
    paper: {
      padding: theme.spacing.unit * 1.5,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing.unit
    },
    paper2: {
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing.unit,
      height: '240px',
      width: '240px',
      textAlign: 'center',
      backgroundColor: '#e2dfd0',
      verticalAlign: 'middle !important',
      display: 'block'
    },
    helper: {
      display: 'relative',
      height: '100%',
      verticalAlign: 'middle'
    },
    paperimg: {
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)',
      margin: 'auto',
      verticalAlign: 'middle',
      padding: theme.spacing.unit,
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing.unit,
      maxWidth: '200px'
    },
    centered: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '800px',
      minWidth: '300px',
      alignContent: 'centered',
      textAlign: 'center'
    },
    divider: {
      margin: `${theme.spacing.unit * 4}px 0`
    },
    banner: {
      display: 'flex',
      objectFit: 'cover',
      width: '100%',
      height: 'calc(100vh - 0px)',
      backgroundImage: 'url("./banner.jpg")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center 0',
      color: 'white',
      // justifyContent: 'center',
      justifyContent: 'flex-end',
      flexFlow: 'column nowrap'
    },
    bannerText: {
      fontFamily: 'Open Sans',
      color: 'white',
      bottom: '20%',
      marginBottom: '15vh',
      backgroundColor: '#00000044',
      fontWeight: 'bold'
    },
    logoanim: {
      width: '100vw',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex'
    },
    largeIcon: {
      width: 80,
      height: 60
    },
    body: {
      /*
      width: '100%',
      backgroundImage: 'url("./imgs/07-newsletter.png")', // DTC-scene3.png
      backgroundSize: 'cover',
      // backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom 0px left'
      */
    },
    demo: {}
  });

import * as AppModel from '../../models/AppModel';
import Footer from '../home/Footer';
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}
interface State {
  open: boolean;
}

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  public render() {
    const imgs = [
      './logos/dinnertable.gif',
      './logos/dtclogo.png',
      './logos/dtclogo3-1.png',
      './logos/dtclogo3.png'
    ];
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        <div className={classes.container}>
          <Typography
            gutterBottom={true}
            variant="h3"
            style={{ color: 'black', fontSize: '2.5em' }}
            align={'center'}
          >
            Press Kit
          </Typography>
          <div className={classes.centered}>
            <img src="imgs/press/01-scene1.png" width={600} />
          </div>
          <div className={classes.divider} />
          <Typography gutterBottom={true} variant="h5" align={'left'}>
            Our Story
          </Typography>
          <Typography gutterBottom={true}>
            We all have our own way of looking at the world. Sharing our
            thoughts and discoveries is more fun when we respectfully challenge
            each other. Dinnertable.chat was created to start meaningful
            conversations and debate. This isn’t the comments section. It’s a
            real conversation between two people playfully cast as characters at
            a virtual dinner party.
            <br />
            <br />
            Thank you for sharing. Help us in our shared mission of empowing
            citizens to become more informed through exploring the contriversial
            topics that are most important to people today. If you have
            additional publication media kit needs, please{' '}
            <a
              href="mailto:press@dinnertable.chat"
              onClick={trackOutboundLinkClick('mailto:press@dinnertable.chat')}
            >
              contact us
            </a>
            .
          </Typography>

          <div className={classes.divider} />
          <Typography gutterBottom={true} variant="h5">
            Graphics and Designs
          </Typography>
          <Typography gutterBottom={true}>
            Use of the below illustrations are recommended for publications:
          </Typography>

          <br />
          <Grid container spacing={16}>
            <Grid
              container
              className={classes.demo}
              justify="center"
              spacing={16}
            >
              {imgs.map(value => (
                <Grid key={value} item>
                  <Paper className={classes.paper2}>
                    <img src={value} className={classes.paperimg} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <div className={classes.divider} />
          <Typography gutterBottom={true} variant="h5">
            Publications
          </Typography>
          <Paper className={classes.paper}>
            <Typography gutterBottom={true}>
              <i>October, 2018</i>
              <br />
              [Overview] How Sparketing Debate Could Reignite Our Democracy (
              <a href="https://medium.com/dinnertablechat/how-sparking-debate-could-reignite-our-democracy-72b41a80f54">
                Medium
              </a>
              )
            </Typography>
          </Paper>

          <Paper className={classes.paper}>
            <Typography gutterBottom={true}>
              <i>November, 2018</i>
              <br />
              [Our Story] Who’s Cooking Dinner? (
              <a href="https://medium.com/dinnertablechat/whos-cooking-dinner-691217e9e714">
                Medium
              </a>
              )
            </Typography>
          </Paper>

          <div className={classes.divider} />
          <Typography gutterBottom={true} align={'center'}>
            General business inqueries{' '}
            <a
              href="mailto:team@dinnertable.chat"
              onClick={trackOutboundLinkClick('mailto:team@dinnertable.chat')}
            >
              team@dinnertable.chat
            </a>
            <br />
            Press inquiries{' '}
            <a
              href="mailto:press@dinnertable.chat"
              onClick={trackOutboundLinkClick('mailto:press@dinnertable.chat')}
            >
              press@dinnertable.chat
            </a>
          </Typography>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}
export default HOC(Index, styles);
