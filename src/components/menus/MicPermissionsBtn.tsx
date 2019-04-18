import React, { useEffect, useState } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { Button, Chip, Paper, Typography } from '@material-ui/core';
import * as AppModel from '../../models/AppModel';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';
import * as TopicInfo from '../../utils/TopicInfo';
import getMedia from '../../utils/getMedia';
import Info from '@material-ui/icons/Info';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

interface Props {
  store: AppModel.Type;
  className?: string;
}

// let attempt = 0;
let mutex = false;
export default observer(function CharacterSelector(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();

  const enabled = store.micAllowed;

  const [state, setState] = useState({ status: 'unknown' });

  useEffect(() => {
    mutex = false;
    micGrant();
  }, []);

  const micGrant = (e?: any) => {
    // attempt++;
    // const thisAttempt = attempt;
    if(mutex) return;
    mutex = true;
    getMedia(null, 30000)
      .then(media => {
        mutex = false;
        // setState(true);
        // console.log('set allowed');
        if (!enabled) store.setMicAllowed(true);
        media.getTracks().forEach(track => track.stop());
      })
      .catch(() => {
        mutex = false;
        // console.log('set disallowed'); // , thisAttempt, attempt);
        if(enabled) return;
        store.setMicAllowed(false);
        setState({ status: 'failed' });
        setTimeout(micGrant, 2000);
      });
  };

  return (
    <>
      <Button
        disabled={enabled}
        variant="contained"
        color="secondary"
        onClick={micGrant}
        className={props.className || ''}
        style={{
          backgroundColor: '#e0e0e0',
          marginRight: '12px',
          color: !enabled ? '#ff3900' : '#37b8cb'
        }}
      >
        {!enabled && <Info style={{ margin: '0px 3px 0px 0px' }} />}
        {!enabled ? 'Grant Microphone Access' : 'microphone enabled'}
      </Button>
      {!enabled && state.status === 'failed' && (
        <>
          <br />
          <b style={{color:'white'}}>Unable to enable microphone. Ensure that you have allowed browser access
          to your audio and that no other application is using it.</b>
        </>
      )}
    </>
  );
});
