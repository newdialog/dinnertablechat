import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';
import HOC from '../HOC';

const styles = theme =>
  createStyles({
    infoTip: {
        maxWidth: '600px',
        margin: '60px auto 0 auto',
        padding: '6px 32px',
        backgroundColor: theme.palette.secondary.light
      },
  });

interface Props extends WithStyles<typeof styles> {
  
}



function Tooltip(props: Props) {
  const { classes } = props;  
  return (
    <Paper className={classes.infoTip}>
    <Typography
      variant="body1"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      <Info style={{ margin: '0px 3px -6px 0px' }} />
      <b>TIP</b>
      <br />
      It helps to prepare for debates using credible sources of
      information. <br />
      <a
        href="https://medium.com/wikitribune/our-list-of-preferred-news-sources-c90922ba22ef"
        target="_blank"
        rel="noopener"
      >
        Here's our recommendations
      </a>
      .
    </Typography>
  </Paper>
  );
    
}

export default HOC(Tooltip, styles);
