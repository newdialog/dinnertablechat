import { Button, Chip, Grid, Paper, Typography } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Theme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FaceIcon from '@material-ui/icons/Face';
import { makeStyles } from'@material-ui/core/styles';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Bounce from 'react-reveal/Bounce';
import Reveal from 'react-reveal/Reveal';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';


import * as AppModel from '../../models/AppModel';
import {reviewSession} from '../../services/APIService';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(6),
    height: '100vh'
  },
  pagebody: {
    backgroundColor: theme.palette.primary.light
  },
  margin: {
    margin: theme.spacing(2)
  },
  button: {
    marginBottom: theme.spacing(2)
  },
  header: {
    position: 'relative',
    margin: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme
      .spacing(1) + 6}px`
  },
  chip: {
    margin: theme.spacing(1),
    fontWeight: 'bold'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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
}));

const goodTraits = ['Respectful', 'Knowledgeable', 'Charismatic']; // 'Open-minded', 'Concise'];
const badTraits = ['Absent', 'Aggressive', 'Crude', 'Interruptive'];
/*
* Rhetorician (consistently rated with positive traits)
* three different achievements for participating in 3, 5, 10 debates

Debate badges (debate session level):
* Good Citizen (good listener respectful, good host, kind)
* Fact Checker (fact provider, professor-like)
* Charismatic (convincing, rhetoric master)
*/

interface Props {
  store: AppModel.Type;
}

interface State {
  traitHash: { [key: string]: boolean };
  platformFeedback: '';
  agreed: boolean;
}

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);


export default function DebateFeedback(props: Props) {
  const store = useContext(AppModel.Context)!;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = useState({
    traitHash: {},
    platformFeedback: '',
    agreed: true
  });

  function handleChipClick(label: string) {
    const traitHash = state.traitHash;
    traitHash[label] = !traitHash[label];
    setState(p => ({ ...p, traitHash }));
  }

  function handleTextFieldChange(e: any) {
    setState(p => ({ ...p, platformFeedback: e.target.value }));
  }

  useEffect(() => {
    if(window.gtag) window.gtag('event', 'debate_feedback_page', {
      event_category: 'debate',
      guest: store.isGuest()
    });
    // setState(p => ({...p, agreed: store.debate.agreed || false }));
  }, []);

  const handleConfirm = async () => {
    if(window.gtag) window.gtag('event', 'debate_feedback_page_submit', {
      event_category: 'debate',
      guest: store.isGuest()
    });

    const hash = state.traitHash;

    // if they gave any review
    // if(Object.keys(hash).length > 0)
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLScmmcorrmu2oO31_9-sU89S4BQXmjRlXvF7FasR_cw7NvxTCQ/viewform',
      '_blank'
    );

    // ------
    // If guest, just log them out now
    if (store.isGuest()) {
      console.log('no review');
      // store.auth.logout();
      store.debate.resetQueue();
      store.gotoHomeMenu();
      return;
    }
    // If other was guest, just go back to debate home
    if (store.debate.match!.otherState!.guest) {
      // store.auth.logout();
      console.log('no review as other account was guest');
      store.debate.resetQueue();
      store.gotoHomeMenu();
      return;
    }
    // ------

    // TODO: update endpt w user selection, route back home
    const traitsObj = Object.keys(hash)
      .filter(k => hash[k])
      .reduce(
        (acc, x) => {
          (goodTraits.indexOf(x) > -1 ? acc.pos : acc.neg).push(x);
          return acc;
        },
        { pos: [] as string[], neg: [] as string[] }
      );

    const response = {
      traits: traitsObj,
      feedback: state.platformFeedback,
      agreement: state.agreed
    };
    console.log('responses', response);

    // TODO: call endpoint
    const r = await reviewSession(
      response,
      store.debate.match!.matchId
    );

    store.debate.resetQueue();
    store.gotoHomeMenu();
  };

  const traits = state.traitHash;
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
            {state.agreed && (
              <Bounce top duration={900}>
                <Typography
                  component="span"
                  variant="h5"
                  color="textPrimary"
                  style={{ color: '#559955' }}
                  className={classes.header}
                >
                  Congrats on finding common ground!
                </Typography>
              </Bounce>
            )}
            {!state.agreed && (
              <Reveal top duration={3000}>
                <Typography
                  component="span"
                  variant="h5"
                  color="textPrimary"
                  style={{ color: '#995555', fontSize: '1em' }}
                  className={classes.header}
                >
                  Found no agreement? Try again with more{' '}
                  <a
                    href="https://medium.com/wikitribune/our-list-of-preferred-news-sources-c90922ba22ef"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    debate preparation!
                  </a>
                </Typography>
              </Reveal>
            )}

      <FormControlLabel
              control={
                <GreenCheckbox
                  checked={state.agreed}
                  onChange={e => {
                    setState(p => ({ ...p, agreed: e.currentTarget.checked }));
                  }}
                  value="agreed"
                />
              }
              label="Found an agreement?"
            /><hr/><br/>

            <Typography
              component="span"
              variant="h5"
              color="textPrimary"
              style={{ color: '#444444' }}
              className={classes.header}
            >
              Your partner was ...
            </Typography><br/>
            {goodTraits.map((label, i) => {
              return (
                <Chip
                  key={i}
                  icon={<FaceIcon />}
                  label={label}
                  className={classes.chip}
                  color={traits[label] ? 'primary' : 'default'}
                  onClick={() => handleChipClick(label)}
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
                  onClick={() => handleChipClick(label)}
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
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Paper>
      </Grid>
    </div>
  );
}

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
