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
      title: 'Select Topic',
      subTitle: 'Get started by selecting a desired topic. \n Topics are selected via news trends, online discussions, and your vote in DTC polls.',
      imgPath: './imgs/04-select.png',
    },
    {
      title: 'Select Character',
      subTitle: 'You will control a virtual character that will talk as you talk, listen to your matched partner, and also represents your mood.',
      imgPath: './imgs/04-select2.png',
    },
    {
      title: 'Join Debate',
      subTitle: 'Our community embraces being super passionate and engaged… even if it makes us a little frightened or warm blooded. However, personal attacks, any form of discrimination, or just being a troll is not welcome. ',
      imgPath: './imgs/04-select3.png',
    },
    {
      title: 'Find Agreement',
      subTitle: 'It is easy to disagree, so let us know if you and your partner came to an agreement, big or small!',
      imgPath: './imgs/04-select2.png',
    },
    {
      title: 'Give Feedback',
      subTitle: 'Let the other side know what you thought!',
      imgPath: './imgs/04-select.png',
    },
    {
       title: 'Earn Achievements',
       subTitle: 'Unlock badges as you cultivate positive discussions and find common ground!',
       imgPath: './imgs/04-select2.png',
    },
  ];
  

class GettingStarted extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false, activeStep: 0 };
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

  routeToPlay = () => {
    const { store } = this.props;
    store.gotoHomeMenu();
  };

  public render() {
    const { classes, store } = this.props;
    const { activeStep } = this.state;
    const maxSteps = tutorialSteps.length;

  return (
    <React.Fragment>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh', maxWidth: '70hw' }}
        >
        <Grid item >
            <Typography variant="h4" color="primary" align="center">
                {tutorialSteps[activeStep].title}
            </Typography>
        </Grid>    
        <Grid item >
            <img
                className={classes.img}
                src={tutorialSteps[activeStep].imgPath}
                alt={tutorialSteps[activeStep].title}
            />
        </Grid>
        <Grid item >
            <Typography variant="body2" align="center">
                {tutorialSteps[activeStep].subTitle}
            </Typography>
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
        {( activeStep === (maxSteps-1) ) ? 
        <Button variant="contained" color="primary" onClick={this.routeToPlay}>Begin</Button> : null}   
     </Grid>
    </React.Fragment>
  );
  }
}
export default inject('store')(HOC(GettingStarted, styles));
