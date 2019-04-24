import React, {useState} from 'react';
import classNames from 'classnames';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@material-ui/core';
import * as AppModel from '../../../models/AppModel';
import * as TopicInfo from '../../../utils/TopicInfo';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import InboxIcon from '@material-ui/icons/MicRounded';
import DraftsIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import SMicPermissionsBtn from '../../menus/MicPermissionsBtn';
import { observer } from 'mobx-react-lite';

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
        // width: 1100,
        // marginLeft: 'auto',
        // marginRight: 'auto',
      }
    },
    btn: {
      marginLeft: '1.5em',
      width: '8em'
      // color: theme.palette.secondary.main
    },
    cardGrid: {
      // padding: `${theme.spacing.unit * 4}px 0`,
    },
    card: {
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: '300px',
      width: '50vw',
      maxWidth: '500px',
      height: '100%',
      textAlign: 'center',
      // display: 'flex',
      flexDirection: 'column'
      // width: '100%'
      // width:'auto!important'
    },
    cardMedia: {
      /// paddingTop: '44.25%' // 16:9
    },
    cardContent: {
      flexGrow: 1
    },
    imgLink: {
      textDecoration: 'none'
    }
  }),
  { withTheme: true, name: 'PositionSelector' }
);

interface Props {
  store: AppModel.Type;
}

function ListItemLink(props:any) {
  return <ListItem button component="a" {...props} />;
}

export default observer(function SMicSelector(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();

  const [state, setState] = useState({checkMic:false});

  // state = { noop: false };

  const onMic = () => {
    setState({checkMic: true});
  };

  const onStart = () => {
    props.store.debate.setCharacter(1);
  };

  const handleListItemClick = (e, index) => {
    console.log('index', index);
    if(index===0) onMic();
    if(index===1) onStart();
  }

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={0} justify="center">
        <Grid sm={10} md={10} lg={10} item>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <List component="nav">
              { !store.micAllowed && <ListItem button
                selected={false}
                onClick={event => handleListItemClick(event, 0)}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Allow microphone" />
                </ListItem>}
                {store.micAllowed && <ListItem button selected={false}
                onClick={event => handleListItemClick(event, 1)}
                >
                  <ListItemIcon>
                    <DraftsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Start debate" />
                </ListItem>}
              </List>
              <div style={{paddingTop:'2em'}}/>
              { state.checkMic && <SMicPermissionsBtn store={store}/> }
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }}>
              
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
});

/*
<CardMedia
className={classes.cardMedia}
// image={card.photo}
title={card.topic}
/>
*/
