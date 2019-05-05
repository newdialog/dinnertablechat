import React, {useContext} from 'react';
import { Typography } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import * as AppModel from '../../models/AppModel';

import { useTheme, makeStyles } from '@material-ui/styles';
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
              <i
                id="social-tw"
                className="fab fa-twitter-square social fa-3x "
              />
            </a>

            <a
              title="Facebook"
              href="https://facebook.com/dinnertablechat"
              onClick={trackOutboundLinkClick(
                'https://facebook.com/dinnertablechat', false, true
              )}
            >
              <i
                id="social-tw"
                className="fab fa-facebook-square social fa-3x "
              />
            </a>

            <a
              title="Medium"
              href="https://medium.com/dinnertablechat"
              onClick={trackOutboundLinkClick(
                'https://medium.com/dinnertablechat', false, true
              )}
            >
              <i id="social-medium" className="fab fa-medium social fa-3x " />
            </a>

            <a
              title="Instagram"
              href="https://www.instagram.com/dinnertablechat/"
              onClick={trackOutboundLinkClick('https://www.instagram.com/dinnertablechat/', false, true)}
            >
              <i id="social-discord" className="fab fa-instagram fa-3x social" />
            </a>

            <a
              title="Discord"
              href="https://discord.gg/U6h8pE9"
              onClick={trackOutboundLinkClick('https://discord.gg/U6h8pE9', false, true)}
            >
              <i id="social-discord" className="fab fa-discord fa-3x social" />
            </a>

            <a
              title="email team@dinnertable.chat"
              href="mailto:team@dinnertable.chat"
              onClick={trackOutboundLinkClick('mailto:team@dinnertable.chat')}
            >
              <i
                id="social-em"
                className="fa fa-envelope-square fa-3x social"
              />
            </a>
          </div>
        </div>
      </section>
      <Typography style={{ fontSize: '0.8em', color: 'white' }}>
        <br />
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
