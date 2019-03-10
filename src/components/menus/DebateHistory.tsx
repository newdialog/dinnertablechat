import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {
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
import Button from '@material-ui/core/Button';
import Info from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import * as AppModel from '../../models/AppModel';
// import HOC, { Authed } from '../HOC';
// TODO: ADD AUTH CHECK
import * as TopicInfo from '../../utils/TopicInfo';
import API from '../../services/APIService';

import moment from 'moment';
import { inject } from 'mobx-react';
import MD5 from 'md5';

import {
  TwitterShareButton,
  FacebookShareButton,
  TwitterIcon,
  FacebookIcon
} from 'react-share';
import { url } from 'inspector';

import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  pagebody: {
    // backgroundImage: `url(${'./imgs/woodgrain.jpg'})`,
    // backgroundPosition: 'center',
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat'
    background: '#ddd1bb'
    //backgroundColor: theme.palette.primary.light
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
  headerContainer: {
    flexDirection: 'row',
    padding: '1em',
    borderRadius: '2vh',
    backgroundColor: theme.palette.primary.light,
    boxShadow:
      '0px 1px 3px 0px rgba(0,0,0,0.28), 0px 1px 1px 0px rgba(0,0,0,0.2), 0px 2px 1px -1px rgba(0,0,0,0.2)'
  },
  name: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '2.5em'
  },
  nameSubstat: {
    color: '#ffffff'
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
  imgLink: {
    textDecoration: 'none',
    color: theme.palette.secondary.dark // '#b76464' // #ef5350
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
}));

interface Props {
  store: AppModel.Type;
  isTest?: boolean;
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

let trackHistoryTrigger = false; // refactor
export default function DebateHistory(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    open: [],
    activeStep: 0,
    achievements,
    data: [],
    loggedIn: false,
    loaded: false,
    error: null
  });

  useEffect(() => {
    localStorage.removeItem('quickmatch'); // cancel quickmatch if nav here

    window.gtag('event', 'history', {
      event_category: 'splash',
      first: !trackHistoryTrigger,
      guest: props.store.isGuest()
    });
    trackHistoryTrigger = true;

    if (props.store.isGuest()) return setState({ ...state, loaded: true });

    API.getScores()
      .then(transformPayload)
      .catch(e => {
        console.error(e);
        setState({ ...state, loaded: true, error: e });
      });
  }, []);

  const handleClick = (i: number) => {
    let open = state.open;
    open[i] = !open[i];
    setState({ ...state, open });
  };

  const renderAchievements = () => {
    console.log('ach', state.achievements);
    var view = state.achievements.map((item, i) => (
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

  const createAccordianFlags = data => {
    let flags: boolean[] = [];
    flags = data.map((x, i) => flags.push(false));
    return flags;
  };

  const transformUser = (x: any) => {
    return {
      topic: x.topic,
      date: transformDate(x.debate_created),
      created: x.debate_created,
      userSide: transformSide(x.topic, x.side),
      userCharacter: x.character,
      userReview: x.review,
      userAgree: x.review_aggrement
    };
  };

  const transformOpp = (x: any) => {
    return {
      date: transformDate(x.debate_created),
      oppAgree: x.review_aggrement,
      oppSide: transformSide(x.topic, x.side),
      oppCharacter: x.character,
      oppReview: x.review
    };
  };

  const transformDate = (timestamp: number) => {
    return moment(timestamp).format('MMM DD, YYYY h:mma');
  };

  const transformSide = (topic: string, side: number) => {
    return TopicInfo.getTopic(topic, t)!.positions[side];
  };

  const transformPayload = payload => {
    let data = payload.history.filter(x => x.review !== null); // only sessions with ratings

    let dataHash = data.reduce((hash, x) => {
      // merge data per session from user and opponent
      if (!hash[x.debate_session_id]) hash[x.debate_session_id] = {};
      const val = hash[x.debate_session_id];

      hash[x.debate_session_id] =
        x.user_id === props.store.auth.user!.id
          ? { ...val, ...transformUser(x) }
          : { ...val, ...transformOpp(x) };
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

    const flags = createAccordianFlags(data);
    result.sort((a, b) => {
      return a.created < b.created ? 1 : -1;
    });
    // update store and state
    if (props.store.auth.user)
      props.store.auth.user.updateNumDebates(result.length);
    setState({ ...state, data: result, open: flags, loaded: true });
  };

  const showAchievements = classes => {
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
  };
  // <Typography variant="caption">Topic: <blockquote>"{TopicInfo.getTopic(x.topic, t)!.proposition}"</blockquote></Typography>
  const renderList = (classes, t, data) =>
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
                <span style={{ color: '#5d4444' }}>
                  <span className="nowrap" style={{ fontWeight: 500 }}>
                    {x.userSide}
                  </span>
                  <> vs </>
                  <span className="nowrap" style={{ fontWeight: 500 }}>
                    {' '}
                    {x.oppSide}:
                  </span>
                  <> </>
                </span>
                <span
                  style={{
                    fontWeight: 500,
                    color: x.agreed === 'Agreed' ? '#1f9b83' : '#d10000'
                  }}
                >
                  <span className="nowrap">
                    {' '}
                    {x.agreed === 'Agreed'
                      ? 'Found Agreement'
                      : 'No agreement'}{' '}
                  </span>
                </span>
              </>
            }
            subheader={<>{x.date}</>}
          />
          <CardMedia
            className={classes.media}
            image={characters[x.oppCharacter].url}
            title={'My position: ' + x.userSide}
          />

          <CardContent style={{ paddingBottom: '0px' }}>
            <Typography variant="caption" align="center">
              You were rated as:
            </Typography>
            <Grid
              container
              spacing={0}
              justify="space-around"
              alignItems="center"
            >
              {x.oppReview.traits.pos &&
                x.oppReview.traits.pos.map((label, i2) => {
                  return (
                    <Grid
                      xs={6}
                      sm={4}
                      item
                      key={i2}
                      style={{ textAlign: 'center' }}
                    >
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
                    <Grid
                      item
                      xs={6}
                      sm={4}
                      key={i2}
                      style={{ textAlign: 'center' }}
                    >
                      <Typography key={i2} style={{ margin: 5 }}>
                        {label}
                      </Typography>
                    </Grid>
                  );
                })}
            </Grid>
            <br />
            <Divider />
            <CardActions className={classes.actions} disableActionSpacing>
              {x.oppReview.traits.pos.length > 0 && (
                <>
                  <IconButton aria-label="Share">
                    <TwitterShareButton
                      url={'https://dinnertable.chat'}
                      title={`I've debated with my political opposite and was rated: ${x.oppReview.traits.pos.join(
                        ', '
                      )}`}
                      className="share-button"
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                  </IconButton>
                  <IconButton aria-label="Share">
                    <FacebookShareButton
                      url={'https://dinnertable.chat'}
                      quote={`I've debated with my political opposite and was rated: ${x.oppReview.traits.pos.join(
                        ', '
                      )}`}
                      className="share-button"
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </IconButton>
                </>
              )}

              <IconButton
                className={state.expanded === i ? classes.expandOpen : null}
                onClick={handleExpandClick.bind(null, i)}
                aria-expanded={state.expanded === i}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
          </CardContent>

          <Collapse in={state.expanded === i} timeout="auto" unmountOnExit>
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

  const signOutGuest = (e: any) => {
    e.preventDefault();
    window.gtag('event', 'guest_signup_click', {
      event_category: 'splash'
    });
    props.store.auth.logout();
    props.store.auth.login();
    return true;
  };

  const handleExpandClick = i => {
    if (state.expanded === i)
      return setState({ ...state, expanded: undefined });
    setState({ ...state, expanded: i });
  };

  // const { classes, store, t } = props;
  if (store.auth.isNotLoggedIn) {
    store.router.push('/');
    return null;
  }

  return (
    <div className={classes.pagebody}>
      <div className={classes.centered}>
        {store.isGuest() && (
          <>
            <div className={classes.headerContainer}>
              <>
                <Button
                  style={{
                    marginTop: '1vh',
                    marginLeft: '12px',
                    float: 'right'
                  }}
                  onClick={signOutGuest}
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Signup now
                </Button>
                <Typography
                  variant="h1"
                  align="left"
                  color="textPrimary"
                  className={classes.name}
                  gutterBottom
                  style={{ fontSize: '1.25em' }}
                >
                  <Info style={{ margin: '0px 3px -6px 0px' }} /> Temporary
                  guest account
                </Typography>
                <Typography
                  variant="body2"
                  align="left"
                  color="textPrimary"
                  gutterBottom
                  className={classes.nameSubstat}
                  style={{ fontWeight: 'normal', fontSize: '1em' }}
                >
                  Guests can join others in matchmaking but will{' '}
                  <b> not gain</b> xp/levels or any of the member perks.
                  Registered users also have priority in matchmaking. Please
                  signup to start building your character!
                </Typography>
              </>
            </div>
            <br />{' '}
          </>
        )}

        {false && showAchievements(classes)}

        <div style={{ paddingBottom: '1em' }} />

        {renderList(classes, t, state.data)}

        {state.data.length === 0 && (
          <Paper className={classes.paper}>
            <Typography
              variant="body2"
              align="center"
              color="textSecondary"
              style={{ fontWeight: 'normal' }}
              gutterBottom
            >
              {!state.loaded && <b>Loading debate history...</b>}
              {state.loaded && (
                <span>
                  No debate history to list yet. <br />
                  Click QUICKMATCH button above to get started.
                </span>
              )}
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
}
