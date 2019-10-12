import { Paper, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';
import { makeStyles } from'@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  infoTip: {
    maxWidth: '600px',
    margin: '30px auto 0 auto',
    padding: '6px 32px',
    backgroundColor: theme.palette.secondary.light
  }
}));

interface Props {}

export default function Tooltip(props: Props) {
  const classes = useStyles({});
  const { t } = useTranslation();

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
        It helps to prepare for debates using credible sources of information.{' '}
        <br />
        <a
          href="https://medium.com/wikitribune/our-list-of-preferred-news-sources-c90922ba22ef"
          target="_blank"
          rel="noopener noreferrer"
        >
          Here's our recommendations
        </a>
        .
      </Typography>
    </Paper>
  );
}
