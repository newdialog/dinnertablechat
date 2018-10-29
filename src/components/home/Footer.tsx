import React from 'react';
import { Typography } from '@material-ui/core';
import {
  createStyles,
  WithStyles,
} from '@material-ui/core/styles';
import HOC from '../HOC'

const styles = createStyles({
  root: {
    justifyContent: 'center'
  },
  centered: {
    marginTop: '3.2em',
    paddingBottom: '1em',
    paddingTop: '.8em',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    backgroundColor: '#484965',
    textAlign: 'center'
  }
});

interface Props extends WithStyles<typeof styles> {}

function Footer(props: Props) {
  const { classes } = props;
  return (
    <footer className={classes.centered}>
      <section id="lab_social_icon_footer">
        <div className="container">
          <div className="text-center center-block">

            <a href="https://medium.com/dinnertablechat" onClick={trackOutboundLinkClick('https://medium.com/dinnertablechat')}>
              <i id="social-medium" className="fab fa-medium social fa-3x "></i>
            </a>
            
            <a href="https://twitter.com/dintablechat" onClick={trackOutboundLinkClick('https://twitter.com/dintablechat')}>
              <i id="social-tw" className="fab fa-twitter-square social fa-3x "></i>
            </a>

            <a href="mailto:team@dinnertable.chat" onClick={trackOutboundLinkClick('mailto:team@dinnertable.chat')}>
              <i
                id="social-em"
                className="fa fa-envelope-square fa-3x social"
              />
            </a>
            
          </div>
        </div>
      </section>
      <Typography variant="body2" style={{fontSize:'0.8em', color:'white'}}>
        Copyright © 2018 Dinnertable.chat
        <span style={{marginLeft: '10px', color: '#999999'}}>|</span>
        <a href="/privacy" style={{marginLeft: '10px', textDecoration: 'none', color: '#999999'}}>Privacy Policy</a>
      </Typography>
    </footer>
  );
}
/*
<a href="mailto:team@dinnertable.chat" onClick={trackOutboundLinkClick('mailto:admin@dinnertable.chat')}>
              <i
                id="social-em"
                className="fa fa-envelope-square fa-3x social"
              />
            </a>
<a href="https://discord.gg/U6h8pE9">
              <i
                id="social-discord"
                className="fab fa-discord fa-3x social"
              />
            </a>
*/
export default HOC(Footer, styles);
