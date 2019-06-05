import { Card, CardActions, CardContent, Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles';
import DraftsIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import InboxIcon from '@material-ui/icons/MicRounded';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from 'react-reveal/Reveal';

import * as AppModel from '../../../models/AppModel';
import SMicPermissionsBtn from '../../menus/MicPermissionsBtn';

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
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
      // padding: `${theme.spacing(4)}px 0`,
    },
    card: {
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: '300px',
      width: '50vw',
      maxWidth: '500px',
      height: '100%',
      textAlign: 'center',
      flexDirection: 'column',
      backgroundColor: '#eceadb'
    },
    cardMedia: {
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
                  <Reveal effect="fadeIn" duration={1000}><ListItemText style={{fontWeight:'bold'}} primary="Start debate" /></Reveal>
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
