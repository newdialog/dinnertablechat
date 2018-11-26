import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Typography, Paper, Grid } from '@material-ui/core';
const { red, blue, green } = require('@material-ui/core/colors');
// import MobileStepper from '@material-ui/core/MobileStepper';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel'
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
       subTitle: '',
       imgPath: './imgs/04-select2.png',
    },
  ];
  

class Tutorial extends React.Component<Props, State> {
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

  public render() {
    const { classes, store } = this.props;
    const { activeStep } = this.state;
    const maxSteps = tutorialSteps.length;

    // src={tutorialSteps[activeStep].imgPath}
    // alt={tutorialSteps[activeStep].label}

  return (
    <div style={{ width: '100%', height: '100%' }}>
        <AutoRotatingCarousel
            label=''
            style={{ position: 'absolute' }}
            onChange={(i) => this.setState({activeStep: i})}
            // interval={8000}
            open
            autoplay={false}
            mobile
        >
           <Slide
            media={<img src={tutorialSteps[activeStep].imgPath} />}
            mediaBackgroundStyle={{ backgroundColor: red[400] }}
            style={{ backgroundColor: red[600] }}
            title={tutorialSteps[activeStep].title}
            subtitle={tutorialSteps[activeStep].subTitle}
            />
            <Slide
            media={<img src={tutorialSteps[activeStep].imgPath} />}
            mediaBackgroundStyle={{ backgroundColor: blue[400] }}
            style={{ backgroundColor: blue[600] }}
            title={tutorialSteps[activeStep].title}
            subtitle={tutorialSteps[activeStep].subTitle}
            />
            <Slide
            media={<img src={tutorialSteps[activeStep].imgPath} />}
            mediaBackgroundStyle={{ backgroundColor: red[300] }}
            style={{ backgroundColor: red[400] }}
            title={tutorialSteps[activeStep].title}
            subtitle={tutorialSteps[activeStep].subTitle}
            />
            <Slide
            media={<img src={tutorialSteps[activeStep].imgPath} />}
            mediaBackgroundStyle={{ backgroundColor: red[400] }}
            style={{ backgroundColor: red[600] }}
            title={tutorialSteps[activeStep].title}
            subtitle={tutorialSteps[activeStep].subTitle}
            />
            <Slide
            media={<img src={tutorialSteps[activeStep].imgPath} />}
            mediaBackgroundStyle={{ backgroundColor: blue[400] }}
            style={{ backgroundColor: blue[600] }}
            title={tutorialSteps[activeStep].title}
            subtitle={tutorialSteps[activeStep].subTitle}
            />
            <Slide
            media={<img src={tutorialSteps[activeStep].imgPath} />}
            mediaBackgroundStyle={{ backgroundColor: red[300] }}
            style={{ backgroundColor: red[400] }}
            title={tutorialSteps[activeStep].title}
            subtitle={tutorialSteps[activeStep].subTitle}
            />
        </AutoRotatingCarousel>
    </div>
    );
  }
}
export default inject('store')(HOC(Tutorial, styles));
