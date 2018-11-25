import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Typography, Paper, Grid } from '@material-ui/core'
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import HOC from '../HOC';

const styles = theme => 
  createStyles({
    root: {
        // maxWidth: 400,
        //flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        //marginTop: theme.spacing.unit * 4,
        //backgroundColor: theme.palette.background.paper,
    },
    img: {
        height: 255,
        maxWidth: 270,
        overflow: 'hidden',
        display: 'block',
    },
    // heroContent: {
    //   maxWidth: 600,
    //   textAlign:'center',
    //   margin: '0 auto',
    //   padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 0}px`,
    // },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
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

const tutorialSteps = [
    {
      label: 'Select Topic',
      imgPath: './imgs/04-select.png',
    },
    {
      label: 'Select Character',
      imgPath: './imgs/04-select2.png',
    },
    {
      label: 'Join Debate',
      imgPath: './imgs/04-select3.png',
    },
    {
      label: 'Find Agreement',
      imgPath: './imgs/04-select2.png',
    },
    {
      label: 'Give Feedback',
      imgPath: './imgs/04-select.png',
    },
    {
        label: 'Earn Achievements',
        imgPath: './imgs/04-select2.png',
    },
  ];
  

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

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  private handleReset = () => {
    const { store } = this.props;
    store.debate.resetQueue();
  };

  public render() {
    const { classes, store } = this.props;
    const { activeStep } = this.state;
    const maxSteps = tutorialSteps.length;
    if(store.auth.isNotLoggedIn) {
      store.router.push('/');
      return (<div/>);
    }

  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
        >
        <Grid item >
            <Typography variant="h4" color="primary" align="right">
                {tutorialSteps[activeStep].label}
            </Typography>
        </Grid>    
        <Grid item >
            <img
                className={classes.img}
                src={tutorialSteps[activeStep].imgPath}
                alt={tutorialSteps[activeStep].label}
            />
        </Grid>    
        <Grid item >
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={this.handleNext} disabled={this.state.activeStep === 5}>
                        Next
                        <KeyboardArrowRight />
                    </Button>
                    }
                    backButton={
                    <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0}>
                        <KeyboardArrowLeft />
                        Back
                    </Button>
                }
            />
        </Grid>   
     </Grid>
    </React.Fragment>
  );
  }
}
export default inject('store')(HOC(GettingStarted, styles));
