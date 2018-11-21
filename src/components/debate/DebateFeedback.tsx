import * as React from 'react';
import {
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import HOC from '../HOC';

import { Button, Chip, Divider, Grid, Paper, TextField, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import APIService from '../../services/APIService';
const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 6,
      height: '100vh'
    },
    margin: {
      margin: theme.spacing.unit * 2,
    },
    button: {
      marginBottom: theme.spacing.unit * 2,
    },
    header: {
      position: 'relative',
      margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
    },
    chip: {
        margin: theme.spacing.unit,
        fontWeight: 'bold'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 320,
    },
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
    traitHash: { [key:string]:boolean },
    platformFeedback: '',
}

class DebateFeedback extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
        this.state = { traitHash: {}, platformFeedback: '' };
    }

    private handleChipClick(label: string) { 
        const traitHash = this.state.traitHash;
        traitHash[label] = !traitHash[label];
        this.setState({ traitHash })
    }

    private handleTextFieldChange(e: any) {
        this.setState({ platformFeedback: e.target.value });
    }

    public componentDidMount() {
        window.gtag('event', 'debate_feedback_page', {
            event_category: 'debate',
            non_interaction: true
        });
    }

    private handleConfirm = async () => { // TODO: update endpt w user selection, route back home
        const hash = this.state.traitHash;
        const selectedTraits:string[] = [];

        const traitsObj = Object.keys(hash).filter(k => hash[k]).reduce( (acc, x) => {
            (goodTraits.includes(x) ? acc.pos : acc.neg).push(x);
            return acc;
        }, { pos:[] as string[],neg:[] as string[] });

        const response = { traits: traitsObj, platformFeedback: this.state.platformFeedback }
        console.log('responses', response);
        // TODO: call endpoint

        const r = await APIService.reviewSession(response, this.props.store.debate.match!.matchId);
        
        window.gtag('event', 'debate_feedback_page_submit', {
            event_category: 'debate',
            non_interaction: true
        });

        this.props.store.debate.resetQueue();
        this.props.store.gotoHomeMenu();
    }

    public render() {
        const { classes } = this.props; 
        const traits = this.state.traitHash;
        return (
            <div>
            <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                className={classes.root}
                >
                <Paper>
                <Grid item className={classes.margin}>
                    <Typography
                        component="span"
                        variant="h6"
                        color="textPrimary"
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
                                color={traits[label] ? 'primary': 'default'}
                                onClick={() => this.handleChipClick(label)}
                                clickable
                            />)
                    })}
                    <br/>
                    {badTraits.map((label, i) => {
                        return (
                            <Chip
                                key={i}
                                icon={<FaceIcon />}
                                label={label}
                                onClick={() => this.handleChipClick(label)}
                                className={classes.chip}
                                color={traits[label] ? 'primary': 'default'}
                                clickable
                            />)
                    })}
                    <Divider className={classes.margin} />
                    <TextField
                        variant="outlined"
                        id="standard-dense"
                        label="Platform Feedback"
                        className={classes.textField}
                        margin="dense"
                        onChange={() => this.handleTextFieldChange}
                    />
                </Grid>
                <Button color="primary" variant="contained" className={classes.button} onClick={this.handleConfirm}>
                    Confirm
                </Button>
                </Paper>
                </Grid>
                </div>
        );
    }

}

export default inject('store')(HOC(DebateFeedback, styles));