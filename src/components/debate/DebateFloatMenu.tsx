// stub

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
      
    </footer>
  );
}
/*
<a href="https://discord.gg/U6h8pE9">
              <i
                id="social-discord"
                className="fab fa-discord fa-3x social"
              />
            </a>
*/
export default withRoot(withStyles(styles)(Footer));
