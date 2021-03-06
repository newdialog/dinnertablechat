import { Card, CardActions, CardContent, Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles';
import DraftsIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import InboxIcon from '@material-ui/icons/MicRounded';
import { makeStyles } from'@material-ui/core/styles';
import classNames from 'classnames';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import AddToCalendar from 'react-add-to-calendar';
import * as TimeService from 'services/TimeService';

function getEvent() {
  console.log('TimeService.getDebateStart().toISOString()', TimeService.getDebateStart().toISOString());
  const _event = {
    title: 'Sample Event',
    description: 'This is the sample event provided as an example only',
    location: 'http://dinnertable.chat',
    startTime: TimeService.getDebateStart().toISOString(), // '2016-09-16T20:15:00-04:00',
    endTime: TimeService.getDebateEnd().toISOString() // '2016-09-16T21:45:00-04:00'
  }
  return _event;
}

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
  { name: 'SClosed' }
);

interface Props {
  store: AppModel.Type;
}

function ListItemLink(props: any) {
  return <ListItem button component="a" {...props} />;
}

export default function SClosedDialog(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();

  // state = { noop: false };

  const onFB = e => {
    window.trackOutboundLinkClick(
      'https://www.facebook.com/events/522239821514316/',
      true,
      true
    )(e);
  };

  const onStart = () => {
    props.store.debate.setCharacter(1);
  };

  const handleListItemClick = (e, index) => {
    console.log('index', index);
    if (index === 0) onFB(e);
    if (index === 1) onStart();
  };

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={0} justify="center">
        <Grid sm={10} md={10} lg={10} item>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <List component="nav">
                <ListItem
                  button
                  selected={false}
                  onClick={event => handleListItemClick(event, 0)}
                >
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Attend Facebook event" />
                </ListItem>
                <ListItem
                  selected={false}
                >
                  <AddToCalendar buttonLabel="Add next event to my calendar" event={getEvent()} displayItemIcons={false}/>
                </ListItem>

                <ListItem
                  button
                  selected={false}
                  onClick={event => handleListItemClick(event, 1)}
                >
                  <ListItemIcon>
                    <DraftsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Next week's question" />
                </ListItem>
              </List>
              <Divider />
            </CardContent>
            <CardActions style={{ justifyContent: 'center' }} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
