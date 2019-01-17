import * as React from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import HOC from '../HOC';

import {
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import APIService from '../../services/APIService';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Reveal from 'react-reveal/Reveal';
import Bounce from 'react-reveal/Bounce';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 6,
      height: '100vh'
    },
    pagebody: {
      backgroundColor:theme.palette.primary.light,
    },
    margin: {
      margin: theme.spacing.unit * 2
    },
    button: {
      marginBottom: theme.spacing.unit * 2
    },
    header: {
      position: 'relative',
      margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme
        .spacing.unit + 6}px`
    },
    chip: {
      margin: theme.spacing.unit,
      fontWeight: 'bold'
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 320
    },

    iOSSwitchBase: {
      '&$iOSChecked': {
        color: theme.palette.common.white,
        '& + $iOSBar': {
          backgroundColor: '#52d869'
        }
      },
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.sharp
      })
    },
    iOSChecked: {
      transform: 'translateX(15px)',
      '& + $iOSBar': {
        opacity: 1,
        border: 'none'
      }
    },
    iOSBar: {
      borderRadius: 13,
      width: 45,
      height: 28,
      marginTop: -13,
      marginLeft: -21,
      border: 'solid 1px',
      borderColor: theme.palette.grey[400],
      backgroundColor: '#990000',
      fontWeight: 'bold',
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border'])
    },
    iOSIcon: {
      width: 28,
      height: 28,
      boxShadow: theme.shadows[3]
    },
    iOSIconChecked: {
      boxShadow: theme.shadows[3]
    },
    iOSRoot: {
      fontWeight: 'bold',
      fontSize: '20px'
    }
  });

const goodTraits = ['Respectful', 'Knowledgeable', 'Charismatic']; //'Open-minded', 'Concise'];
const badTraits = ['Absent', 'Aggressive', 'Crude', 'Interruptive'];
/*
* Rhetorician (consistently rated with positive traits)
* three different achievements for participating in 3, 5, 10 debates

Debate badges (debate session level):
* Good Citizen (good listener respectful, good host, kind)
* Fact Checker (fact provider, professor-like)
* Charismatic (convincing, rhetoric master)
*/

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}

interface State {
  traitHash: { [key: string]: boolean };
  platformFeedback: '';
  agreed: boolean;
}

class DebateFeedback extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { traitHash: {}, platformFeedback: '', agreed: false };
  }

  private handleChipClick(label: string) {
    const traitHash = this.state.traitHash;
    traitHash[label] = !traitHash[label];
    this.setState({ traitHash });
  }

  private handleTextFieldChange(e: any) {
    this.setState({ platformFeedback: e.target.value });
  }

  public componentDidMount() {
    window.gtag('event', 'debate_feedback_page', {
      event_category: 'debate',
      guest: this.props.store.isGuest()
    });
    this.setState({ agreed: this.props.store.debate.agreed });
  }

  private handleConfirm = async () => {
    window.gtag('event', 'debate_feedback_page_submit', {
      event_category: 'debate',
      guest: this.props.store.isGuest()
    });

    const hash = this.state.traitHash;

    // if they gave any review
    // if(Object.keys(hash).length > 0) 
    window.open('https://docs.google.com/forms/d/e/1FAIpQLScmmcorrmu2oO31_9-sU89S4BQXmjRlXvF7FasR_cw7NvxTCQ/viewform', '_blank');
    
    // If guest, just log them out now
    if(this.props.store.isGuest()) {
      console.log('no review');
      this.props.store.auth.logout();
      return;
    }
    // If other was guest, just go back to debate home
    if(this.props.store.debate.match!.otherState!.guest) {
      // this.props.store.auth.logout();
      console.log('no review as other account was guest');
      this.props.store.debate.resetQueue();
      this.props.store.gotoHomeMenu();
      return;
    }

    // TODO: update endpt w user selection, route back home
    const traitsObj = Object.keys(hash)
      .filter(k => hash[k])
      .reduce(
        (acc, x) => {
          (goodTraits.includes(x) ? acc.pos : acc.neg).push(x);
          return acc;
        },
        { pos: [] as string[], neg: [] as string[] }
      );

    const response = {
      traits: traitsObj,
      feedback: this.state.platformFeedback,
      agreement: this.state.agreed
    };
    console.log('responses', response);

    // TODO: call endpoint
    const r = await APIService.reviewSession(
      response,
      this.props.store.debate.match!.matchId
    );

    this.props.store.debate.resetQueue();
    this.props.store.gotoHomeMenu();
  };

  public render() {
    const { classes } = this.props;
    const traits = this.state.traitHash;
    return (
      <div className={classes.pagebody}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          className={classes.root}
        >
          <Paper>
            <Grid item className={classes.margin}>
            
            { this.state.agreed && 
                <Bounce top duration={900}><Typography
                component="span"
                variant="h5"
                color="textPrimary"
                style={{color:'#559955'}}
                className={classes.header}
            >
                    Congrats on finding common ground!
                </Typography></Bounce>

              }
              { !this.state.agreed && 
                <Reveal top duration={3000}><Typography
                component="span"
                variant="h5"
                color="textPrimary"
                style={{color:'#995555', fontSize: '1em'}}
                className={classes.header}
            >
                    Found no agreement? Try again with more <a href='https://medium.com/wikitribune/our-list-of-preferred-news-sources-c90922ba22ef' target='_blank'>debate preparation!</a>
                </Typography></Reveal>

              }
              
              <FormControlLabel
                control={
                  <Switch
                    classes={{
                      switchBase: classes.iOSSwitchBase,
                      bar: classes.iOSBar,
                      icon: classes.iOSIcon,
                      iconChecked: classes.iOSIconChecked,
                      checked: classes.iOSChecked,
                      root: classes.iOSRoot
                    }}
                    disableRipple
                    checked={this.state.agreed}
                    onChange={e =>
                      this.setState({ agreed: e.currentTarget.checked })
                    }
                    value="agreed"
                  />
                }
                label="Found an agreement?"
              />
              
              <Typography
                component="span"
                variant="h5"
                color="textPrimary"
                style={{ color: '#444444' }}
                className={classes.header}
              >
                Your partner was ...
              </Typography>
              {goodTraits.map((label, i) => {
                return (
                  <Chip
                    key={i}
                    icon={<FaceIcon />}
                    label={label}
                    className={classes.chip}
                    color={traits[label] ? 'primary' : 'default'}
                    onClick={() => this.handleChipClick(label)}
                    clickable
                  />
                );
              })}
              <br />
              {badTraits.map((label, i) => {
                return (
                  <Chip
                    key={i}
                    icon={<FaceIcon />}
                    label={label}
                    onClick={() => this.handleChipClick(label)}
                    className={classes.chip}
                    color={traits[label] ? 'primary' : 'default'}
                    clickable
                  />
                );
              })}
            </Grid>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={this.handleConfirm}
            >
              Confirm
            </Button>
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default inject('store')(HOC(DebateFeedback, styles));

/*
<Divider className={classes.margin} />
              <TextField
                variant="outlined"
                id="standard-dense"
                label="Platform Feedback"
                className={classes.textField}
                margin="dense"
                onChange={() => this.handleTextFieldChange}
              />
*/
