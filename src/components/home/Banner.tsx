import React, { useRef, useState } from 'react';
import { Theme } from '@material-ui/core/styles';

// import Reveal from 'react-reveal/Reveal';

import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import * as AppModel from '../../models/AppModel';
import QueueIcon from '@material-ui/icons/QueuePlayNext';
import BannerTimer from './BannerTimer';
import * as Times from '../../services/TimeService';

import ReactPlayer from 'react-player';

// import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(20)
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing(1)
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
      // zIndex: 2,
      paddingTop: 10,
      marginLeft: 'auto',
      marginRight: 'auto',
      // paddingBottom: '5vh',
      color: '#ffffff88',
      textAlign: 'center',
      // display: 'inline-block',
      // paddingTop: '60px',
      [theme.breakpoints.down('sm')]: {
        
        //  paddingBottom: '80px'
        // paddingBottom: '2px'
      }
    },
    divider: {
      margin: `${theme.spacing(2)}px 0`
    },
    banner: {
      display: 'flex',
      objectFit: 'cover',
      width: '100%',
      // eight: 'calc(100vh - 0px)',
      // backgroundImage: 'url("./imgs/DTC-scene3-bg2.png")', // DTC-scene3.png
      backgroundSize: 'cover',
      // backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center 0',
      color: 'white',
      // justifyContent: 'center',
      justifyContent: 'center',
      flexFlow: 'column wrap',
      // paddingTop: '60px', // header
      backgroundColor: '#90887a',
      minHeight: '665px',
      [theme.breakpoints.down('sm')]: {
        height: 'calc(100vh - 32px)'
        //  minHeight: '710px',
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
      height: '1em', // 13vh',
      [theme.breakpoints.down('sm')]: {
        // height: '.5em' // '4vh'
      }
    },
    logoanim: {
      width: '100vw',
      maxWidth: '620px',
      // minHeight: '300px',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex'
    },
    bannerAnim: {
      zIndex: 0,
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      objectFit: 'cover',
      pointerEvents: 'none',
      backgroundImage: 'auto', // 'url("./imgs/bannerbg.jpg")'
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
        backgroundImage: 'auto'
      }
    },
    bannerAnimOverlay: {
      zIndex: 1,
      transform: 'translateZ(0)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      background: 'rgba(0, 0, 0, 0.35)',
      backgroundBlendMode: 'multiply',
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },
    timer: {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },
    largeIcon: {
      width: 80,
      height: 60
    },
    banneryt: {
      height: 'calc(50vw - 32px)',
      width: 'calc(100vw - 32px)',
      // maxWidth: '90vw',
      // maxHeight: '80vh',
      maxWidth: '560px',
      maxHeight: '315px',
      [theme.breakpoints.down('xs')]: {}
    },
    video: {
      // maxWidth:'99vw',
      // maxHeight: '50vh',
      // display:'inline-table',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      [theme.breakpoints.up('md')]: {
        // display:'inline-table',
        // maxWidth: '500px',
      },
      [theme.breakpoints.down('xs')]: {
        
      }
    },
    videoWrapper: {
      maxHeight: '50vh',
      maxWidth: '720px',
      margin: 'auto',
      position: 'relative',
      width: '100%',
      paddingTop: '51%',
      marginTop: '40px'
    }
  }),
  { name: 'Banner' }
);

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
  store: AppModel.Type;
}
export default observer(function HomeBanner(props: Props) {
  const { store } = props;
  const classes = useStyles({});
  // const { t } = useTranslation();
  const [isLoggingIn, setLogin] = useState(false);

  // const { store } = props;
  const auth = store.auth.isAuthenticated();

  const isOpen = Times.isDuringDebate(store.isLive); // store.dailyOpen; // !isLive ||  Times.isDuringDebate();
  // console.log('isOpen', isOpen);

  return (
    <>
      <div className={classes.banner}>
        <div className={classes.centeredDown}>
          {yt(classes)}

          <Typography
            variant="h1"
            align="center"
            style={{ textShadow: '2px 2px #777755', color: '#ffffff' }}
          >
           
              {
                // t('home-banner-title1')
              }
              Isn't it time we talk?
            
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
            
              {true || !isOpen ? (
                <>get matched with people with different views</>
              ) : (
                <span style={{ fontSize: '110%' }}>
                  matchmaking event is <b>online</b> and ready to join
                </span>
              )
              // t('home-banner-title2')
              }
            
          </Typography>
          {auth && !store.isGuest() && (
            <React.Fragment>
              <Button
                style={{ marginTop: '1vh', lineHeight: '2.6em' }}
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => store.router.push('/home')}
              >
                {store.auth.user!.name.split(' ')[0] + '\'s Home'}
                <QueueIcon style={{ marginLeft: '8px' }} />
              </Button>
            </React.Fragment>
          )}
          {auth && store.isGuest() && (
            <>
              <Button
                style={{ marginTop: '1vh', lineHeight: '2.6em' }}
                onClick={() => store.router.push('/home')}
                disabled={isLoggingIn}
                variant="contained"
                color="default"
                size="large"
              >
                Guest Access
              </Button>
            </>
          )}
          {(!auth || store.isGuest()) && (
            <Button
              style={{
                marginTop: '1vh',
                marginLeft: '12px',
                lineHeight: '2.6em'
              }}
              onClick={() =>
                store.login('/home')
              }
              variant="contained"
              color="secondary"
              size="large"
            >
              Signup/Login
              <QueueIcon style={{ marginLeft: '8px' }} />
            </Button>
          )}

          <div className={classes.bannerTextDivider} />
          <div className={classes.timer}><BannerTimer store={store} /></div>

          <a href="#intro" className={classes.xsHide}>
            <ArrowDown style={{ color: '#ffffff' }} width="1em" />
          </a>
        </div>
      </div>
    </>
  )
});

function yt(classes:any) {
  return <div className={classes.videoWrapper}><ReactPlayer 
    // width="480px"
    className={classes.video}
    url={'https://www.youtube.com/embed/vzHKpUBAm48?rel=0'}
    width={'100%'}
    height={'100%'}
    config={{ youtube:{ playerVars: { showinfo: 1 } }}} 
    controls={true} 
    light="/imgs/hqdefault.jpg" 
    playing={true}/></div>;

  /* return (
    <iframe
      className={classes.banneryt}
      src="//www.youtube.com/embed/vzHKpUBAm48?rel=0"
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ); */
}
/* 
<Lottie
            options={bgOptions}
            ref={bannerRef}
            isClickToPauseDisabled={true}
          />  
<div className={classes.bannerAnimOverlay} />

<div className={classes.divider} />
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
