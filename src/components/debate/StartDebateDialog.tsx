import React from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import HOC from '../HOC';
import MenuHome from '../menus/MenuHome';
import * as AppModel from '../../models/AppModel';
import * as TopicInfo from '../../utils/TopicInfo';

const styles = theme =>
  createStyles({
    root: {
      justifyContent: 'center',
      display: 'flex'
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2
    },
    group: {
      margin: `${theme.spacing.unit}px 0`
    },
    label: {
      fontSize: '0.8em'
    }
  });

interface Props {
  fullScreen?: boolean;
  open?: boolean;
  store: AppModel.Type;
}

interface IProps extends WithStyles<typeof styles>, Props {
  // error: string;
  store: AppModel.Type;
  t: any;
}

class StartDebateDialog extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {}

  private onClose = () => {
    this.setState({ closed: true });
  };

  public render() {
    const { fullScreen, t, classes } = this.props;
    const debate = this.props.store.debate;
    if(!debate.match) return null;

    const isOpposite = debate.position !== debate.match!.otherState!.position;
    const info = TopicInfo.getTopic(debate.topic, t)!;
    const otherIsGuest = !!debate.match!.otherState!.guest;

    return (
      <Dialog
        open={this.state.closed!==true}
        fullScreen={false}
        onClose={() => null}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">Dinner is ready!</DialogTitle>
        <DialogContent>
          <Typography align="left">
            You're now talking LIVE to your match about:
          </Typography>
          <blockquote>"{info.proposition}"
          <br/><br/>
          <Typography align="left">
            Your side: {info.positions[debate.position]} — Theirs: {info.positions[debate.match!.otherState!.position]}
          </Typography>
          <Typography align="left" variant="caption">
            {!isOpposite && (
              <><i>
                ^ No opposite found, so we've matched you with someone on the same
                side. No XP will be earned for this round.
              </i></>
            )}
          </Typography>
          </blockquote>
          <Typography align="left" variant="caption">
            {otherIsGuest && <>Note: your partner is using a guest account.</>}
          </Typography>
   
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.onClose}
            color="secondary"
            autoFocus
            variant="contained"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withMobileDialog<Props>()(HOC(StartDebateDialog, styles));
// {otherIsGuest && !isOpposite && <br/>}
