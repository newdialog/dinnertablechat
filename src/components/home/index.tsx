import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import Lottie from 'react-lottie';

import Content from './Content';
// import * as logoData from '../assets/logo.json';
const logoData = require('../../assets/logo.json');
// import bannerImg from '../../public/assets/banner2.jpg'
// const bannerImg = require('../assets/banner2.jpg')

const styles = (theme: any) =>
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
    divider: {
      margin: `${theme.spacing.unit * 2}px 0`
    },
    banner: {
      display: 'flex',
      objectFit: 'cover',
      width: '100%',
      height: 'calc(90vh - 55px)',
      backgroundImage: 'url("./banner2.jpg")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center 0',
      color: 'white',
      // justifyContent: 'center',
      // justifyContent: 'flex-end',
      flexFlow: 'column nowrap'
    },
    bannerText: {
      fontFamily: 'Open Sans',
      color: 'white',
      // position: 'absolute',
      bottom: '20%',
      marginBottom: '15vh',
      backgroundColor: '#00000044',
      fontWeight: 'bold'
      // left: ''
    },
    logoanim: {
      width: '100vw',
      maxWidth: '600px',
      // minHeight: '300px',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex'
    }
  });

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: logoData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

interface Props extends WithStyles<typeof styles> {}
interface State {
  open: boolean;
}

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;
    // <img className={classes.banner} src="./banner2.jpg" />
    // s
    /* 
    <Typography variant="display1" gutterBottom align="center" className={classes.bannerText}>
            Have a polite talk with your opposite
          </Typography>
    */
    return (
      <React.Fragment>
        <div className={classes.banner}>
          <div className={classes.logoanim}>
            <Lottie options={defaultOptions} />
          </div>
        </div>

        <Content />
      </React.Fragment>
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

export default withRoot(withStyles(styles)(Index));
