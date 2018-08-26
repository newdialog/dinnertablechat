import * as React from 'react';
/*
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
*/
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Lottie from 'react-lottie';
import Content from './Content';
import { observer } from 'mobx-react';
import Subcribe from './Subscribe';

const logoData = require('../../assets/logo.json');

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
      height: 'calc(70vh - 55px)',
      backgroundImage: 'url("./banner.jpg")',
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

import AppModel from '../../models/AppModel';
interface Props extends WithStyles<typeof styles> {
  store: typeof AppModel.Type;
}
interface State {
  open: boolean;
}

@observer
class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;
    /* 
    <Typography variant="display1" gutterBottom align="center" className={classes.bannerText}>
            Have a polite talk with your opposite
          </Typography>

          <div className={classes.logoanim}>
            <Lottie options={defaultOptions} />
          </div>
    */
    return (
      <React.Fragment>
        <div className={classes.banner} />

        <Content />
        <div className={classes.centered}>
          <Subcribe />
        </div>
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
