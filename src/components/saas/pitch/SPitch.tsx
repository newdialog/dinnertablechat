import { Typography } from '@material-ui/core';
import One from '@material-ui/icons/LooksOne';
import Two from '@material-ui/icons/LooksTwo';
import Three from '@material-ui/icons/Looks3';
import Four from '@material-ui/icons/Looks4';
// import Four from '@material-ui/icons/Quest
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../../home/Footer';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
  },
  container: {
    marginTop: '100px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '800px',
    minWidth: '300px',
    padding: '0 14px 0 14px'
  },
  containerRev: {
    marginTop: '100px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '800px',
    minWidth: '300px',
    padding: '0 14px 0 14px',
    flexWrap: 'wrap-reverse',
  },
  paper: {
    padding: theme.spacing(1.5),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
  },
  paper2: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    height: '240px',
    width: '240px',
    textAlign: 'center',
    backgroundColor: '#e2dfd0',
    verticalAlign: 'middle !important',
    display: 'block'
  },
  helper: {
    display: 'relative',
    height: '100%',
    verticalAlign: 'middle'
  },
  paperimg: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    margin: 'auto',
    verticalAlign: 'middle',
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    maxWidth: '200px'
  },
  centered: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '800px',
    minWidth: '300px',
    // alignContent: 'centered',
    textAlign: 'center'
  },
  divider: {
    margin: `${theme.spacing(4)}px 0`,
    height: '1px',
    backgroundColor: '#999999'
  },
  largeIcon: {
    width: 80,
    height: 60
  },
  gridEl: {
    display: 'inline-flex',
    padding: '.5em'
  },
  bullet: {
    marginLeft: '.5em',
    marginBottom: '-.25em',
    marginRight: '.25em',
    fontSize: '2em'
  }
}));
interface Props {
  // extends WithStyles<typeof styles> {
  // store: AppModel.Type;
}

export default function MediaKit(props: Props) {
  const classes = useStyles({});

  const contact = () => {
    window.location.href = "mailto:team@dinnertable.chat";
  }

  const imgs = [
    './logos/dinnertable.gif',
    './logos/dtclogo.png',
    './logos/dtclogo3-1.png',
    './logos/dtclogo3.png'
  ];
  // const { classes } = props;
  // const { open } = this.state;
  return (
    <React.Fragment>
      <Helmet title="Dinnertable.chat Press">
        <meta name="og:url" content="https://dinnertable.chat/press" />
        <meta name="og:title" content="Dinnertable.chat Press" />
      </Helmet>
      <div className={classes.container}>
        <Typography
          gutterBottom={true}
          variant="h3"
          style={{ color: 'black', fontSize: '2.1em', margin: '200px 0 100px' }}
          align={'center'}
        >
          DTC is an online debate platform that connects people and communities
          with different opinions for a respectful dialog.
        </Typography>
        <Grid container spacing={0} className={classes.containerRev}>
          <Grid className={classes.gridEl} style={{alignItems:'center'}}
              item xs={12} md={6}>
            <Typography
              gutterBottom={true}
              variant="h3"
              align={'center'}
              style={{ fontSize: '1.6m', margin: '0'}}
            >
              Use our debate platform to get people talking about <u>YOUR</u> topics.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src="imgs/press/01-scene1-sm.jpg"
              width="100%"
              alt="screenshot-1"
            />
          </Grid>
        </Grid>
        <div className={classes.divider} />
        <One className={classes.bullet}/>WE create a custom debate platform for you<br/>
        <Two className={classes.bullet}/>YOU Choose the questions use debate<br/>
        <Three className={classes.bullet}/>YOU promote your platform in your media channels<br/>
        <Four className={classes.bullet}/>YOUR community engages with your content<br/>
        <div className={classes.divider} />
        If you are a university, you can help students have an anonymous and free debate on topics you choose. Students can debate with students from other universities and countries.
        <br/><br/>
        If you are a publisher, we can help improve user retention by providing an engaging activity for your readers. Often users want to learn more from other members who have read or watched the same content, and our conversation platform helps facilitate a safe and fun way for users to share and express themselves. 
        <div className={classes.divider} />
        <Typography
              gutterBottom={true}
              variant="h1"
              align={'center'}
              style={{ fontSize: '1em', margin: '0'}}
            >
             Contact us for:
        </Typography><br/>
        <ButtonGroup fullWidth aria-label="Full width outlined button group">
          <Button onClick={contact}>a free sample</Button>
          <Button onClick={contact}>a custom solution</Button>
          <Button onClick={contact}>any other questions</Button>
        </ButtonGroup>
        <br/><br/><br/><br/>
        <div className={classes.divider} />
        <Typography
              gutterBottom={true}
              variant="body1"
              align={'left'}
              style={{ fontSize: '1em', margin: '0'}}
            >
             More about our SaaS launch:
        </Typography><br/>
        <Typography gutterBottom={true} component="div">
          <p className="c0 c15">
            <span className="c5">
              Online discussion and debate platform, Dinnertable.chat is pleased
              to announce the launch of its{' '}
            </span>
            <span className="c5">host</span>
            <span className="c5">
              &nbsp;SaaS offering for media outlets and higher education
              institutions. The{' '}
            </span>
            <span className="c5">platform</span>
            <span className="c4">
              &nbsp;web add-on was inspired by the Dinnertable.chat platform, an
              online space where people can enter into constructive dialogue
              with those who hold differing viewpoints for the purpose of
              finding common ground on various social and political issues.
            </span>
          </p>
          <p className="c0 c3">
            <span className="c4" />
          </p>
          <p className="c0 c15">
            <span className="c4">
              Existing modes of public online discussion offer little, if any,
              encouragement to maintain constructive dialogue and respectful
              debate, and also face external challenges including:
            </span>
          </p>
          <p className="c0 c3">
            <span className="c4" />
          </p>
          <ol className="c11 lst-kix_9avvhvrdeikr-0 start">
            <li className="c0 c10">
              <span className="c4">
                People maliciously abusing systems to publicly and/or visibly
                spread toxic ideas
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                Bad actors trolling serious conversations, diminishing focus and
                overall value
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                Confusion and misinterpretation due to text often lacking
                contextual and emotive cues
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                Text-based conversations that lack higher forms of emotional
                expression are often dry and bland
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                Echo chambers develop when majority &ldquo;gangs up,&rdquo;
                squeezing out minority viewpoints
              </span>
            </li>
          </ol>
          <p className="c0 c3">
            <span className="c4" />
          </p>
          <p className="c0 c15">
            <span className="c5">The Dinnertable.chat </span>
            <span className="c5">hosting service</span>
            <span className="c4">
              &nbsp;add-on is explicitly designed to actively combat these
              problems and promote positive communication traits. This is
              accomplished in the following ways:
            </span>
          </p>
          <p className="c0 c3">
            <span className="c4" />
          </p>
          <ol className="c11 lst-kix_k5e2mrvp4ebx-0 start">
            <li className="c0 c10">
              <span className="c4">
                One-on-one communication, minimizing the visible &ldquo;blast
                radius&rdquo; of toxic messaging
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                Participants rate one another post-discussion, which quickly
                identifies and minimizes trolls
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                Communication is verbal and dynamic which allows for a higher
                message bandwidth
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                Voice-based communication provides an intimate, exciting, and
                emotionally vulnerable experience
              </span>
            </li>
            <li className="c0 c10">
              <span className="c4">
                One-on-one conversation dynamic eliminates ability to gang up or
                drown out minority viewpoints
              </span>
            </li>
          </ol>
          <p className="c0 c3">
            <span className="c4" />
          </p>
          <p className="c0 c15">
            The Dinnertable.chat platform integration service
            <span className="c5">
              &nbsp;can be easily implemented by media sites, publishers,
              colleges, and universities to enhance the online conversation
              experience for their respective users, leading to better
              conversation on whatever is being discussed. Better communication
              allows users to actively engage with content longer and encourages
              readers to think critically about that content in a more organic
              way than the text-based discussion widgets of yesterday. The
              add-on turbocharges universities and publishers, allowing their
              users to both better express themselves while improving their
              understanding of the subject matter being presented. The{' '}
            </span>
            <span className="c5">host integration</span>
            <span className="c5">
              &nbsp;can easily be integrated into a range of mobile apps and
              websites, and can be customized and branded for specific needs.
            </span>
          </p>
          <p className="c0 c8">
            <span className="c4" />
          </p>
          <p className="c0 c15">
            <span className="c20 c19">For publishers</span>
            <span className="c20">, </span>
            <span className="c5">DTC integration</span>
            <span className="c20">
              &nbsp;allows you to add real-time personable conversation to your
              content. This allows your users to speak directly with others
              about what they think about the content, how it makes them feel,
              and whatever differences of opinion they may have. For the
              journalists,{' '}
            </span>
            <span className="c5">the add-on</span>
            <span className="c7">
              &nbsp;allows their readers to speak &lsquo;truth to power&rsquo;
              by being able to directly express their ideas and views without
              drowning out others, which is a major issue on social networks
              like Twitter.
            </span>
          </p>
          <p className="c0 c3">
            <span className="c7" />
          </p>
          <p className="c0 c15">
            <span className="c20 c19">For universities</span>
            <span className="c20">, </span>
            <span className="c5">DTC integration</span>
            <span className="c20">
              &nbsp;provides professors with a means of allowing students to
              freely exercise ideas through conversation and debate with other
              students, while still keeping student anonymity. However, these
              discussions are fundamentally structured to encourage positivity
              and productivity, as users are prompted to rate how good of a
              conversationalist the other was post-conversation. For larger
              discussions and more challenging ideologies, universities can host
              partnership debate challenges with other schools to increase the
              diversity of ideas and culture.
            </span>
          </p>
          <p className="c0 c3">
            <span className="c4" />
          </p>
          <p className="c0 c15">
            <span className="c5">&ldquo;One of t</span>
            <span className="c5">
              he core issues with having a &nbsp;discussion forum is that it
              only works for talking about topics in an organized and
              professional way, which is not how most of the Internet behaves.
            </span>
            <span className="c5">,&rdquo; says </span>
            <span className="c5">Jonathan Dunlap</span>
            <span className="c5">
              , the founder of Dinnertable.chat. &ldquo;
            </span>
            <span className="c5">
              We&#39;re providing a new kind of integrated user communication
              platform that provides an environment where people can be their
              authentic selves while holding each other to be accountable to be
              fair and open minded.
            </span>
            <span className="c4">&rdquo;</span>
          </p>
          <p className="c0 c3">
            <span className="c4" />
          </p>
         
            <br />
            <hr />
          
          <p className="c0 c3">
            <span className="c4" />
          </p>
          <p className="c0 c15">About the Dinntertable.chat platform</p>
          <p className="c0 c15">
            <span className="c5">Dinnertable.chat</span>
            <span className="c20">
              &nbsp;is a mobile app and web platform that facilitates real-time
              discussions and debates on a range of social and political issues,
              and the Hosting (service) is Dinnertable.chat&rsquo;s integratable
              SaaS add-on for websites, media outlets, and higher education
              institutions. Designed to act as virtual matchmakers for people
              with political differences, Dinnertable.chat and the service let
              users choose a topic they are interested in or have a position on,
              then connects them with someone who holds an appropriately
              contrasting viewpoint. Matched users then each control a fun
              virtual character who represents their respective words and
              emotions on-screen during the conversation. The vision of
              Dinnertable.chat is to provide accessible tools that help engage
              people in good-faith dialogue for the purpose of finding common
              ground through live conversation.
            </span>
          </p>
          <br />
          <b>For pricing and availability:</b>
        </Typography>

        <Typography gutterBottom={true} align={'left'}>
          Sales{' '}
          <a
            href="mailto:sales@dinnertable.chat"
            onClick={window.trackOutboundLinkClick(
              'mailto:sales@dinnertable.chat'
            )}
          >
            sales@dinnertable.chat
          </a>
          <br />
          General business inqueries{' '}
          <a
            href="mailto:team@dinnertable.chat"
            onClick={window.trackOutboundLinkClick(
              'mailto:team@dinnertable.chat'
            )}
          >
            team@dinnertable.chat
          </a>
        </Typography>
      </div>
      <Footer />
    </React.Fragment>
  );
}
