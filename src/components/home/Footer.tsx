import React from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';
import withRoot from '../../withRoot';

const styles = createStyles({
  root: {
    justifyContent: 'center'
  },
  centered: {
    marginTop: '4em',
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
            <a href="https://discordapp.com/channels/@me/481918153203384351">
              <i
                id="social-discord"
                className="fab fa-discord fa-3x social"
              />
            </a>
            <a href="https://twitter.com/dintablechat">
              <i id="social-tw" className="fab fa-twitter-square social fa-3x "></i>
            </a>
            <a href="mailto:admin@dinnertable.chat">
              <i
                id="social-em"
                className="fa fa-envelope-square fa-3x social"
              />
            </a>
          </div>
        </div>
      </section>
      <Typography variant="body1" style={{fontSize:'0.8em', color:'white'}}>
        Copyright © 2018 Dinnertable.chat
        <span style={{marginLeft: '10px', color: '#999999'}}>|</span>
        <a href="/privacy" style={{marginLeft: '10px', textDecoration: 'none', color: '#999999'}}>Privacy Policy</a>
      </Typography>
    </footer>
  );
}

export default withRoot(withStyles(styles)(Footer));
