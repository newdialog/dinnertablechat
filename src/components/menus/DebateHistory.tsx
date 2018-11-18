import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { CssBaseline, Grid, Typography, Paper, List, ListSubheader, ListItem, ListItemIcon, ListItemText, Collapse, Avatar } from '@material-ui/core'
import { AccountCircle, ExpandLess, ExpandMore, StarBorder } from '@material-ui/icons';
import moment from 'moment';

import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import HOC from '../HOC';

import API from '../../services/APIService'; 
import { boolean } from 'mobx-state-tree/dist/internal';

  // TODO refactor
  // 

const styles = theme =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing.unit * 5,
    },
    centered: {
      marginTop: theme.spacing.unit * 5,
      paddingTop: '0',
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingBottom: '4em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '1000px',
      minWidth: '300px'
    },
    headerContainer: {
      flexDirection: 'row',
      padding: '1em',
      backgroundColor: '#ddd'
    },
    icon: {
      fontSize: 70,
    },
    nameContainer: {
      flexDirection: 'column',
    },
    paper: {
      flexGrow: 1,
      padding: theme.spacing.unit * 2,
    },
    paperimg: {
      height: '30%',
     //  width: '30%',
      margin: 'auto',
      display: 'block',
      justifyContent: 'left',
      alignItems: 'center',
      objectFit: 'contain',
    },
    nested: {
      paddingLeft: theme.spacing.unit * 4,
    },
  });


interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  isTest?: boolean;
  t: any,
}
interface State {
  open: Array<boolean>;
  activeStep: number,
  achievements: Array<{ photo: string, text: string }>,
  data: any[],
  loggedIn: boolean
}

const achievements = [
  { 'photo': 'http://animatedviews.com/wp-content/uploads/2007/02/cap158.JPG', 'text': 'WELL READ' },
  { 'photo': 'https://images.all-free-download.com/images/graphiclarge/four_colours_teamwork_hands_311362.jpg', 'text': 'TEAM PLAYER' },
];

const characters = [
  { key: 0, title: 'Tracy', value: 0, url: './imgs/04-select.png' },
  { key: 1, title: 'Riley', value: 1, url: './imgs/04-select2.png' },
  { key: 2, title: 'Finley', value: 2, url: './imgs/04-select3.png' }
]; // TODO: refactor into one resource file: also ref'd in CharacterSelection

class Index extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    this.state = {
      open: [],
      activeStep: 0,
      achievements,
      data: [],
      loggedIn: false
    };
  }

  componentDidMount() {
    console.log('store', this.props.store.auth);
    console.log('predicate', this.props.store.auth.loggedIn, this.state.loggedIn);
    
  }

  handleClick = (i:number) => {
    let open = this.state.open;
    open[i] = !open[i];
    this.setState({ open });
  };

  renderAchievements = () => {
    console.log('ach',this.state.achievements);
    var view = this.state.achievements.forEach(item => (
        <React.Fragment>
          <Grid id="top-row" container spacing={16} justify="space-around" alignItems="center">
            <Grid item xs={4}>
              <img src={item.photo} width={'100%'} height={'100%'} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                {item.text}
              </Typography>
            </Grid>
          </Grid>
        </React.Fragment>
    ));
    return view;
  }

  private createAccordianFlags(data) {
    let flags : boolean[] = [];
    flags = data.map((x, i) => flags.push(false))
    return flags;
  }

  private transformUser(x: any) {
    return {
      topic: x.topic,
      date: this.transformDate(x.debate_created),
      userSide: this.transformSide(x.side),
      userCharacter: x.character,
      userReview: x.review,
      userAgree: x.aggrement,
    };
  }

  private transformOpp(x: any) {
    return {
      oppAgree: x.aggrement,
      oppSide: this.transformSide(x.side),
      oppCharacter: x.character,
      oppReview: x.review
    };
  }

  private transformDate(timestamp: number) {
    return moment(timestamp).format("MMM DD, YYYY h:mma");
  }

  private transformSide(side: number) {
    return this.props.t('topic' + side + '-topic')
  }

  private transformPayload = (payload) => {
    let data = payload.history.filter(x => x.review !== null); // only sessions with ratings
    let dataHash = data.reduce((hash, x) => { // merge data per session from user and opponent
      if(!hash[x.debate_session_id]) hash[x.debate_session_id] = {};
      const val = hash[x.debate_session_id];
      
      hash[x.debate_session_id] = (x.user_id === this.props.store.auth.user!.id) ? 
        {...val, ...this.transformUser(x)} : 
        {...val, ...this.transformOpp(x)};
      return hash;
    }, {});
    
    const result = Object.keys(dataHash).map(key => { // transform to array to render, +agreed, session_id
      const val = dataHash[key];
      val.debate_sesssion_id = key;
      val.agreed = (val.userAgree && val.oppAgree) ? 'Agreed' : 'Disagreed';
      if (val.oppCharacter === undefined) delete dataHash[key]; // ensure reviews set for both
      return val;
    })

    const flags = this.createAccordianFlags(data);
    this.setState({ data: result, open: flags });
  }

  private renderList = (classes) => this.state.data.map((x, i) => 
      (<div key={i}>
        <Paper className={classes.paper}>
          <Grid container spacing={16}>
            <Grid item xs={2}><img src={characters[x.oppCharacter].url} width={'50%'} /></Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={16}>
                <Grid item xs>
                  <Typography gutterBottom variant="h4" color="textPrimary">
                      {characters[x.oppCharacter].title}
                    </Typography>
                    <Typography gutterBottom>{x.date}</Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="h4" color="textSecondary" align={'center'}>{x.agreed}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid id="top-row" container spacing={16} justify="space-around" alignItems="center">
            <Grid item xs={2}><img src="./imgs/04-select.png" width={'100%'} height={'100%'} /></Grid>
            <Grid item xs={2}><img src="./imgs/04-select2.png" width={'100%'} height={'100%'} /></Grid>
            <Grid item xs={2}><img src="./imgs/04-select3.png" width={'100%'} height={'100%'} /></Grid>
            <Grid item xs={2}><img src="./imgs/04-select.png" width={'100%'} height={'100%'} /></Grid>
          </Grid>
        </Paper>
        <div style={{ paddingBottom: '4em' }} />
      </div>
      )
    );
  

  //  VERT SEP: style={{ borderRight: '0.1em solid black', padding: '0.5em' }}
  public render() {
    const { classes, store } = this.props;
    if(store.auth.isNotLoggedIn) {
      store.router.push('/');
      return;
    }

    if(store.auth.loggedIn!==this.state.loggedIn) {
      if(store.auth.loggedIn) API.getScores().then(this.transformPayload);
      setTimeout(()=> {
        this.setState({loggedIn: store.auth.loggedIn});
      }, 10);
    }

    console.log('data', this.state.data);

    return (
      <div className={classes.centered}>
        <div className={classes.headerContainer}>
          <Grid id="top-row" container spacing={16} justify="space-around" alignItems="center">
            <Grid item xs={1}>
              <AccountCircle className={classes.icon} />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h1" align="left" color="textPrimary" gutterBottom>
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

        <Paper className={classes.paper}>
          <Grid id="top-row" container spacing={16} justify="space-around" alignItems="center">
              <Grid item xs={4}>
                <img src={'http://animatedviews.com/wp-content/uploads/2007/02/cap158.JPG'} width={'100%'} height={'100%'} />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                  {'WELL READ'}
                </Typography>
              </Grid>
          </Grid>
        </Paper>

        <div style={{ paddingBottom: '4em' }} />

        {this.renderList(classes)} 
      </div>
    );
  }
}

export default inject('store')(HOC(Index, styles));
