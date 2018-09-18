import * as React from 'react';
import classNames from 'classnames';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Chip, Paper, Typography } from '@material-ui/core'
import withRoot from '../../withRoot';
import { observer } from 'mobx-react';
import * as AppModel from '../../models/AppModel';

// const logoData = require('../../assets/logo.json');

const styles = theme => 
  createStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
      },
      button: {
        margin: theme.spacing.unit / 2,
      },
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}


@observer
class ContributionSelector extends React.Component<Props> {

  private defaultContributions():Array<{ key:any, label:any, value:any, color:any }> {
    return [
        { key: 0, label: 'free', value: 0, color: 'default' },
        { key: 1, label: '$1.50', value: 1.50, color: 'default' },
        { key: 2, label: '$5.00', value: 5.00, color: 'default' }
      ];
  }

  private onChipClick(item: any) {
    this.props.store.debate.setContribution(item.value)
    // this.contributions = this.defaultContributions() // reset
    // this.contributions[item.key].color = 'primary' // update prop
    // console.log(this.contributions)
  }

  public render() {
    const { classes, store } = this.props;
    const selected = store.debate.contribution;

    const contrib = this.defaultContributions()
    if(selected!==-1) {
        contrib.forEach( (e) => {
            if(e.label=== selected) e.color = 'primary';
        })
    }

  return (
    <div>
        <Paper className={classes.root}>
        {contrib.map(item => {
          return (
            <Chip
                key={item.key}
                label={item.label}
                color={item.color}
                onClick={() => this.onChipClick(item)}
                className={classes.button}
                clickable
            />
          );
        })}
      </Paper>
    </div>
  );
  }
}
{/* <Button key={item.key} variant="outlined" size="small" color="primary" 
className={classes.button} onClick={() => this.onChipClick(item)}>
{item.label.valueOf()}
</Button> */}

export default withRoot(withStyles(styles)(ContributionSelector));
