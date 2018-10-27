import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, CssBaseline, Typography, Stepper, Step, StepLabel, StepContent, Paper } from '@material-ui/core'
import * as AppModel from '../../models/AppModel';
import PositionSelector from './PositionSelector';
import ContributionSelector from './ContributionSelector';
import { inject } from 'mobx-react';
import CharacterSelection from './CharacterSelection';
import HOC from '../HOC';

const styles = theme => 
  createStyles({
    appBar: {
      position: 'relative',
    },
    icon: {
      marginRight: theme.spacing.unit * 2,
    },
    heroUnit: {
      backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
      maxWidth: 600,
      margin: '0 auto',
      padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    stepper: {
      padding: '10%',
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
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
  return ['Select Postion', 'Pick your character', 'Set contribution'];
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
    this.props.store.debate.setTest(this.props.isTest===true);
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
    let step = 3;
    
    if(store.debate.contribution===-1) step = 2;
    if(store.debate.character===-1) step = 1;
    if(!store.debate.topic || store.debate.position===-1) step = 0;
    
    // if(store.debate.position !== -1 && store.debate.contribution !== -1) step = 2;
    // if(store.debate.character !== -1) step = 3;
    if(step===3) store.router.push('/match');
    // console.log('step', step)
    const steps = getSteps();

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            { this.props.isTest && (<h2>TEST MODE (/test)</h2>)}
            <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
              Debate Topics
            </Typography>
            <Typography variant="h6" align="center" color="textSecondary" paragraph>
              Select your position on a topic proposition to get started. 
            </Typography>
          </div>
        </div>
        {/* End hero unit */}
        <div className={classes.stepper}>
          <Stepper activeStep={step} orientation="vertical">
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
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
  }
}

export default inject('store')(HOC(Index, styles));
