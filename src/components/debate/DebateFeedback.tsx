import * as React from 'react';
import {
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import HOC from '../HOC';

import { Avatar, Button, Chip, Grid, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20,
    },
    agreeContainer: {
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


const goodTraits = ['Articulate', 'Funny', 'Helpful', 'Insightful', 'Logical', 'Open-minded', 'Well-read'];
const badTraits = ['Aggressive', 'Arrogant', 'Crude', 'Ignorant', 'Interrupts', 'Logical fallacies'];

interface Props extends WithStyles<typeof styles> {
    // store: AppModel.Type;
  }

interface State {
    traitHash: { [key:string]:boolean }
    agreed: string,
}

class DebateFeedback extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
        this.state = { traitHash: {}, agreed: 'na' };
    }

    private handleChipClick(label: string) { 
        const traitHash = this.state.traitHash;
        traitHash[label] = !traitHash[label];
        this.setState({ traitHash })
    }

    private handleAgreed = () => {
        this.setState({ agreed: 'yes' });
    }

    private handleDidntAgree = () => {
        this.setState({ agreed: 'no' });
    }

    private handleConfirm = () => { // TODO: update endpt w user selection, route back home
        const hash = this.state.traitHash;
        const selectedTraits = [];
        for (const key in hash) {
            // if (hash[key]) selectedTraits.push(key);
        }
        const response = { agreed: this.state.agreed, selectedTraits }
        console.log('responses', response);
    }

    public render() {
        const { classes } = this.props; 
        const { agreed } = this.state;
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
                <div className={classes.agreeContainer}>
                    <Typography
                        component="span"
                        variant="title"
                        color="textPrimary"
                        className={classes.header}
                    >
                        Did you find common ground?
                    </Typography>
                    <Button variant="contained" className={classes.button} onClick={this.handleAgreed}
                            color={ (agreed === 'yes') ? 'primary': 'default' }>
                        Yes
                    </Button>
                    <Button variant="contained" className={classes.button} onClick={this.handleDidntAgree}
                            color={ (agreed === 'no') ? 'primary': 'default' }>
                        No
                    </Button>
                </div>
                <div className={classes.traitContainer}>
                    <Typography
                        component="span"
                        variant="title"
                        color="textPrimary"
                        className={classes.header}
                    >
                        Positive Traits
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
                </div>
                <div className={classes.traitContainer}>
                    <Typography
                        component="span"
                        variant="title"
                        color="textPrimary"
                        className={classes.header}
                    >
                        Negative Traits
                    </Typography>
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
                <Button color="secondary" variant="contained" className={classes.button} onClick={this.handleConfirm}>
                    Confirm
                </Button>
                </Grid>
            </div>
        );
    }

}

export default HOC(DebateFeedback, styles);