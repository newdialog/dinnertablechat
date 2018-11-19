import * as React from 'react';
import {
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import HOC from '../HOC';

import { Avatar, Button, Chip, Grid, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import APIService from '../../services/APIService';
const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20,
    },
    traitContainer: {
        margin: theme.spacing.unit * 10,
    },
    button: {
        margin: theme.spacing.unit * 2,
    },
    header: {
        position: 'relative',
        margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
      },
    chip: {
        margin: theme.spacing.unit,
    },
});


const goodTraits = ['Respectful', 'Knowledgeable', 'Charismatic']; //'Open-minded', 'Concise'];
const badTraits = ['Absent', 'Aggressive', 'Crude', 'Interrupts'];
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
    traitHash: { [key:string]:boolean }
}

class DebateFeedback extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
        this.state = { traitHash: {} };
    }

    private handleChipClick(label: string) { 
        const traitHash = this.state.traitHash;
        traitHash[label] = !traitHash[label];
        this.setState({ traitHash })
    }

    private handleConfirm = async () => { // TODO: update endpt w user selection, route back home
        const hash = this.state.traitHash;
        const selectedTraits:string[] = [];
        for (const key in hash) {
            if (hash[key]) selectedTraits.push(key);
        }
        const response = { traits: selectedTraits }
        console.log('responses', response);
        // TODO: call endpoint

        const r = await APIService.reviewSession(response, this.props.store.debate.match!.matchId);
        
        this.props.store.debate.resetQueue();
        this.props.store.gotoHomeMenu();
    }

    public render() {
        const { classes } = this.props; 
        const traits = this.state.traitHash;
        return (
            <div className={classes.root}>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                >
                <div className={classes.traitContainer}>
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
                </div>
                <Button color="primary" variant="contained" className={classes.button} onClick={this.handleConfirm}>
                    Confirm
                </Button>
                </Grid>
            </div>
        );
    }

}

export default inject('store')(HOC(DebateFeedback, styles));