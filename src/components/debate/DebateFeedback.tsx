import * as React from 'react';
import {
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import HOC from '../HOC';

import Lottie from 'react-lottie';
import { observer } from 'mobx-react';
import { Avatar, Button, Chip, Typography } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

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

class DebateFeedback extends React.Component<Props, any> {

    private handleChipClick() { // TODO: process chip selection
        return
    }

    private handleAgreed = () => { // TODO: process agreement response
        return
    }

    private handleDidntAgree = () => { // TODO: process agreement response
        return 
    }

    private handleConfirm = () => { // TODO: update endpt w user selection, route back home
        return
    }

    public render() {
        const { classes } = this.props; 
        return (
            <div className={classes.root}>
                <div className={classes.agreeContainer}>
                    <Typography
                        component="span"
                        variant="title"
                        color="textPrimary"
                        className={classes.header}
                    >
                        Did you find common ground?
                    </Typography>
                    <Button color="secondary" variant="outlined" className={classes.button} onClick={this.handleAgreed}>
                        Yes
                    </Button>
                    <Button color="secondary" variant="outlined" className={classes.button} onClick={this.handleDidntAgree}>
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
                                color="secondary"
                                onClick={this.handleChipClick}
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
                                onClick={this.handleChipClick}
                                className={classes.chip}
                                color="secondary"
                                clickable
                            />)
                    })}
                </div>
                <Button color="primary" variant="contained" className={classes.button} onClick={this.handleConfirm}>
                    Confirm
                </Button>
            </div>
        );
    }

}

export default HOC(DebateFeedback, styles);