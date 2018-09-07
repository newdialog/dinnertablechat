import * as React from 'react';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import Lottie from 'react-lottie';
import { observer } from 'mobx-react';
import { Typography, Divider } from '@material-ui/core';

const logoData = require('../../assets/logo.json');

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridGap: `${theme.spacing.unit * 3}px`
      // gridAutoFlow: 'column',
      // gridAutoColumns: '200px'
    },
    centered: {
      marginTop: '60px',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '800px',
      minWidth: '300px'
    },
  });

import * as AppModel from '../../models/AppModel';
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}
interface State {
  open: boolean;
}

@observer
class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: false };
  }

  public render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <React.Fragment>
        <div className={classes.centered}>
            <Typography variant="display3" align="center">
              JOIN THE CONVERSATION
            </Typography>
            <Typography variant="display3" align="center">
              Debate home
            </Typography>
        </div>
      </React.Fragment>
    );
  }

  private handleClose = () => {
    this.setState({
      open: false
    });
  };

  private handleClick = () => {
    this.setState({
      open: true
    });
  };
}

export default withRoot(withStyles(styles)(Index));
