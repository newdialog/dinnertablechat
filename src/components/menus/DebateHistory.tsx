import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Chip, Grid, Typography, Paper, Divider } from '@material-ui/core';
import moment from 'moment';

import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import HOC, { Authed } from '../HOC';

import API from '../../services/APIService';
import { boolean } from 'mobx-state-tree/dist/internal';
import MD5 from 'md5';
import LinearProgress from '@material-ui/core/LinearProgress';
import Footer from '../home/Footer';
import Button from '@material-ui/core/Button';
import QueueIcon from '@material-ui/icons/QueuePlayNext'
import RateReview from '@material-ui/icons/RateReview';
import Subscribe from '../home/Subscribe';
// import * as serviceWorker from '../../serviceWorker';
import * as Times from '../../services/TimeService';
import DailyTimer from './DailyTimer';
import Info from '@material-ui/icons/Info';

const styles = theme =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing.unit * 5
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
      minWidth: '300px',
      minHeight: 'calc(100vh - 504px)'
    },
    stats: {
      textAlign:'right',
      [theme.breakpoints.down('xs')]: {
        textAlign:'center'
      }
    },
    headerContainer: {
      flexDirection: 'row',
      padding: '1em',
      backgroundColor: '#ddd'
    },
    name: {
      color: '#555555',
      fontWeight: 'bold',
      fontSize: '2.5em'
    },
    icon: {
      fontSize: 70
    },
    nameContainer: {
      flexDirection: 'column'
    },
    paper: {
      flexGrow: 1,
      padding: theme.spacing.unit * 2
    },
    paperimg: {
      height: '30%',
      //  width: '30%',
      margin: 'auto',
      display: 'block',
      justifyContent: 'left',
      alignItems: 'center',
      objectFit: 'contain'
    },
    nested: {
      paddingLeft: theme.spacing.unit * 4
    },
    chip: {
      margin: theme.spacing.unit,
      // background: 'linear-gradient(to right bottom, #ccc, #484965)',
      // color: 'white',
      // fontWeight: 'bold'
    },
    margin: {
      //margin: theme.spacing.unit * 2,
    },
    imgLink: {
      textDecoration: 'none',
      color: '#b76464'
    }
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  isTest?: boolean;
  t: any;
}
interface State {
  open: Array<boolean>;
  activeStep: number;
  achievements: Array<{ photo: string; text: string }>;
  data: any[];
  loggedIn: boolean;
  loaded: boolean;
  error: string | null;
}

const goodTraits = ['Respectful', 'Knowledgeable', 'Charismatic']; //'Open-minded', 'Concise'];
const badTraits = ['Absent', 'Aggressive', 'Crude', 'Interruptive'];
const badgeConfig = {
  Respectful: './imgs/badges/copbadge.png',
  Knowledgeable: './imgs/badges/openbook.png',
  Charismatic: './imgs/badges/lightbulb.png'
};
/*
* Rhetorician (consistently rated with positive traits)
* three different achievements for participating in 3, 5, 10 debates

Debate badges (debate session level):
* Good Citizen (good listener respectful, good host, kind)
* Fact Checker (fact provider, professor-like)
* Charismatic (convincing, rhetoric master)
*/

const achievements = [
  {
    photo: 'http://animatedviews.com/wp-content/uploads/2007/02/cap158.JPG',
    text: 'WELL READ'
  },
  {
    photo:
      'https://images.all-free-download.com/images/graphiclarge/four_colours_teamwork_hands_311362.jpg',
    text: 'TEAM PLAYER'
  }
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
      loggedIn: false,
      loaded: false,
      error: null,
    };
  }

  componentDidMount() {
    API.getScores().then(this.transformPayload).catch( (e)=> this.setState({loaded: true, error: e}));
    // serviceWorker.register(); // register here so that users can create an icon
  }

  handleClick = (i: number) => {
    let open = this.state.open;
    open[i] = !open[i];
    this.setState({ open });
  };

  renderAchievements = () => {
    console.log('ach', this.state.achievements);
    var view = this.state.achievements.forEach(item => (
      <React.Fragment>
        <Grid
          id="top-row"
          container
          spacing={16}
          justify="space-around"
          alignItems="center"
        >
          <Grid item xs={4}>
            <img src={item.photo} width={'100%'} height={'100%'} />
          </Grid>
          <Grid item xs={8}>
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {item.text}
            </Typography>
          </Grid>
        </Grid>
      </React.Fragment>
    ));
    return view;
  };

  private createAccordianFlags(data) {
    let flags: boolean[] = [];
    flags = data.map((x, i) => flags.push(false));
    return flags;
  }

  private transformUser(x: any) {
    return {
      topic: x.topic,
      date: this.transformDate(x.debate_created),
      userSide: this.transformSide(x.side),
      userCharacter: x.character,
      userReview: x.review,
      userAgree: x.aggrement
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
    return moment(timestamp).format('MMM DD, YYYY h:mma');
  }

  private transformSide(side: number) {
    return this.props.t('topic' + side + '-topic');
  }

  private transformPayload = payload => {
    let data = payload.history.filter(x => x.review !== null); // only sessions with ratings
    let dataHash = data.reduce((hash, x) => {
      // merge data per session from user and opponent
      if (!hash[x.debate_session_id]) hash[x.debate_session_id] = {};
      const val = hash[x.debate_session_id];

      hash[x.debate_session_id] =
        x.user_id === this.props.store.auth.user!.id
          ? { ...val, ...this.transformUser(x) }
          : { ...val, ...this.transformOpp(x) };
      return hash;
    }, {});

    const result = Object.keys(dataHash)
      .map(key => {
        // transform to array to render, +agreed, session_id
        const val = dataHash[key];
        val.debate_sesssion_id = key;
        val.agreed = val.userAgree && val.oppAgree ? 'Agreed' : 'Disagreed';
        // if (val.oppCharacter === undefined) delete dataHash[key]; // ensure reviews set for both
        console.log('val', val)
        return val;
      })
      .filter(x => x.oppReview && x.userReview); // ensure both rated

    const flags = this.createAccordianFlags(data);
    this.setState({ data: result, open: flags, loaded: true });
  };

  private showAchievements(classes) {
    return (<Paper className={classes.paper}>
          <Grid
            id="top-row"
            container
            spacing={16}
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={4}>
              <img
                src={
                  'http://animatedviews.com/wp-content/uploads/2007/02/cap158.JPG'
                }
                width={'100%'}
                height={'100%'}
              />
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="h4"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                {'WELL READ'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>)
  }

  private renderList = (classes, data) =>
    data.map((x, i) => (
      <div key={i}>
        <Paper className={classes.paper}>
          <Grid container spacing={16}>
            <Grid item sm={2} style={{textAlign: 'center'}}>
              <img src={characters[x.oppCharacter].url} width={'70%'} />
            </Grid>
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
                <Typography variant="h4" color="primary" align={'center'}>
                  {x.agreed}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <br />
          <Grid
            container
            spacing={16}
            justify="space-around"
            alignItems="center"
            className={classes.margin}
          >
            {x.oppReview.traits.pos &&
              x.oppReview.traits.pos.map((label, i) => {
                return <div style={{textAlign: 'center'}}>
                    <img key={i} src={badgeConfig[label]} alt={label} width="20%" />
                    <Typography>{label}</Typography>
                  </div>
              })}
            {x.oppReview.traits.neg &&
              x.oppReview.traits.neg.map((label, i) => {
                return <Typography style={{margin: 5}}>{label}</Typography>
                //return <Chip key={i} label={label} className={classes.chip} />;
              })}
          </Grid>
        </Paper>
        <div style={{ paddingBottom: '4em' }} />
      </div>
    ));

  //  VERT SEP: style={{ borderRight: '0.1em solid black', padding: '0.5em' }}
  public render() {
    /// console.timeEnd('AuthComp');
    const { classes, store } = this.props;
    if (store.auth.isNotLoggedIn) {
      store.router.push('/');
      return;
    }

    const numDebates = this.state.data.length;
    const m = 20;
    const xpPerLevel = 3 * m; // 60
    const startingXP = 10;
    const xpTotal = numDebates * m + startingXP;
    const xp = xpTotal % xpPerLevel;
    const level = Math.floor(xpTotal / xpPerLevel) + 1;
    const nextLevel = xpPerLevel;

    const timePlayed = numDebates * 15;

    const emailHash = MD5(store.auth.user!.email);

    // Level bar
    const normalise = value => ((value - 0) * 100) / (xpPerLevel - 0);

    const achievements = {
      participation: level
    }
    let title = "Beginner Apprentice";
    if(level > 3) title = "Traveling Journeyman";
    if(level > 6) title = "Experienced Rhetorician";
    if(level > 12) title = "Most Honorable Host";

    const debateOpen = Times.isDuringDebate();

    return (
      <React.Fragment>
      <div className={classes.centered}>
        <div className={classes.headerContainer}>
          <Grid
            id="top-row"
            container
            spacing={16}
            justify="space-around"
            alignItems="center"
          >
            <Grid item xs={6} sm={2}>
              <a href="https://gravatar.com" className={classes.imgLink}>
                <img
                  src={'https://www.gravatar.com/avatar/' + emailHash}
                  width="100%"
                />
              </a>
              <Typography
                variant="caption"
                align="center"
                color="textSecondary"
                gutterBottom
              >
                <a href="https://gravatar.com" className={classes.imgLink}>
                  Use Gravatar to Add/Update image
                </a><br />
                {store.auth.user!.email}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={7}>
              <Typography
                variant="h1"
                align="left"
                color="textPrimary"
                className={classes.name}
                gutterBottom
              >
                {this.props.store.auth.user!.name}
              </Typography>
              <Typography
                variant="body2"
                align="left"
                color="textSecondary"
                gutterBottom
                style={{fontWeight:'normal'}}
              >
                LEVEL {level}: {title}<br />
                XP {xp}/{nextLevel}
              </Typography>
              <LinearProgress variant="determinate" value={normalise(xp)} />
            </Grid>
            <Grid item xs={12} sm={3} className={classes.stats}>
              <Typography
                variant="h4"
                color="textPrimary"
                gutterBottom
              >
                {timePlayed} min
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                TIME PLAYED
              </Typography>
              <Typography
                variant="h4"
                color="textPrimary"
                gutterBottom
              >
                {numDebates || 'zero'}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                DEBATE SESSIONS
              </Typography>
            </Grid>
          </Grid>
        </div>

        <div style={{width:'100%', textAlign:'center', marginTop:'12px'}}>
        { (debateOpen || !store.isLive()) &&
          <Button variant="contained" color="primary" 
            onClick={ () => this.props.store.router.push('/quickmatch') }>
            Begin Dinner Party QuickMatch<br/>
            BETA v1.03
            <QueueIcon style={{marginLeft: '8px'}}></QueueIcon>
          </Button>
          
        }

        { (!debateOpen) &&
          <Button variant="contained" color="primary"
            onClick={ () => this.props.store.router.push('/') }>
            Dinner is finished.<br/> come back tomorrow!
          </Button>
        }

        <DailyTimer/>

        {this.state.data.length > 0 && <Typography variant="body1" style={{marginTop: 12}}>
          <a href="https://goo.gl/forms/TA1urn48JVhtpsO13" className={classes.imgLink} target="_blank">Have feedback on your experience? <RateReview style={{marginBottom:'-6px'}}/></a>
        </Typography>}
        </div>

        {false && this.showAchievements(classes)}

        <div style={{ paddingBottom: '4em' }} />

        {this.renderList(classes, this.state.data)}
        {this.state.data.length === 0 && (
          <Paper className={classes.paper}>
            <Typography
              variant="body2"
              align="center"
              color="textSecondary"
              style={{fontWeight: 'normal'}}
              gutterBottom
            >
            {!this.state.loaded && <b>Loading debate history...</b>}
            {this.state.loaded && <span>No debate history to list yet. <br/>
              Click QUICKMATCH button above to get started.</span>}
            </Typography>
          </Paper>
        )}

        
      </div>
      
      <Paper style={{width: '50vw', minWidth:'400px', margin:'30px auto 0 auto', padding: '6px 32px', backgroundColor:'#dcdcdc'}}>
        <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                gutterBottom
              >
          <Info style={{margin:'0px 3px -6px 0px',}}/><b>TIP</b><br/>It helps to prepare for debates using credible sources of information. <br/><a href='https://medium.com/wikitribune/our-list-of-preferred-news-sources-c90922ba22ef' target='_blank'>Here's our recommendations</a>.
          </Typography>
      </Paper>
      <Footer/>
      </React.Fragment>
    );
  }
}

export default inject('store')(HOC(Authed(Index), styles));

// <Subscribe offHome={true}/>