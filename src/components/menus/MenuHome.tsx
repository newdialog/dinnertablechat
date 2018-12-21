import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Typography, Stepper, Step, StepLabel, StepContent, Paper } from '@material-ui/core'
import * as AppModel from '../../models/AppModel';
import PositionSelector from './PositionSelector';
import ContributionSelector from './ContributionSelector';
import { inject } from 'mobx-react';
import CharacterSelection from './CharacterSelection';
import HOC from '../HOC';
import Footer from '../home/Footer';
import HistoryIcon from '@material-ui/icons/History';
import * as Times from '../../services/TimeService';

const styles = theme => 
  createStyles({
    pagebody: {
      backgroundColor:theme.palette.primary.light,
      minHeight: '100vh'
    },
    container: {
      marginTop: '0px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    },
    appBar: {
      position: 'relative',
    },
    icon: {
      marginRight: theme.spacing.unit * 2,
    },
    heroUnit: {
      // backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
      maxWidth: 600,
      textAlign:'center',
      margin: '0 auto',
      padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 0}px`,
    },
    stepper: {
      padding: theme.spacing.unit * 0,
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      color: theme.palette.primary.dark
    },
    actionsContainer: {
      marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
      padding: theme.spacing.unit * 3,
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing.unit * 6,
    },
    linkhome: {
      color: theme.palette.primary.dark
    }
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  isTest?: boolean;
}
interface State {
  open: boolean;
  activeStep: number,
}

function getSteps() {
  return ['Select Postion', 'Pick your character']; // , 'Set contribution']
}

function onHistory(store: AppModel.Type) {
  store.router.push('/home');
}

function getStepContent(step: number, store: AppModel.Type) {
  switch (step) {
    case 0:
      return <PositionSelector store={store} />
    case 1:
      return <CharacterSelection store={store} />
    case 2:
      return <ContributionSelector store={store} />
    default:
      return <Typography>Hmm, something went wrong. Please try again after refreshing the page.</Typography>;
  }
}

 
class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false, activeStep: 0 };
  }

  public componentDidMount() {
    if(this.props.store.isLive() && !Times.isDuringDebate()) {
      this.props.store.router.push('/home');
    }
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

  private renderStepButtons = (activeStep, classes, steps) => {
    return (
      <div className={classes.actionsContainer}>
        <Button
          disabled={activeStep === 0}
          onClick={this.handleBack}
          className={classes.button}
          color="secondary"
        >
          Reset Selections
        </Button>
      </div>
    );
  }


  public render() {
    const { classes, store } = this.props;
    if(store.auth.isNotLoggedIn) {
      store.router.push('/');
      return (<div/>);
    }
    let step = 3;
    
    if(store.debate.contribution===-1) step = 2; // skip contribution
    if(store.debate.character===-1) step = 1;
    if(!store.debate.topic || store.debate.position===-1) step = 0;
    
    // if(store.debate.position !== -1 && store.debate.contribution !== -1) step = 2;
    // if(store.debate.character !== -1) step = 3;
    if(step===3) store.router.push('/match');
    // console.log('step', step)
    const steps = getSteps();

  return (
    <div className={classes.pagebody}>
      <main className={classes.container}>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            { this.props.isTest && (<h2>TEST MODE (/test)</h2>)}
            <Typography style={{fontSize: '3em', paddingBottom: '0', color: '#ffffffcc'}} variant="h3" align="center" color="textSecondary" gutterBottom>
              Debate Quickmatch
            </Typography>
          </div>
        </div>
        {/* End hero unit */}
        <div className={classes.stepper}>
          <Stepper color='primary' activeStep={step} orientation="vertical" style={{backgroundColor:'#2db8cc'}}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {getStepContent(index, store)}
                    {(step === 0) ? null : this.renderStepButtons(step, classes, steps)}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
          {step > steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>All steps completed - you&quot;re about to enter the queue for {store.debate.topic}!</Typography>
              <Button color="secondary" onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </div>

        <Button className={classes.linkhome} color="secondary" onClick={ () => onHistory(store) }>
          Back to Profile Home
        <HistoryIcon style={{marginLeft: '8px'}}></HistoryIcon>
        </Button>
      </main>
    </div>
  );
  }
}
export default inject('store')(HOC(Index, styles));

// took this out as height is a little wierd on page
// <Footer className={classes.footer}/>