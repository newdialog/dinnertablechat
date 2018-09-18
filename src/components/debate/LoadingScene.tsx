import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

import * as QS from '../../services/QueueService';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    centered: {
      paddingTop: '0',
      paddingLeft: '1em',
      paddingRight: '1em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    }
  })

import * as AppModel from '../../models/AppModel'
interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}
class LoadingScene extends React.Component<Props,any> {

  private onMatched = (match:any) => {
    // TODO
    this.props.store.debate.createMatch(match);
  }
  
  public componentDidMount() {
    // QS.queueUp(topic, side, playerId, donation, this.onMatched);
  }

  public componentWillUpdate() {
    
  }

  public render() {
    const store = this.props.store;
    const { classes } = this.props;

    const matchedUnsync = store.debate.match && !store.debate.match!.sync;
    const matchedsync = store.debate.match && store.debate.match!.sync;

    return (
      <div className={classes.centered}>
       <h1>Loading...</h1>
      { !store.debate.match && <h3>matching</h3> }
      { matchedUnsync && <h3>found match... handshaking</h3> }
      { matchedsync && <h3>found match and handshaking completed!</h3> }
      </div>
    );
  }
}
export default (withStyles(styles)(LoadingScene));
