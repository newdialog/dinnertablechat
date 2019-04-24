import React, {useContext} from 'react';
import { Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/styles';
import * as AppModel from '../../models/AppModel';
import Footer from '../home/Footer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  },
  container: {
    marginTop: '52px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '800px',
    minWidth: '300px',
    padding: '0 14px 0 14px'
  },
  divider: {
    margin: `${theme.spacing.unit * 4}px 0`
  },
  presentationFrame: {
    border: '0'
  }
}));

interface Props {
  // store: AppModel.Type;
}

export default function EducationHome(props: Props) {
  const classes = useStyles({});
  const store = useContext(AppModel.Context)!;

  const goHome = (e) => {
    e.preventDefault();
    store.router.push('/');
  }

  return (
    <React.Fragment>
      <Helmet title="Dinnertable.chat Campus">
        <meta itemProp="name" content="Dinnertable.chat Campus" />
        <meta name="og:url" content="https://dinnertable.chat/campus" />
        <meta name="og:title" content="Dinnertable.chat Campus" />
        <meta
          name="title"
          property="og:title"
          content="Dinnertable.chat Campus"
        />
      </Helmet>
      <div className={classes.container}>
        <iframe
          src="https://docs.google.com/presentation/d/e/2PACX-1vQS5EJR-y1PUvqyVc9ZGZj3thmQ_few0oLxJoGHnZ1fdVNc9wCfLkCzk3WSejSU-u8sgU_0RxxF1BgF/embed?start=false&loop=false&delayms=8000"
          width="100%"
          height="520"
          allowFullScreen={true}
          className={classes.presentationFrame}
          title="dtc presenation"
        />
        <div className={classes.divider} />
        <Typography gutterBottom={true} variant="h5" align={'left'}>
          College Program for Students and Professors
        </Typography>
        <Typography gutterBottom={true}>
          Dinnertable.chat is a social platform helps colleges provide an
          evironment that empowers students to productively practice in sharing
          of political perspectices using live conversations. DTC allows
          students to better understand their own thoughts by listening to and
          being challenged by views that are outside their own. We're growing
          quickly and plan to be rolling out several new classroom and
          club-friendly features soon!
          <br />
          <br />
          For inquires or help using DTC in the classroom, please{' '}
          <a
            href="mailto:edu@dinnertable.chat"
            onClick={window.trackOutboundLinkClick('mailto:edu@dinnertable.chat')}
          >
            contact us at edu@dinnertable.chat
          </a>
          .
        </Typography>
        <Typography gutterBottom={true}>
        <br/><a href="/about" onClick={goHome}>⬅ Return to homepage</a>
        </Typography>
      </div>
      <Footer />
    </React.Fragment>
  );
}

/*
<Typography
            gutterBottom={true}
            variant="h3"
            style={{ color: 'black', fontSize: '2.5em' }}
            align={'center'}
          >
            Colleges Welcome
          </Typography>
          */
