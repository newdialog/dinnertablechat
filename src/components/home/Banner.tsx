import * as React from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Lottie from 'react-lottie';
import { observer } from 'mobx-react';

import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Waypoint from 'react-waypoint';
import { translate } from 'react-i18next';

const bgData = require('../../assets/background.json');

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
      paddingBottom: '1em',
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
      zIndex:-1, 
      position: 'absolute',
      top:0, 
      bottom:0, 
      width:'100%', 
      objectFit: 'cover', 
      pointerEvents:'none'
    },
    bannerAnimOverlay: {
      zIndex:-1, 
      position: 'absolute',
      top:0, 
      bottom:0, 
      width:'100%',
      background:'rgba(0, 0, 0, 0.35)',
      backgroundBlendMode: 'multiply'
    },
    largeIcon: {
      width: 80,
      height: 60
    }
  });

const bgOptions = {
  loop: true,
  autoplay: true,
  animationData: bgData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props extends WithStyles<typeof styles> { t:any }

@observer
class Index extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private bannerRef = React.createRef<Lottie | any>()

  private _handleWaypointEnter = () => {
    if(!this.bannerRef.current) return
    this.bannerRef.current.play();
  }

  private _handleWaypointLeave = () => {
    if(!this.bannerRef.current) return
    this.bannerRef.current.stop();
  }
  /*
            <img src="./DTC-scene3.png"/>
            <img src="./DTC-scene3-foreg.png" style={{width:'100%'}}/>
*/
  public render() {
    const { classes, t } = this.props;
    return (
      <React.Fragment>
        <Waypoint topOffset="-60%" bottomOffset="0"
              onEnter={this._handleWaypointEnter}
              onLeave={this._handleWaypointLeave}
            />
        <div className={classes.banner}>
          <div className={classes.bannerAnim}>
            <Lottie options={bgOptions} ref={this.bannerRef} />
          </div>
          <div className={classes.bannerAnimOverlay}></div>
          <div className={classes.centeredDown}>
            <Typography variant="display4" gutterBottom align="center">
              {t('home-banner-title1')}
            </Typography>
            <Typography variant="display1" align="center">
              {t('home-banner-title2')}
            </Typography>
            <div className={classes.bannerTextDivider} />
            <a href="#intro">
              <IconButton style={{ height: '11vh', width: '11vh' }}>
                <ArrowDown style={{ fontSize: '11vh' }} />
              </IconButton>
              <div id="intro" style={{ height: 0 }} />
            </a>
            <br />
            <Button href="#intro" size="small" variant="contained" color="primary">
              Learn More
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(withRoot(withStyles(styles)(Index)));
