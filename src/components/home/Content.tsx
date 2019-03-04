// tslint:disable-next-line:max-line-length
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import HOC from '../HOC';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import Lottie from 'react-lottie';
// import Lottie from 'lottie-react-web';

import Reveal from 'react-reveal/Reveal';
import Flip from 'react-reveal/Flip';
import { Waypoint } from 'react-waypoint';

import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';

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
      gridTemplateColumns: 'repeat(12, 1fr)',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '1.6em',
        paddingRight: '1.6em'
      }
    },
    logoText: {
      marginTop:'-1.25em !important',
      [theme.breakpoints.down('xs')]: {
        marginTop:'-0.6em !important',
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
      padding: theme.spacing.unit,
      textAlign: 'center',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      // marginTop: theme.spacing.unit * 13,
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
      margin: `${theme.spacing.unit * 3}px 0`,
      [theme.breakpoints.down('sm')]: {
        margin: `${theme.spacing.unit * 1}px 0`
      }
    },
    divider2: {
      height: '13vh',
      [theme.breakpoints.down('sm')]: {
        height: '4vh'
      }
    }
  });

const logoOptions = {
  renderer: 'svg',
  loop: false,
  autoplay: false,
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

interface Props extends WithStyles<typeof styles> {
  t: any;
}
interface State {
  open: boolean;
}

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  private logoRef = React.createRef<Lottie | any>();
  private topicsRef = React.createRef<Lottie | any>();
  private talkingRef = React.createRef<Lottie | any>();
  private diningRef = React.createRef<Lottie | any>();
  private handlers: { [k: string]: any } = {};

  public componentDidMount() {
    new Glide('.glide', {
      autoplay: true,
      animationDuration: 4000,
      type: 'carousel',
      gap: 150
    }).mount();
  }

  private _handleLogoWaypointEnter = () => {
    if (!this.logoRef.current) return;
    // console.log('this.logoRef.current', this.logoRef.current)
    this.logoRef.current.stop();
    this.logoRef.current.play();
  };

  private _handleLogoWaypointLeave = () => {
    if (!this.logoRef.current) return;
    // console.log('this.logoRef.current', this.logoRef.current)
    // this.logoRef.current.stop();
  };

  private memoizedHandler = (id: any, onLeave: boolean = false) => {
    const handlers = this.handlers;
    const _id = !onLeave ? id : id + 'leave';
    if (handlers[_id]) {
      return handlers[_id];
    }
    if (!onLeave)
      return (handlers[_id] = () => {
        // console.log('playing', _id);
        if (this[id].current) {
          // dining
          if (id === 'diningRef') this[id].current.setSpeed(1.6);
          this[id].current.play();
        }
      });
    else
      return (handlers[_id] = () => {
        // console.log('stopping', _id);
        if (this[id].current) this[id].current.stop();
      });
  };

  private trackRulesView = () => {
    window.gtag('event', 'scroll_rules', {
      event_category: 'splash',
      non_interaction: true
    });
  };

  public render() {
    const { classes, t } = this.props;
    const { open } = this.state;
    // <img className={classes.banner} src="./banner2.jpg" />
    // s
    /*
    <Typography variant="h4" gutterBottom align="center" className={classes.bannerText}>
            Have a polite talk with your opposite
          </Typography>
    */
    return (
      <React.Fragment>
        <div className={classes.centered2}>
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={12} md={12} style={{paddingBottom:'0'}}>
              <div className="paperimg" id="intro">
                <Waypoint
                  topOffset="-10%"
                  bottomOffset="0"
                  onEnter={this._handleLogoWaypointEnter}
                  onLeave={this._handleLogoWaypointLeave}
                />
                <Lottie
                  options={logoOptions}
                  ref={this.logoRef}
                  isClickToPauseDisabled={true}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={12} style={{paddingTop:'0'}}>
              <Typography className={classes.logoText} variant="h3" gutterBottom align="center">
                {t('home-intro')}
              </Typography>
              <div style={{width:'100%', textAlign:'center'}}>
                <a href='https://play.google.com/store/apps/details?id=chat.dinnertable&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                <img alt='Get it on Google Play'className="lazyload" data-src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' width="170px"/>
                </a>
                <br/>Are you a student or a teacher? Read about our <a
                  href="/campus"
                  target="_self"
                  style={{color:'#bd4c4c'}}
                >
                  Campus Program.
                </a>
              </div>
            </Grid>
            <Grid item xs={12} md={12}>
              <Divider className={classes.divider} />
              <div
                id="social_icon_footer"
                className="text-center center-block"
                style={{ textAlign: 'right' }}
              >
                <Typography variant="subtitle1" align="right" style={{color:'gray'}} >...news and updates</Typography>
                <a
                  style={{ color: 'black' }}
                  href="https://medium.com/dinnertablechat"
                  onClick={trackOutboundLinkClick(
                    'https://medium.com/dinnertablechat'
                  )}
                >
                  <i
                    id="social-medium"
                    className="fab fa-medium social fa-3x "
                  />
                </a>

                <a
                  style={{ color: 'black' }}
                  href="https://twitter.com/dintablechat"
                  onClick={trackOutboundLinkClick(
                    'https://twitter.com/dintablechat'
                  )}
                >
                  <i
                    id="social-tw"
                    className="fab fa-twitter-square social fa-3x "
                  />
                </a>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className={classes.centered}>
          <Grid container spacing={24} className={classes.containerRev}>
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
                <Flip
                  bottom={true}
                  fraction={0.7}
                  onReveal={this.trackRulesView}
                >
                  <img src="https://via.placeholder.com/150" data-src="./imgs/05-troll.png" className={classes.paperimg + ' lazyload'} />
                </Flip>
              </div>
            </Grid>

            <Grid item xs={12} md={12} className={classes.divider2} />
            <Grid item xs={12} md={12}>
              <Reveal effect="fadeInUp" fraction={0.35}>
                <Typography variant="h6" gutterBottom align="left">
                  <div className={classes.divider} />
                  {t('home-tiers-title')}
                </Typography>
                <Typography variant="body2" gutterBottom align="left">
                  {t('home-tiers')}
                </Typography>
              </Reveal>
            </Grid>
            <Grid item xs={12} md={12}>
              <div className={classes.paper}>
                <Waypoint
                  topOffset="-10%"
                  bottomOffset="0"
                  onEnter={this.memoizedHandler('diningRef')}
                  onLeave={this.memoizedHandler('diningRef', true)}
                >
                  <div style={{ width: '120%', margin: '0 -1.8em 0 -1.8em' }}>
                    <Lottie
                      speed={1.6}
                      options={diningOptions}
                      ref={this.diningRef}
                      isClickToPauseDisabled={true}
                    />
                  </div>
                </Waypoint>
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
                          src="https://via.placeholder.com/150" data-src="./imgs/04-select.png"
                          className={classes.paperimg+ ' lazyload'}
                        />
                      </li>
                      <li className="glide__slide">
                        <img
                          src="https://via.placeholder.com/150" data-src="./imgs/04-select2.png"
                          className={classes.paperimg+ ' lazyload'}
                        />
                      </li>
                      <li className="glide__slide">
                        <img
                          src="https://via.placeholder.com/150" data-src="./imgs/04-select3.png"
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
                <Waypoint
                  topOffset="-10%"
                  bottomOffset="0"
                  onEnter={this.memoizedHandler('topicsRef')}
                  onLeave={this.memoizedHandler('topicsRef', true)}
                >
                  <div>
                    <Lottie
                      options={topicsOptions}
                      ref={this.topicsRef}
                      isClickToPauseDisabled={true}
                    />
                  </div>
                </Waypoint>
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
                <Waypoint
                  topOffset="-10%"
                  bottomOffset="0"
                  onEnter={this.memoizedHandler('talkingRef')}
                  onLeave={this.memoizedHandler('talkingRef', true)}
                >
                  <div>
                    <Lottie
                      options={talkingOptions}
                      ref={this.talkingRef}
                      isClickToPauseDisabled={true}
                    />
                  </div>
                </Waypoint>
              </div>
            </Grid>
          </Grid>

          <Divider className={classes.divider} />
        </div>
      </React.Fragment>
    );
  }
}

export default HOC(Index, styles);
