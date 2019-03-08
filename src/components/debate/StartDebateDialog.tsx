import React, { useState, useEffect, useContext } from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

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

import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
}));

interface Props {
  // fullScreen?: boolean;
  // error: string;
  open?: boolean;
  store: AppModel.Type;
}

export default withMobileDialog<Props>()(function StartDebateDialog(props) {
  const classes = useStyles({});
  const { t } = useTranslation();
  const store = props.store;
  const [state, setState] = useState({ closed: false });

  const onClose = () => {
    setState({ closed: true });
  };

  // const { fullScreen } = props;
  const debate = store.debate;
  if (!debate.match) return null;

  const isOpposite = debate.position !== debate.match!.otherState!.position;
  const info = TopicInfo.getTopic(debate.topic, t)!;
  const otherIsGuest = !!debate.match!.otherState!.guest;

  return (
    <Dialog
      open={state.closed !== true}
      fullScreen={props.fullScreen}
      onClose={() => null}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">Dinner is ready!</DialogTitle>
      <DialogContent>
        <Typography align="left">
          You're now talking LIVE to your match about:
        </Typography>
        <blockquote>
          "{info.proposition}"
          <br />
          <br />
          <Typography align="left">
            Your side: {info.positions[debate.position]} — Theirs:{' '}
            {info.positions[debate.match!.otherState!.position]}
          </Typography>
          <Typography align="left" variant="caption">
            {!isOpposite && (
              <>
                <i>
                  ^ No opposite found, so we've matched you with someone on the
                  same side. No XP will be earned for this round.
                </i>
              </>
            )}
          </Typography>
        </blockquote>
        <Typography align="left" variant="caption">
          {otherIsGuest && <>Note: your partner is using a guest account.</>}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          autoFocus
          variant="contained"
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
});
// export default withMobileDialog<Props>()(HOC(StartDebateDialog, styles));
// {otherIsGuest && !isOpposite && <br/>}
