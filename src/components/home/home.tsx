import * as React from 'react';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Content from './Content';
import { observer } from 'mobx-react';
import Subcribe from './Subscribe';

import Banner from './Banner';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      // gridGap: `${theme.spacing.unit * 3}px`,
      marginTop: '60px'
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
      height: 'auto',
      width: 'auto',
      maxWidth: '300px',
      margin: 'auto',
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
@observer
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
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={12} md={6}>
              <div className={classes.paper}>
                <img
                  src="./imgs/07-newsletter.png"
                  className={classes.paperimg}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Subcribe />
            </Grid>
          </Grid>
        </div>
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

export default withRoot(withStyles(styles)(Index));
