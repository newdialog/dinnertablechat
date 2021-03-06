// tslint:disable-next-line:max-line-length
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

import Glide from '@glidejs/glide';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from'@material-ui/core/styles';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Flip from 'react-reveal/Flip';
import Reveal from 'react-reveal/Reveal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WaypointLottie from '../../WaypointLottie';

const trackOutboundLinkClick = window.trackOutboundLinkClick;

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(20)
    },
    container: {
      // marginTop: '30px',
      paddingLeft: '3em',
      paddingRight: '3em',
      gridTemplateColumns: 'repeat(12, 1fr)',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '1.6em',
        paddingRight: '1.6em'
      }
    },
    logoText: {
      marginTop: '-2.6rem !important',
      [theme.breakpoints.down('xs')]: {
        marginTop: '-1.5rem !important'
      }
    },
    containerRev: {
      marginTop: '0px',
      paddingLeft: '3em',
      paddingRight: '3em',
      gridTemplateColumns: 'repeat(12, 1fr)',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '0.5em',
        paddingRight: '0.5em'
      },
      flexWrap: 'wrap-reverse'
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      // marginTop: theme.spacing(13),
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
      justifyContent: 'center',
      alignItems: 'center',
      objectFit: 'contain',
      pointerEvents: 'none',
      [theme.breakpoints.down('sm')]: {
        paddingTop: `${theme.spacing(5)}px`,
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
    centered2: {
      paddingTop: '0',
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingBottom: '4em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    },
    divider: {
      margin: `${theme.spacing(3)}px 0`,
      [theme.breakpoints.down('sm')]: {
        margin: `${theme.spacing(1)}px 0`
      }
    },
    divider2: {
      height: '13vh',
      [theme.breakpoints.down('sm')]: {
        height: '4vh'
      }
    }
  }),
  { name: 'HomeContent' }
);

const logoOptions = {
  renderer: 'svg',
  loop: false,
  autoplay: false,
  // isPaused: true,
  path: 'assets/logo.json',
  subframeEnabled: false,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const talkingOptions = {
  renderer: 'svg',
  loop: true,
  autoplay: false,
  subframeEnabled: true,
  path: 'assets/splash-talking.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const topicsOptions = {
  renderer: 'svg',
  loop: true,
  autoplay: false,
  subframeEnabled: false,
  path: 'assets/topics.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const diningOptions = {
  renderer: 'svg',
  loop: true,
  autoplay: false,
  subframeEnabled: false,
  path: 'assets/mesa.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const cullingHandlers = (
  id: React.MutableRefObject<any>,
  onLeave: boolean = false,
  speed = 1
) => {
  if (!onLeave) {
    // if(obj.handlerOn) return obj.handlerOn;
    return () => {
      // console.log('playing', _id);
      if (id.current) {
        // dining
        id.current.setSpeed(speed);
        id.current.play();
      }
    };
  } else {
    // if (obj.handlerOff) return obj.handlerOff;
    return () => {
      if (id.current) id.current.stop();
    };
  }
};

const trackRulesView = () => {
  window.gtag('event', 'scroll_rules', {
    event_category: 'splash',
    non_interaction: true
  });
};

export default function HomeContent() {
  const classes = useStyles({});
  const { t } = useTranslation();

  // const logoVisible = useOnScreen(logoRef, 0, true);
  // const topicsVisible = useOnScreen(topicsRef, 0, true);

  useEffect(() => {
    new Glide('.glide', {
      autoplay: true,
      animationDuration: 4000,
      type: 'carousel',
      gap: 150
    }).mount();
  }, []);

  return (
    <React.Fragment>
      <div className={classes.centered2}>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} md={12} style={{ paddingBottom: '0' }}>
            <div className="paperimg" id="intro" style={{marginTop:'-58px', paddingTop: '90px', pointerEvents:'none' }}>
              <WaypointLottie options={logoOptions}/>
            </div>
          </Grid>
          <Grid item xs={12} md={12} style={{ paddingTop: '0' }}>
          <Typography className={classes.logoText} align="center" style={{ fontSize: '1.0rem' }}>
                      A partner of <a
                href="https://www.newdialogue.org"
              >New Dialogue Foundation</a>
              <br /><br />
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              align="center"
            >
              {t('home-intro')}
            </Typography>
            <div style={{ width: '100%', textAlign: 'center' }}>
              Are you a student or a teacher? Read about our{' '}
              <a href="/campus" target="_self" style={{ color: '#bd4c4c' }}>
                Campus Program.
              </a>

              <br/>
              
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <Divider className={classes.divider} />
            <div
              id="social_icon_footer"
              className="text-center center-block"
              style={{ textAlign: 'right' }}
            >
              <Typography
                variant="subtitle1"
                align="right"
                style={{ color: 'gray' }}
              >
                ...news and updates
              </Typography>
              <a
                style={{ color: 'black' }}
                href="https://medium.com/dinnertablechat"
                onClick={trackOutboundLinkClick(
                  'https://medium.com/dinnertablechat'
                )}
              >
                <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'medium']} style={{ color: 'black' }} />
              </a>

              <a
                style={{ color: 'black' }}
                href="https://twitter.com/dintablechat"
                onClick={trackOutboundLinkClick(
                  'https://twitter.com/dintablechat'
                )}
              >
                <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'twitter-square']} style={{ color: 'black' }} />
              </a>

              <a
                style={{ color: 'black' }}
                href="https://facebook.com/dinnertablechat"
                onClick={trackOutboundLinkClick(
                  'https://facebook.com/dinnertablechat'
                )}
              >
                <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'facebook-square']} style={{ color: 'black' }} />
              </a>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className={classes.centered}>
        <Grid container spacing={3} className={classes.containerRev}>
          <Grid item xs={12} md={6}>
            <Reveal effect="fadeInUp" fraction={0.35}>
              <Typography variant="h6" gutterBottom align="left">
                <div className={classes.divider} />
                {t('home-rules-title')}
              </Typography>
              <Typography variant="body2" gutterBottom align="left">
                {t('home-rules')}
              </Typography>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <Flip bottom={true} fraction={0.7} onReveal={trackRulesView}>
                <img
                  alt="internet trolls"
                  src="https://via.placeholder.com/150"
                  data-src="./imgs/05-troll.png"
                  className={classes.paperimg + ' lazyload'}
                />
              </Flip>
            </div>
          </Grid>

          <Grid item xs={12} md={12} className={classes.divider2} />
          <Grid item xs={12} md={12}>
            <Reveal effect="fadeInUp" fraction={0.35}>
              <Typography variant="h6" gutterBottom align="left">
                <div className={classes.divider} />
                Bringing your best
              </Typography>
              <Typography variant="body2" gutterBottom align="left">
                Like any good home, the dining table is a place to talk about the things most important while still upholding the highest respect for others that attend.
              </Typography>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={12}>
            <div className={classes.paper}>
                <div style={{ width: '120%', maxWidth:'90vw', margin: '-74px -4em -94px -1.8em' }}>
                  <WaypointLottie
                    speed={1.6}
                    options={diningOptions}
                  />
                </div>
            </div>
          </Grid>

          <Grid item xs={12} md={12} className={classes.divider2} />
          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Reveal effect="fadeInUp" fraction={0.35}>
              <Typography variant="h6" gutterBottom align="left">
                {t('home-char-title')}
              </Typography>
              <Typography variant="body2" gutterBottom align="left">
                {t('home-char')}
              </Typography>
            </Reveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <div className="glide">
                <div data-glide-el="track" className="glide__track">
                  <ul className="glide__slides">
                    <li className="glide__slide">
                      <img
                        alt="character1"
                        src="https://via.placeholder.com/150"
                        data-src="./imgs/04-select.png"
                        className={classes.paperimg + ' lazyload'}
                      />
                    </li>
                    <li className="glide__slide">
                      <img
                        alt="character2"
                        src="https://via.placeholder.com/150"
                        data-src="./imgs/04-select2.png"
                        className={classes.paperimg + ' lazyload'}
                      />
                    </li>
                    <li className="glide__slide">
                      <img
                        alt="character3"
                        src="https://via.placeholder.com/150"
                        data-src="./imgs/04-select3.png"
                        className={classes.paperimg + ' lazyload'}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={12} className={classes.divider2} />
          <Grid item xs={12} md={6}>
            <div className={classes.divider} />

            <Typography variant="h6" gutterBottom align="left">
              {t('home-topic-title')}
            </Typography>

            <Typography variant="body2" gutterBottom align="left">
              {t('home-topic')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <WaypointLottie
                options={topicsOptions}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={12} className={classes.divider2} />
          <Grid item xs={12} md={6}>
            <div className={classes.divider} />
            <Typography variant="h6" gutterBottom align="left">
              {t('home-overview-title')}
            </Typography>

            <Typography variant="body2" gutterBottom align="left">
              {t('home-overview')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.paper}>
              <WaypointLottie
                options={talkingOptions}
              />
            </div>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
      </div>
    </React.Fragment>
  );
}
