import React from 'react';
import { SvgIcon, Button, IconButton, Typography } from '@material-ui/core';
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import withRoot from '../../withRoot';


import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Email from '@material-ui/icons/Email';
import { AnyMxRecord } from 'dns';

const styles = createStyles({
    root: {
       justifyContent: 'center'
    },
    centered: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        backgroundColor: '#484965',
        textAlign:'center'
      },
});
  
interface Props extends WithStyles<typeof styles> {
}

function TwitterIcon(props: any) {
    // <path d="M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23" />
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

function Footer(props: Props) {
    const { classes } = props;
    return (
        <footer className={classes.centered}>
            <Typography>
            Copyright © 2018 Dinnertable.chat
            </Typography>
            <TwitterIcon color="secondary" />
            <IconButton color="secondary" aria-label="email">
                <Email />
            </IconButton>
        </footer>
    );
}

export default (withRoot(withStyles(styles)(Footer)));