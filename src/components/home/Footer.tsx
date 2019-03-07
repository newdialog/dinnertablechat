import React, {useContext} from 'react';
import { Typography } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { inject } from 'mobx-react';
import * as AppModel from '../../models/AppModel';

import { useTheme, makeStyles } from '@material-ui/styles';
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
  forceShow?: boolean;
}

export default function Footer(props: Props) {
  const classes = useStyles({});
  const store = useContext(AppModel.Context)!;

  if (!props.forceShow && store.isStandalone()) return null;

  return (
    <footer className={classes.centered}>
      <section id="social_icon_footer">
        <div className="container">
          <div className="text-center center-block">
            <a
              href="https://twitter.com/dintablechat"
              onClick={trackOutboundLinkClick(
                'https://twitter.com/dintablechat'
              )}
            >
              <i
                id="social-tw"
                className="fab fa-twitter-square social fa-3x "
              />
            </a>

            <a
              href="https://medium.com/dinnertablechat"
              onClick={trackOutboundLinkClick(
                'https://medium.com/dinnertablechat'
              )}
            >
              <i id="social-medium" className="fab fa-medium social fa-3x " />
            </a>

            <a
              href="https://discord.gg/U6h8pE9"
              onClick={trackOutboundLinkClick('https://discord.gg/U6h8pE9')}
            >
              <i id="social-discord" className="fab fa-discord fa-3x social" />
            </a>

            <a
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
