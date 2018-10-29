import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { CssBaseline, Grid, Typography, Paper, List, ListSubheader, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core'
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { AccountCircle, ExpandLess, ExpandMore, StarBorder } from '@material-ui/icons';

import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import HOC from '../HOC';

const styles = theme => 
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing.unit * 5,
    },
    headerContainer: {
      flexDirection: 'row',
      padding: theme.spacing.unit * 4,
      backgroundColor: '#ddd'
    },
    icon: {
      fontSize: 70,
    },
    nameContainer: {
      flexDirection: 'column',
    },
    nested: {
      paddingLeft: theme.spacing.unit * 4,
    },
  });


interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  isTest?: boolean;
}
interface State {
  open: boolean;
  activeStep: number,
}

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: true, activeStep: 0 };
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };


  //  VERT SEP: style={{ borderRight: '0.1em solid black', padding: '0.5em' }}
  public render() {
    const { classes, store } = this.props;
      return (
        <div className={classes.root}>
          <div className={classes.headerContainer}>
          <Grid id="top-row" container spacing={16} justify="space-around" alignItems="center">
              <Grid item xs={1}>
                <AccountCircle className={classes.icon} />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="display4" align="left" color="textPrimary" gutterBottom>
                  MYNAME
                </Typography>          
                <Typography variant="body2" align="left" color="textSecondary" gutterBottom>
                  10/150
                </Typography>
              </Grid>
              <Grid item xs={8}>
                  <Typography variant="h4" align="right" color="textPrimary" gutterBottom>
                    460 min
                  </Typography>  
                  <Typography variant="body2" align="right" color="textSecondary" gutterBottom>
                    TIME PLAYED
                  </Typography>  
                  <Typography variant="h4" align="right" color="textPrimary" gutterBottom>
                    15
                  </Typography> 
                  <Typography variant="body2" align="right" color="textSecondary" gutterBottom>
                    SESSIONS
                  </Typography>  
              </Grid>
          </Grid>
          </div>
            <div style={{ borderBottom: '0.1em solid #aaa' }} />
              <List
                component="nav"
                subheader={<ListSubheader component="div">List Items</ListSubheader>}
              >
              <ListItem button>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText inset primary="Sent mail" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText inset primary="Drafts" />
              </ListItem>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText inset primary="Inbox" />
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText inset primary="Starred" />
                  </ListItem>
                </List>
              </Collapse>
            </List>
        </div>   
      );
  }
}

export default inject('store')(HOC(Index, styles));
