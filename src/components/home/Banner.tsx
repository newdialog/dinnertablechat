import * as React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

import Lottie from 'react-lottie';
import Reveal from 'react-reveal/Reveal';
import { observer } from 'mobx-react';

import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Waypoint from 'react-waypoint';
import HOC from '../HOC';
import * as AppModel from '../../models/AppModel';
import QueueIcon from '@material-ui/icons/QueuePlayNext';
import BannerTimer from './BannerTimer';
// const bgData = require('../../assets/background.json');

const styles = (theme: Theme) =>
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
    centeredDown: {
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingBottom: '5vh',
      color: '#ffffff88',
      textAlign: 'center',
      display: 'inline-block'
    },
    divider: {
      margin: `${theme.spacing.unit * 2}px 0`
    },
    banner: {
      display: 'flex',
      objectFit: 'cover',
      width: '100%',
      height: 'calc(100vh - 0px)',
      // backgroundImage: 'url("./imgs/DTC-scene3-bg2.png")', // DTC-scene3.png
      backgroundSize: 'cover',
      // backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center 0',
      color: 'white',
      // justifyContent: 'center',
      justifyContent: 'flex-end',
      flexFlow: 'column nowrap'
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
      height: '14vh',
      [theme.breakpoints.down('sm')]: {
        height: '8vh'
      },
      [theme.breakpoints.down('xs')]: {
        height: '8vh'
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
  });

const bgOptions = {
  loop: true,
  autoplay: false,
  path: 'assets/background.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  t: any;
}

class Index extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private bannerRef = React.createRef<Lottie | any>();

  private _handleWaypointEnter = () => {
    if (!this.bannerRef.current) return;
    this.bannerRef.current.play();
  };

  private _handleWaypointLeave = () => {
    if (!this.bannerRef.current) return;
    this.bannerRef.current.stop();
  };
  /*
            <img src="./DTC-scene3.png"/>
            <img src="./DTC-scene3-foreg.png" style={{width:'100%'}}/>
*/
  public render() {
    const { classes, t, store } = this.props;
    const auth = store.auth.isAuthenticated();
    const isLive = store.isLive();

    return (
      <React.Fragment>
        <Waypoint
          topOffset="-60%"
          bottomOffset="0"
          onEnter={this._handleWaypointEnter}
          onLeave={this._handleWaypointLeave}
        />
        <div className={classes.banner}>
          <div className={classes.bannerAnim}>
            <Lottie
              options={bgOptions}
              ref={this.bannerRef}
              isClickToPauseDisabled={true}
            />
          </div>
          <div className={classes.bannerAnimOverlay} />
          <div className={classes.centeredDown}>
            <Typography variant="h1" gutterBottom align="center">
              <Reveal effect="fadeIn" duration={3500}>
                {t('home-banner-title1')}
              </Reveal>
            </Typography>
            <Typography variant="h4" align="center">
              <Reveal effect="fadeIn" duration={5500}>
                {t('home-banner-title2')}
              </Reveal>
            </Typography>
            
            <div className={classes.bannerTextDivider} />
            <BannerTimer/>
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
            {!auth &&
              !isLive && (
                <Button style={{marginLeft:'2em'}} onClick={() => store.auth.login()} variant="contained" color="primary" size="large">Login</Button>
              )}
            {auth &&
              !isLive && (
                <React.Fragment>
                  <Button
                    style={{marginLeft:'2em'}}
                    variant="contained"
                    color="primary" size="large"
                    onClick={() => store.router.push('/play')}
                  >
                    {store.auth.user!.name.split(' ')[0]}'s Home
                    <QueueIcon style={{ marginLeft: '8px' }} />
                  </Button>
                </React.Fragment>
              )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HOC(Index, styles);
