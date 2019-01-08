import React from 'react';
import { Typography } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import HOC from '../HOC';
import { inject } from 'mobx-react';
import * as AppModel from '../../models/AppModel';

const styles = theme =>
  createStyles({
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
      backgroundColor: '#484866', // theme.palette.secondary.dark,
      textAlign: 'center'
    },
    links: {
      // textDecoration: 'none',
      color: 'white',
      fontWeight: 600,
    },
    '.links:hover': {
      color: 'white',
    }
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
  forceShow?: boolean;
}

function Footer(props: Props) {
  const { classes } = props;

  if (!props.forceShow && props.store.isStandalone()) return null;

  return (
    <footer className={classes.centered}>
      <section id="lab_social_icon_footer">
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
          className={classes.links + ' footerlink'}
          style={{ margin: '0 10px 0 10px' }}
        >
          Press Kit
        </a>{' | '}
        <a
          href="https://ko-fi.com/E1E0OB0M"
          target="_blank"
          className={classes.links + ' footerlink'}
          style={{ marginLeft: '10px' }}
        >
          Donations
        </a>
        <br />
        <br />
        Copyright © 2018 Dinnertable.chat
        <span style={{ marginLeft: '10px', color: '#ccc' }}>|</span>
        <a
          href="/privacy"
          style={{ marginLeft: '10px', textDecoration: 'none', color: '#ccc' }}
        >
          Privacy Policy
        </a>
      </Typography>
    </footer>
  );
}

export default inject('store')(HOC(Footer, styles));
