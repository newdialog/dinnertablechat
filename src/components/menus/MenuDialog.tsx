import React from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import * as AppModel from '../../models/AppModel';
import HOC from '../HOC';
import MenuHome from './MenuHome';


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
  open?:boolean;
}

interface IProps extends WithStyles<typeof styles>, Props {
  // error: string;
  // store: AppModel.Type,
  
}

class MenuDialog extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    };
  }

  public componentDidMount() {

  }

  private onClose = () => {
    this.setState({'open':false})
  }
  
  public render() {
    const { classes } = this.props;
    const { fullScreen } = this.props;

    return (
      <Dialog
        open={true}
        fullScreen={fullScreen}
        onClose={()=>null}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">{'QuickMatch'}</DialogTitle>
        <DialogContent>
            <MenuHome/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary" autoFocus>
            CLOSE MENU
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withMobileDialog<Props>()(HOC(MenuDialog, styles, true));
