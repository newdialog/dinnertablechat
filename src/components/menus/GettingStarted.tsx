import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Typography, Stepper, Step, StepLabel, StepContent, Paper } from '@material-ui/core'
import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import HOC from '../HOC';
import Footer from '../home/Footer';
import HistoryIcon from '@material-ui/icons/History'

const styles = theme => 
  createStyles({
    container: {
      marginTop: '0px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    },
    centered: {
        marginTop: theme.spacing.unit * 5,
        paddingTop: '0',
        paddingLeft: '1em',
        paddingRight: '1em',
        paddingBottom: '4em',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'auto',
        maxWidth: '1000px',
        minWidth: '300px',
        minHeight: 'calc(100vh - 504px)'
      },
    heroUnit: {
      backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
      maxWidth: 600,
      textAlign:'center',
      margin: '0 auto',
      padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 0}px`,
    },
    title: {
        position: 'relative',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
      },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing.unit * 6,
    },
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  isTest?: boolean;
}
interface State {
  open: boolean;
  activeStep: number,
}


function onHistory(store: AppModel.Type) {
  store.router.push('/play');
}

 
class GettingStarted extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false, activeStep: 0 };
  }

  public componentDidMount() {
    if(Boolean(this.props.isTest) !== this.props.store.debate.isTest) { 
      this.props.store.debate.setTest(this.props.isTest===true);
    }
    this.handleReset();
  }

  private handleBack = () => {
    const { store } = this.props;
    this.handleReset();
  };

  private handleReset = () => {
    const { store } = this.props;
    store.debate.resetQueue();
  };

  public render() {
    const { classes, store } = this.props;
    if(store.auth.isNotLoggedIn) {
      store.router.push('/');
      return (<div/>);
    }

  return (
    <React.Fragment>
      <main className={classes.centered}>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
            <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.title}
                >
                Getting Started
            </Typography>
        </div>

      </main>
      {/* Footer */}
      <Footer className={classes.footer}/>
      {/* End footer */}
    </React.Fragment>
  );
  }
}
export default inject('store')(HOC(GettingStarted, styles));
