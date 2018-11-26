import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Typography, Paper, Grid } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import HOC from '../HOC';

const styles = theme => 
  createStyles({
    container: {
        marginTop: 48,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 'auto',
        maxWidth: '800px',
        minWidth: '300px',
        [theme.breakpoints.down('xs')]: {
          // marginTop: 35
        }
      },
    header: {
        alignItems: 'center',
        height: 50,
    },
    img: {
        // height: '35vh', // 40
        maxWidth: '30vw',
        // width: 250,
        overflow: 'hidden',
        borderRadius: 40,
        
        [theme.breakpoints.down('xs')]: {
          maxWidth: '100%',
          maxHeight: 'calc(43vh)',
        },
        [theme.breakpoints.up('md')]: {
          maxWidth: '260px',
        }
        // display: 'block',
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    title: {
      [theme.breakpoints.up('md')]: {
        fontSize:'3.5em'
      }
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

const tutorialSteps = [
    {
      title: 'Select Topic',
      subTitle: 'Get started by selecting your topic position. Topics are selected via news trends and your vote in DTC polls.',
      imgPath: './imgs/02-topics.png',
    },
    {
      title: 'Select Character',
      subTitle: 'You control a virtual character that will talk as you do and listen to your matched partner.',
      imgPath: './imgs/04-select.png',
    },
    {
      title: 'Join Debate',
      subTitle: 'Get matched with the other side. Be passionate about your views, keep an open mind and remember the golden rule.',
      imgPath: './imgs/press/01-scene1.png',
    },
    {
      title: 'Find Agreement',
      subTitle: 'It is easy to disagree. Celebrate when you and your partner come to an agreement - big or small!',
      imgPath: './logos/dtclogo2.png',
    },
    {
      title: 'Give Feedback',
      subTitle: 'Was your partner respectful, knowledgeable or crude? Let them know what you thought!',
      imgPath: './imgs/07-newsletter.png',
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

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };

  public render() {
    const { classes, store } = this.props;
    const { activeStep } = this.state;
    const maxSteps = tutorialSteps.length;

  return (
    <div className={classes.container}>
        <SwipeableViews
            index={activeStep}
            onChangeIndex={this.handleStepChange}
            enableMouseEvents
        >
            {tutorialSteps.map((step, index) => (

        <div key={step.title}>
          <Grid
              container
              spacing={0}
              direction="row"
              alignItems="center"
              justify="center"
              style={{ minHeight: 'calc(100vh - 60px - 66px)' }}
              >
              <Grid item xs={12}>
                  <Typography variant="h4" color="primary" align="center" className={classes.title}>
                      {step.title}
                  </Typography>
              </Grid>
              <Grid item xs={12} sm={4} style={{textAlign:'center', width:'100%'}}>
                  <img
                      className={classes.img}
                      src={step.imgPath}
                      alt={step.title}
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Typography variant="body2" align="center">
                      {step.subTitle}
                  </Typography>
              </Grid>
          </Grid>
        </div>
        ))}
        </SwipeableViews>  

        
     {( activeStep !== (maxSteps-1) ) ? null :
        <div style={{ textAlign: "center" }}>
            <Button 
                variant="contained" color="primary" 
                onClick={this.routeToPlay}>
            Begin
            </Button> 
        </div>
     }
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
    </div>
  );
  }
}
export default inject('store')(HOC(GettingStarted, styles));
