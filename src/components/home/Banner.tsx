import React, { useRef, useState } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

import Lottie from 'react-lottie';
import Reveal from 'react-reveal/Reveal';

import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { Waypoint } from 'react-waypoint';
import * as AppModel from '../../models/AppModel';
import QueueIcon from '@material-ui/icons/QueuePlayNext';
import BannerTimer from './BannerTimer';
import * as Times from '../../services/TimeService';
// const bgData = require('../../assets/background.json');
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
  xsHide: {
    [theme.breakpoints.down('xs')]: {
      // visibility:'hidden' // breaks portrait
    }
  },
  centeredDown: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: '5vh',
    color: '#ffffff88',
    textAlign: 'center',
    display: 'inline-block',
    [theme.breakpoints.down('sm')]: {
      //  paddingBottom: '80px'
      paddingBottom: '2px'
    }
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  banner: {
    display: 'flex',
    objectFit: 'cover',
    width: '100%',
    height: 'calc(100vh - 14px)',
    // backgroundImage: 'url("./imgs/DTC-scene3-bg2.png")', // DTC-scene3.png
    backgroundSize: 'cover',
    // backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center 0',
    color: 'white',
    // justifyContent: 'center',
    justifyContent: 'flex-end',
    flexFlow: 'column nowrap',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 32px)'
    }
  },
  bannerTextDivider: {
    // fontFamily: 'Open Sans',
    // color: 'white',
    // position: 'absolute',
    // bottom: '20%',
    // marginBottom: '15vh',
    // backgroundColor: '#00000044',
    // fontWeight: 'bold'
    // left: ''
    height: '13vh',
    [theme.breakpoints.down('sm')]: {
      height: '4vh'
    }
  },
  logoanim: {
    width: '100vw',
    maxWidth: '600px',
    // minHeight: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex'
  },
  bannerAnim: {
    zIndex: -1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    objectFit: 'cover',
    pointerEvents: 'none'
  },
  bannerAnimOverlay: {
    zIndex: -1,
    transform: 'translateZ(0)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    background: 'rgba(0, 0, 0, 0.35)',
    backgroundBlendMode: 'multiply'
  },
  largeIcon: {
    width: 80,
    height: 60
  }
}), {withTheme: true, name:'Banner'});

const bgOptions = {
  loop: true,
  autoplay: false,
  renderer: 'svg',
  path: 'assets/background.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props {
  store: AppModel.Type
}
export default function HomeBanner(props:Props) {
  const {store} = props;
  const classes = useStyles({});
  const { t } = useTranslation();
  const bannerRef = useRef<Lottie | any>();

  const _handleWaypointEnter = () => {
    if (!bannerRef.current) return;
    bannerRef.current!.play();
    // console.log('play');
  };

  const _handleWaypointLeave = () => {
    if (!bannerRef.current) return;
    bannerRef.current!.stop();
    // console.log('stop');
  };

  // const { store } = props;
  const auth = store.auth.isAuthenticated();
  const isLive = store.isLive();

  const isOpen = Times.isDuringDebate(); // store.dailyOpen; // !isLive ||  Times.isDuringDebate();
  // console.log('isOpen', isOpen);

  return (
    <React.Fragment>
      <Waypoint
        topOffset="-60%"
        bottomOffset="0"
        onEnter={_handleWaypointEnter}
        onLeave={_handleWaypointLeave}
      />
      <div className={classes.banner}>
        <div className={classes.bannerAnim}>
          <Lottie
            options={bgOptions}
            ref={bannerRef}
            isClickToPauseDisabled={true}
          />
        </div>
        <div className={classes.bannerAnimOverlay} />
        <div className={classes.centeredDown}>
          <Typography
            variant="h1"
            align="center"
            style={{ textShadow: '2px 2px #777755', color: '#ffffff' }}
          >
            <Reveal effect="fadeIn" duration={3500}>
              {t('home-banner-title1')}
            </Reveal>
          </Typography>
          <Typography
            className={classes.xsHide}
            variant="h4"
            align="center"
            style={{
              fontSize: '1.7em',
              color: '#ffffff',
              padding: '0 12px 0 12px'
            }}
          >
            <Reveal effect="fadeIn" duration={5500}>
              {true || !isOpen ? (
                <>get matched for a live chat to find common ground</>
              ) : (
                <span style={{ fontSize: '110%' }}>
                  matchmaking event is <b>online</b> and ready to join
                </span>
              )
              // t('home-banner-title2')
              }
            </Reveal>
          </Typography>
          {auth && (
            <React.Fragment>
              <Button
                style={{ marginTop: '1vh' }}
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => store.router.push('/home')}
              >
                {store.auth.user!.name.split(' ')[0]}'s Home
                <QueueIcon style={{ marginLeft: '8px' }} />
              </Button>
            </React.Fragment>
          )}
          {!auth && (
            <>
              <Button
                style={{ marginTop: '1vh' }}
                onClick={() => store.auth.doGuestLogin()}
                variant="contained"
                color="default"
                size="large"
              >
                Guest Pass
              </Button>
            </>
          )}
          {(!auth || store.isGuest()) && (
            <Button
              style={{ marginTop: '1vh', marginLeft: '12px' }}
              onClick={() => store.login()}
              variant="contained"
              color="secondary"
              size="large"
            >
              {store.isGuest() ? 'Signout Guest' : 'Signup/Login'}
              <QueueIcon style={{ marginLeft: '8px' }} />
            </Button>
          )}

          <div className={classes.bannerTextDivider} />
          <BannerTimer store={store} />

          <a href="#intro" className={classes.xsHide}>
            <ArrowDown style={{ color: '#ffffff' }} width="1em" />
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}

/* <div className={classes.divider} />
<Button
              href="#intro"
              variant="contained"
              color="primary"
              size="large"
            >
              Learn More
            </Button>
            <Button
              style={{marginLeft:'2em'}}
              href="#subscribe"
              variant="contained"
              color="primary"
              size="large"
            >
              Updates
            </Button>
*/
