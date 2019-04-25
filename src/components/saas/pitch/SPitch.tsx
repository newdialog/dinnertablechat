import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../../home/Footer';

const useStyles = makeStyles((theme: Theme) => ({
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
  largeIcon: {
    width: 80,
    height: 60
  }
}));
interface Props {
  // extends WithStyles<typeof styles> {
  // store: AppModel.Type;
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
          Personal Discussion Platform
        </Typography>
        <div className={classes.centered}>
          <img src="imgs/press/01-scene1.png" width={600} alt="screenshot-1" />
        </div>
        <div className={classes.divider} />
        <Typography gutterBottom={true} variant="h5" align={'left'}>
          
        </Typography>
        <Typography gutterBottom={true}>
          The Personal Discussion Platform [PDP] is powered by Dinnertable.chat
          to provide a fundamentally improved means
          of empowering your users to effectively discuss select topics or
          content. Better communication allows users to actively engage with
          your content longer (while also attracting new users), and encourages
          readers to think critically about the content in a more organic way
          than the text-based discussion widgets of yesterday. PDP turbocharges
          everyone from universities to publishers, allowing their users to both
          better express themselves and also improve their understanding of the
          subject matter being presented.
          <br />
          <br />
          PDP can integrate into mobile apps and websites to facilitate
          real-time discussions or debates on any selected topic, article, or
          theme. Designed to act as a virtual matchmaker for people with
          differing viewpoints, Dinnertable.chat’s PDP engine connects users
          with someone who holds an appropriately contrasting viewpoint. Matched
          users then each control a fun virtual character who represents their
          respective words and emotions on-screen during the conversation. The
          PDP vision is to provide an accessible tool that helps engage people
          in good faith dialogue for the purpose of finding common ground
          through live conversation. PDP conversations are personal between
          matched individuals and are not recorded, which both improves privacy
          as well as reduces the need for moderation as compared to existing
          public forums and discussion widgets.
          <br />
          <br />
          PDP can be customized and branded for your needs, and is easily
          integrated via a web widget or custom domain. Topics and contexts for
          matchmaking can be configured as needed to reduce echo chambers and
          minimize toxic behavior. The matching process is fully-automatic once
          configured, and you can also choose to match between industry partners
          to have “their users talk to your users” if desired. Integration takes
          roughly 2 weeks.
          <br />
          <br />
          For publishers, PDP allows you to add real-time personable
          conversation to your content. This allows your users to speak directly
          with others about what they think about the content, how it makes them
          feel, and whatever differences of opinion they may have. For
          journalists, PDP allows their readers to speak ‘truth to power’ by
          being able to directly express their ideas and views without drowning
          out others, which is a major issue on social networks like Twitter.
          <br />
          <br />
          For universities, PDP provides professors with a means of allowing
          students to freely exercise ideas through conversation and debate with
          other students, while still keeping student anonymity. However, these
          discussions are fundamentally structured to encourage positivity and
          productivity, as users are prompted to rate how good of a
          conversationalist the other was post-conversation. For larger
          discussions and more challenging ideologies , universities can host
          partnership debate challenges with other schools to increase the
          diversity of ideas and culture.
          <br />
          <br />
          For pricing and availability, please email us below.
        </Typography>

        <div className={classes.divider} />
        <Typography gutterBottom={true} align={'center'}>
          Sales{' '}
          <a
            href="mailto:sales@dinnertable.chat"
            onClick={window.trackOutboundLinkClick(
              'mailto:sales@dinnertable.chat'
            )}
          >
            sales@dinnertable.chat
          </a>
          <br />
          General business inqueries{' '}
          <a
            href="mailto:team@dinnertable.chat"
            onClick={window.trackOutboundLinkClick(
              'mailto:team@dinnertable.chat'
            )}
          >
            team@dinnertable.chat
          </a>
        </Typography>
      </div>
      <Footer />
    </React.Fragment>
  );
}
