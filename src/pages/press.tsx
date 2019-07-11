import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../components/home/Footer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
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
    padding: theme.spacing(1.5),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
  },
  paper2: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
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
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
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
    margin: `${theme.spacing(4)}px 0`
  },
  largeIcon: {
    width: 80,
    height: 60
  }
}));
interface Props {
}

export default function MediaKit(props: Props) {
  const classes = useStyles({});

  const imgs = [
    './logos/dinnertable.gif',
    './logos/dtclogo.png',
    './logos/dtclogo3-1.png',
    './logos/dtclogo3.png'
  ];
  // const { classes } = props;
  // const { open } = this.state;
  return (
    <React.Fragment>
      <Helmet title="Dinnertable.chat Press">
        <meta name="og:url" content="https://dinnertable.chat/press" />
        <meta name="og:title" content="Dinnertable.chat Press" />
      </Helmet>
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
          <img src="imgs/press/01-scene1.png" width={600} alt="screenshot-1" />
        </div>
        <div className={classes.divider} />
        <Typography gutterBottom={true} variant="h5" align={'left'}>
          Our Story
        </Typography>
        <Typography gutterBottom={true}>
          We all have our own way of looking at the world. Sharing our thoughts
          and discoveries is more fun when we respectfully challenge each other.
          Dinnertable.chat was created to start meaningful conversations and
          debate. This isn’t the comments section. It’s a real conversation
          between two people playfully cast as characters at a virtual dinner
          party.
          <br />
          <br />
          Thank you for sharing. Help us in our shared mission of empowing
          citizens to become more informed through exploring the contriversial
          topics that are most important to people today. If you have additional
          publication media kit needs, please{' '}
          <a
            href="mailto:press@dinnertable.chat"
            onClick={window.trackOutboundLinkClick(
              'mailto:press@dinnertable.chat'
            )}
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
        <Grid container spacing={2}>
          <Grid container justify="center" spacing={2}>
            {imgs.map((value, index) => (
              <Grid key={value} item>
                <Paper className={classes.paper2}>
                  <img
                    src={value}
                    className={classes.paperimg}
                    alt={'dtc-design' + index}
                  />
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
            onClick={window.trackOutboundLinkClick(
              'mailto:team@dinnertable.chat'
            )}
          >
            team@dinnertable.chat
          </a>
          <br />
          Press inquiries{' '}
          <a
            href="mailto:press@dinnertable.chat"
            onClick={window.trackOutboundLinkClick(
              'mailto:press@dinnertable.chat'
            )}
          >
            press@dinnertable.chat
          </a>
        </Typography>
      </div>
      <Footer />
    </React.Fragment>
  );
}
