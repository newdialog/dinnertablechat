import * as React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import withRoot from '../../withRoot';


import Banner from './Banner';
import Content from './Content';
import { observer } from 'mobx-react';
import Subcribe from './Subscribe';
import Footer from './Footer';
import Announcement from '@material-ui/icons/RecordVoiceOver'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, 300px)',
      // gridGap: `${theme.spacing.unit * 3}px`,
      marginTop: '60px',
      alignItems: 'center',
      // gridAutoFlow: 'column',
      // gridAutoColumns: '200px'
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      }
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
      minWidth: '300px',
      textAlign: 'center'
    },
    centeredDown: {
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingBottom: '5em',
      color: '#ffffff88',
      textAlign: 'center'
    },
    divider: {
      margin: `${theme.spacing.unit * 2}px 0`
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
    paperimg: {
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 'auto',
      width: 'auto',
      maxWidth: '300px',
      minWidth: '200px',
      margin: 0,
      display: 'block',
      objectFit: 'contain',
      pointerEvents: 'none',
      [theme.breakpoints.down('sm')]: {
        paddingTop: `${theme.spacing.unit * 5}px`
        // maxWidth: '80%'
      },
      [theme.breakpoints.down('xs')]: {
        maxWidth: '100px'
      }
    }
  });

import * as AppModel from '../../models/AppModel';
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}
interface State {
  open: boolean;
}
import Grid from '@material-ui/core/Grid';
 
class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div>
        <Banner />

        <Content />
        <div className={classes.centered}>
          <Grid container spacing={0} className={classes.container}>
            <Grid item xs={2} sm={2} md={1} lg={1} className={classes.centered}>
                <img
                  src="./imgs/07-newsletter.png"
                  className={classes.paperimg}
                />
            </Grid>
            <Grid item xs={2} sm={2} md={1} lg={1} className={classes.centered}>
              <Subcribe />
            </Grid>
          </Grid>
          <div style={{marginTop:'3em'}}>
            <a href="https://goo.gl/forms/KaZBtAxKRs2M1dY62"
              onClick={window.trackOutboundLinkClick('https://goo.gl/forms/KaZBtAxKRs2M1dY62')}
              className="minorlink" style={{textDecoration:'none'}}>
              <Announcement/>  help us out by taking a quick poll
              
              </a>
          </div>
          <div style={{marginTop:'1em'}}>
          also follow us on Twitter <a href="https://twitter.com/dintablechat" onClick={window.trackOutboundLinkClick('https://twitter.com/dintablechat')} className="minorlink" style={{textDecoration:'none'}}>@dintablechat</a>
        </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  private handleClose = () => {
    this.setState({
      open: false
    });
  };

  private handleClick = () => {
    this.setState({
      open: true
    });
  };
}

export default withRoot(withStyles(styles)(observer(Index)));
