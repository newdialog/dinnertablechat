import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import {
  Chip,
  Grid,
  Typography,
  Paper,
  Divider,
  CardContent,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Collapse
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as AppModel from '../../models/AppModel';
import { inject } from 'mobx-react';
import HOC, { Authed } from '../HOC';

import API from '../../services/APIService';
import { boolean } from 'mobx-state-tree/dist/internal';
import MD5 from 'md5';
import LinearProgress from '@material-ui/core/LinearProgress';
import Footer from '../home/Footer';
import Button from '@material-ui/core/Button';
import QueueIcon from '@material-ui/icons/QueuePlayNext';
import RateReview from '@material-ui/icons/RateReview';
import Subscribe from '../home/Subscribe';
import * as Times from '../../services/TimeService';
import DailyTimer from './DailyTimer';
import Info from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import * as TopicInfo from '../../utils/TopicInfo';
import {
  TwitterShareButton,
  FacebookShareButton,
  TwitterIcon,
  FacebookIcon
} from 'react-share';
import AppFloatMenu from '../home/AppFloatMenu';

const styles = theme =>
  createStyles({
    pagebody: {
      backgroundColor: theme.palette.primary.light
    },
    centered: {
      marginTop: '0',
      paddingTop: theme.spacing.unit * 8,
      paddingLeft: '1em',
      paddingRight: '1em',
      paddingBottom: '4em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 'auto',
      maxWidth: '800px',
      minWidth: '300px',
      minHeight: 'calc(100vh - 504px)'
    },
    stats: {
      textAlign: 'right',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center'
      }
    },
    lstats: {
      fontSize: '1.1em',
      fontWeight: 500,
      color: '#ffffff',
    },
    lstatsLabel: {
      fontSize: '1.1em',
      fontWeight: 300,
      color: '#ffffff',
    },
    headerContainer: {
      flexDirection: 'row',
      padding: '1em',
      borderRadius: '2vh',
      backgroundColor: theme.palette.primary.dark,
      boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.28), 0px 1px 1px 0px rgba(0,0,0,0.2), 0px 2px 1px -1px rgba(0,0,0,0.2)'
      //backgroundColor: '#D2E5F5' // '#ddd'
    },
    name: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '2.5em'
    },
    nameSubstat: {
      color: '#ffffff',
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
      margin: theme.spacing.unit
      // background: 'linear-gradient(to right bottom, #ccc, #484965)',
      // color: 'white',
      // fontWeight: 'bold'
    },
    margin: {
      //margin: theme.spacing.unit * 2,
    },
    imgLink: {
      textDecoration: 'none',
      color: theme.palette.secondary.dark // '#b76464' // #ef5350
    },
    infoTip: {
      margin: '60px auto 0 auto',
      padding: '6px 32px',
      backgroundColor: theme.palette.secondary.light
    },
    media: {
      height: 0
      // paddingTop: '56.25%', // 16:9
    },
    actions: {
      display: 'flex'
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      }),
      marginLeft: 'auto',
      [theme.breakpoints.up('sm')]: {
        marginRight: -8
      }
    },
    expandOpen: {
      transform: 'rotate(180deg)'
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
  expanded?: number;
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
  trackHistoryTrigger = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      open: [],
      activeStep: 0,
      achievements,
      data: [],
      loggedIn: false,
      loaded: false,
      error: null
    };
    localStorage.removeItem('quickmatch'); // cancel quickmatch if nav here
  }

  componentDidMount() {
    window.gtag('event', 'history', {
      event_category: 'splash',
      first: !this.trackHistoryTrigger,
      guest: this.props.store.isGuest()
    });
    this.trackHistoryTrigger = true;

    if(this.props.store.isGuest()) return this.setState({ loaded: true });

    API.getScores()
      .then(this.transformPayload)
      .catch(e => {
        console.error(e);
        this.setState({ loaded: true, error: e })
      });
  }

  handleClick = (i: number) => {
    let open = this.state.open;
    open[i] = !open[i];
    this.setState({ open });
  };

  renderAchievements = () => {
    console.log('ach', this.state.achievements);
    var view = this.state.achievements.map((item, i) => (
      <Grid
        container
        spacing={16}
        justify="space-around"
        alignItems="center"
        key={i}
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
      created: x.debate_created,
      userSide: this.transformSide(x.topic, x.side),
      userCharacter: x.character,
      userReview: x.review,
      userAgree: x.review_aggrement
    };
  }

  private transformOpp(x: any) {
    return {
      date: this.transformDate(x.debate_created),
      oppAgree: x.review_aggrement,
      oppSide: this.transformSide(x.topic, x.side),
      oppCharacter: x.character,
      oppReview: x.review
    };
  }

  private transformDate(timestamp: number) {
    return moment(timestamp).format('MMM DD, YYYY h:mma');
  }

  private transformSide(topic: string, side: number) {
    return TopicInfo.getTopic(topic, this.props.t)!.positions[side];
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
    // console.log('data', dataHash);

    const result = Object.keys(dataHash)
      .map(key => {
        // transform to array to render, +agreed, session_id
        const val = dataHash[key];
        val.debate_sesssion_id = key;
        const iAgreed = val.userAgree !== undefined ? val.userAgree : true; // if you left no review, assume agreed
        val.agreed = iAgreed && val.oppAgree ? 'Agreed' : 'Disagreed';
        // if (val.oppCharacter === undefined) delete dataHash[key]; // ensure reviews set for both
        // console.log('val', val)
        return val;
      })
      .filter(x => !!x.oppReview); // ensure at least opposite rated  && x.userReview

    const flags = this.createAccordianFlags(data);
    result.sort((a, b) => {
      return a.created < b.created ? 1 : -1;
    });
    this.setState({ data: result, open: flags, loaded: true });
  };

  private showAchievements(classes) {
    return (
      <div className={classes.paper}>
        <Grid container spacing={16} justify="space-around" alignItems="center">
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
      </div>
    );
  }
  // <Typography variant="caption">Topic: <blockquote>"{TopicInfo.getTopic(x.topic, t)!.proposition}"</blockquote></Typography>
  private renderList = (classes, t, data) =>
    data.map((x, i) => (
      <div key={i}>
        <Card className={classes.paper}>
          <CardHeader
            color="secondaryText"
            avatar={
              <Avatar
                aria-label="Recipe"
                className={classes.avatar}
                style={{ width: '3em', height: '3em' }}
              >
                <img src={characters[x.oppCharacter].url} width={'150%'} />
              </Avatar>
            }
            title={
              <>
                <span style={{color: '#5d4444'}}>
                  <span className="nowrap" style={{fontWeight:500}}>{x.userSide}</span><> vs </>
                  <span className="nowrap"style={{fontWeight:500}}> {x.oppSide}:</span><> </>
                </span>
                <span
                  style={{ fontWeight:500, color: x.agreed === 'Agreed' ? 'green' : 'red' }}
                >
                  <span className="nowrap"> {x.agreed === 'Agreed' ? 'Found Agreement' : 'No agreement'} </span>
                </span>
              </>
            }
            subheader={
              <>
                {x.date}
              </>
            }
          />
          <CardMedia
            className={classes.media}
            image={characters[x.oppCharacter].url}
            title={'My position: ' + x.userSide}
          />

          <CardContent style={{ paddingBottom: '0px' }}>
            <Typography variant="caption" align="center">You were rated as:</Typography>
            <Grid
              container
              spacing={0}
              justify="space-around"
              alignItems="center"
              className={classes.margin}
            >
              {x.oppReview.traits.pos &&
                x.oppReview.traits.pos.map((label, i2) => {
                  return (
                    <Grid xs={6} sm={4} item key={i2} style={{ textAlign: 'center' }}>
                      <img
                        key={i2}
                        src={badgeConfig[label]}
                        alt={label}
                        width="15%"
                      />
                      <Typography>{label}</Typography>
                    </Grid>
                  );
                })}
              {x.oppReview.traits.neg &&
                x.oppReview.traits.neg.map((label, i2) => {
                  return (
                    <Grid item xs={6} sm={4} key={i2} style={{ textAlign: 'center' }}>
                      <Typography key={i2} style={{ margin: 5 }}>
                        {label}
                      </Typography>
                    </Grid>
                  );
                  // return <Chip key={i} label={label} className={classes.chip} />;
                })}
            </Grid>
            <br />
            <Divider />
            <CardActions className={classes.actions} disableActionSpacing>
            {x.oppReview.traits.pos.length > 0 && (
              <>
                <IconButton aria-label="Share"><TwitterShareButton
                  url={'https://dinnertable.chat'}
                  title={`I've debated with my political opposite and was rated: ${x.oppReview.traits.pos.join(
                    ', '
                  )}`}
                  className="share-button"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton></IconButton>
                <IconButton aria-label="Share"><FacebookShareButton
                  url={'https://dinnertable.chat'}
                  quote={`I've debated with my political opposite and was rated: ${x.oppReview.traits.pos.join(
                    ', '
                  )}`}
                  className="share-button"
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton></IconButton>
              </>
            )}
              
              <IconButton
                className={ this.state.expanded===i ? classes.expandOpen : null}
                onClick={this.handleExpandClick.bind(this, i)}
                aria-expanded={this.state.expanded===i}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
          </CardActions>
            
          </CardContent>

          <Collapse in={this.state.expanded===i} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Debate Question:</Typography>
            <Typography paragraph>
              {TopicInfo.getTopic(x.topic, t)!.proposition}
            </Typography>
          </CardContent>
        </Collapse>
        </Card>
        <div style={{ paddingBottom: '3em' }} />
      </div>
    ));

    signOutGuest = (e:any) => {
      e.preventDefault();
      window.gtag('event', 'guest_signup_click', {
        event_category: 'splash'
      });
      // this.props.store.router.push('/home');
      this.props.store.auth.logout();
      this.props.store.auth.login()
      //setTimeout( this.props.store.auth.login, 5000);
      return true;
    }

    handleExpandClick = (i) => {
      if(this.state.expanded===i) return this.setState({ expanded: undefined });
      this.setState({ expanded: i });
    };
  //  VERT SEP: style={{ borderRight: '0.1em solid black', padding: '0.5em' }}
  public render() {
    /// console.timeEnd('AuthComp');
    const { classes, store, t } = this.props;
    if (store.auth.isNotLoggedIn) {
      store.router.push('/');
      return;
    }

    const numDebates = this.state.data.length;
    const m = 20;
    const xpPerLevel = 3 * m; // 60
    const startingXP = 0;
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
    };
    let title = 'Beginner Apprentice';
    if (level > 3) title = 'Traveling Journeyman';
    if (level > 6) title = 'Experienced Rhetorician';
    if (level > 12) title = 'Most Honorable Host';

    const debateOpen = Times.isDuringDebate();

    return (
      <div className={classes.pagebody}>
        <div className={classes.centered}>
          <div className={classes.headerContainer}>
          { store.isGuest() && 
            <>
            <Button style={{marginTop:'1vh', marginLeft: '12px', float:'right'}} onClick={this.signOutGuest} variant="contained" color="secondary" size="large">Signup now
             </Button>
            <Typography
            variant="h1"
            align="left"
            color="textPrimary"
            className={classes.name}
            gutterBottom
            style={{ fontSize: '1.25em' }}
          >
            <Info style={{ margin: '0px 3px -6px 0px' }} /> Temporary guest account
          </Typography>
          <Typography
                  variant="body2"
                  align="left"
                  color="textPrimary"
                  gutterBottom
                  className={classes.nameSubstat}
                  style={{ fontWeight: 'normal', fontSize: '1em' }}
                >
                  Guests can join others in matchmaking but will <b> not gain</b> xp/levels or any of the member perks. Registered users also have priority in matchmaking. Please signup to start building your character!
          </Typography>
          </>
          }
          </div><br/>
          <div className={classes.headerContainer}>
          {  
            <Grid
              container
              spacing={16}
              justify="space-around"
              alignItems="center"
            >
              <Grid item xs={12} sm={9}>
                <Typography
                  variant="h1"
                  align="left"
                  color="textPrimary"
                  className={classes.name}
                  gutterBottom
                  style={{ fontSize: '1.25em' }}
                >
                  {this.props.store.auth.user!.name}
                </Typography>
                <Typography
                  variant="body2"
                  align="left"
                  color="textPrimary"
                  gutterBottom
                  className={classes.nameSubstat}
                  style={{ fontWeight: 'normal', fontSize: '1em' }}
                >
                  LEVEL {level}: {title}
                  <br />
                  XP {xp}/{nextLevel}
                </Typography>
                <LinearProgress
                  color="secondary"
                  variant="determinate"
                  value={normalise(xp)}
                />
              </Grid>
              <Grid item xs={12} sm={3} className={classes.stats}>
                <Typography
                  variant="h4"
                  color="textPrimary"
                  gutterBottom
                  className={classes.lstats}
                >
                  {timePlayed} min
                </Typography>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  gutterBottom
                  className={classes.lstatsLabel}
                >
                  TIME PLAYED
                </Typography>
                <Typography
                  variant="h4"
                  color="textPrimary"
                  gutterBottom
                  className={classes.lstats}
                >
                  {numDebates || 'zero'}
                </Typography>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  gutterBottom
                  className={classes.lstatsLabel}
                >
                  DEBATE SESSIONS
                </Typography>
              </Grid>
            </Grid>
          }
          </div>

          <div
            style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}
          >
            <Grid
              container
              spacing={0}
              justify="space-around"
              alignItems="center"
            >
              
              {(debateOpen || !store.isLive()) && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ padding: '1em' }}
                    onClick={() => this.props.store.router.push('/quickmatch')}
                  >
                    Begin Dinner Party QuickMatch! <QueueIcon style={{marginLeft:'5px'}}/>
                  </Button>
                </Grid>
              )}

              {!debateOpen && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => this.props.store.router.push('/')}
                  >
                    Dinner is finished.
                    <br /> come back next time!
                  </Button>
                </Grid>
              )}

              <Grid item xs={12}>
              <br /><DailyTimer />
              </Grid>
            </Grid>

            <br />
            
          </div>

          {false && this.showAchievements(classes)}

          <div style={{ paddingBottom: '1em' }} />

          {this.renderList(classes, t, this.state.data)}
          {this.state.data.length === 0 && (
            <Paper className={classes.paper}>
              <Typography
                variant="body2"
                align="center"
                color="textSecondary"
                style={{ fontWeight: 'normal' }}
                gutterBottom
              >
                {!this.state.loaded && <b>Loading debate history...</b>}
                {this.state.loaded && (
                  <span>
                    No debate history to list yet. <br />
                    Click QUICKMATCH button above to get started.
                  </span>
                )}
              </Typography>
            </Paper>
          )}

<Paper className={classes.infoTip}>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            <Info style={{ margin: '0px 3px -6px 0px' }} />
            <b>TIP</b>
            <br />
            It helps to prepare for debates using credible sources of
            information. <br />
            <a
              href="https://medium.com/wikitribune/our-list-of-preferred-news-sources-c90922ba22ef"
              target="_blank"
              rel="noopener"
            >
              Here's our recommendations
            </a>
            .
          </Typography>
        </Paper>
        </div>

        
        
        <Footer forceShow={true} /><AppFloatMenu />
      </div>
    );
  }
  // backgroundColor:'#dcdcdc'
}

export default inject('store')(HOC(Authed(Index), styles));

// <Subscribe offHome={true}/>
// <Typography align="right" variant="caption">Share your experience:</Typography>
/*
<Typography variant="body1" style={{ marginTop: 12 }}>
              <a
                href="https://goo.gl/forms/TA1urn48JVhtpsO13"
                className={classes.imgLink}
                target="_blank"
              >
                Have feedback on your experience?{' '}
                <RateReview style={{ marginBottom: '-6px' }} />
              </a>
            </Typography>
*/