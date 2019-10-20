import React, {useContext} from 'react';
import { Typography } from '@material-ui/core';
import * as AppModel from '../../models/AppModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from'@material-ui/core/styles';
const trackOutboundLinkClick = window.trackOutboundLinkClick;

const useStyles = makeStyles((theme: any) => ({
    root: {
      justifyContent: 'center'
    },
    centered: {
      position: 'relative',
      bottom: 0,
      marginTop: '3.2em',
      paddingBottom: '1em',
      paddingTop: '.8em',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      backgroundColor: theme.palette.secondary.dark,
      textAlign: 'center'
    },
    links: {
      // textDecoration: 'none',
      color: 'white',
      fontWeight: 600,
      '&:hover': {
        color: '#84849f',
        textDecoration: 'underline'
      }
    }
  }));

interface Props {
  className?: string;
  forceShow?: boolean;
}

export default function Footer(props: Props) {
  const classes = useStyles({});
  const store = useContext(AppModel.Context)!;
  const cn = props.className || '';

  if (!props.forceShow && store.isStandalone()) return null;

  const path = (store.router.location as any).pathname;
  const isHome = path === '/' || path === '/about';

  return (
    <footer className={classes.centered + ' ' + cn}>
       <Typography style={{ fontSize: '0.8em', color: 'white' }}>
                A partner of <a
          href="https://www.newdialogue.org"
          className={classes.links}
        >New Dialogue Foundation</a>
        <br />
        </Typography>
      <section id="social_icon_footer">
        <div className="container">
          <div className="text-center center-block">
            <a
              title="Twitter"
              href="https://twitter.com/dintablechat"
              onClick={trackOutboundLinkClick(
                'https://twitter.com/dintablechat', false, true
              )}
            >
              <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'twitter-square']} />
            </a>

            <a
              title="Facebook"
              href="https://facebook.com/dinnertablechat"
              onClick={trackOutboundLinkClick(
                'https://facebook.com/dinnertablechat', false, true
              )}
            >
              <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'facebook-square']} />
            </a>

            <a
              title="Medium"
              href="https://medium.com/dinnertablechat"
              onClick={trackOutboundLinkClick(
                'https://medium.com/dinnertablechat', false, true
              )}
            >
              <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'medium']} />
            </a>

            <a
              title="Instagram"
              href="https://www.instagram.com/dinnertablechat/"
              onClick={trackOutboundLinkClick('https://www.instagram.com/dinnertablechat/', false, true)}
            >
              <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'instagram']} />
            </a>

            <a
              title="Discord"
              href="https://discord.gg/U6h8pE9"
              onClick={trackOutboundLinkClick('https://discord.gg/U6h8pE9', false, true)}
            >
              <FontAwesomeIcon className="social-tw social" size="4x" icon={['fab', 'discord']} />
            </a>

            <a
              title="email team@dinnertable.chat"
              href="mailto:team@dinnertable.chat"
              onClick={trackOutboundLinkClick('mailto:team@dinnertable.chat')}
            >
              <FontAwesomeIcon className="social-tw social" size="4x" icon="envelope-square" />
            </a>
          </div>
        </div>
      </section>
      <Typography style={{ fontSize: '0.8em', color: 'white' }}>
        PAGES:{' '}
        { !isHome && <><a
          href="/about"
          className={classes.links}
          style={{ margin: '0 10px 0 10px' }}
        >
          About DTC
        </a>{' | '}</>
        }

        <a
          href="/hosting"
          className={classes.links}
          style={{ margin: '0 10px 0 10px' }}
        >
          Hosting &amp; Integration
        </a>{' | '}
        
        <a
          href="/press"
          className={classes.links}
          style={{ margin: '0 10px 0 10px' }}
        >
          Press Kit
        </a>{' | '}
        <a
          href="https://ko-fi.com/E1E0OB0M"
          target="_blank"
          rel="noopener noreferrer"
          className={classes.links}
          style={{ margin: '0 10px 0 10px' }}
        >
          Donations
        </a>{' | '}
        <a
          href="/campus"
          target="_self"
          className={classes.links}
          style={{ marginLeft: '10px' }}
        >
          College Program
        </a>
        <br />
        <br />
        Copyright © 2018-2019 Dinnertable.chat
        <span style={{ marginLeft: '10px', color: '#ccc' }}>|</span>
        <a
          href="/privacy"
          className={classes.links}
          style={{ marginLeft: '10px', fontWeight: 500 }}
        >
          Privacy Policy
        </a>
      </Typography>
    </footer>
  );
}
