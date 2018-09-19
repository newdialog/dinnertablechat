import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import { observer } from 'mobx-react';
import * as QS from '../../services/QueueService';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20
    },
    centered: {
      marginTop: '60px',
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
@observer
class LoadingScene extends React.Component<Props,any> {
  constructor(props:any) {
    super(props)
  }

  private onMatched = (match:any) => {
    // TODO
    this.props.store.debate.createMatch(match);
  }
  
  public componentDidMount() {
    if(!this.props.store.auth.user || !this.props.store.auth.aws) throw new Error('user not logged in');
    if(!this.props.store.debate.topic || this.props.store.debate.contribution === -1) throw new Error('debate params not selected');

    const options = this.props.store.auth.aws!;
    QS.init(options);

    const topic = this.props.store.debate.topic;
    const position = this.props.store.debate.position;
    const contribution = this.props.store.debate.contribution;

    const sameUserSeed = Math.round(new Date().getTime() / 1000);
    const userid = this.props.store.auth.user!.email + '_' + sameUserSeed;
    QS.queueUp(topic, position, userid, contribution, this.onMatched);
  }

  public componentWillUpdate() {
    if(!!this.props.store.debate.match) {
      console.log('ready for matching')
    }
  }

  public componentDidUpdate() {
    if(!!this.props.store.debate.match) {
      console.log('ready for matching2')
    }
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
