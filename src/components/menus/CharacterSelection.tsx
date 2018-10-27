import * as React from 'react';
import { createStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Chip, Paper, Typography } from '@material-ui/core';
import * as AppModel from '../../models/AppModel';
import ButtonBase from '@material-ui/core/ButtonBase';
import HOC from '../HOC';

// const logoData = require('../../assets/logo.json');

const styles = theme =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing.unit / 2
    },
    button: {
      margin: theme.spacing.unit / 2
    },
    char: {
      width: '20vw',
      height: '20vw',
      objectFit: 'contain'
    },
    image: {
      position: 'relative',
      width: '20vw',
      height: '20vw',
      // height: 200,
      [theme.breakpoints.down('xs')]: {
        width: '100% !important', // Overrides inline-style
        height: 150,
      },
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0.15,
        },
        '& $imageMarked': {
          opacity: 0,
        },
        '& $imageTitle': {
          border: '4px solid currentColor',
        },
      },
    },
    focusVisible: {},
    imageButton: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 'auto',
      bottom: '.25em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white,
    },
    imageSrc: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.black,
      opacity: 0.4,
      transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
      position: 'relative',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
    },
    imageMarked: {
      height: 3,
      width: 18,
      backgroundColor: theme.palette.common.white,
      position: 'absolute',
      bottom: -2,
      left: 'calc(50% - 9px)',
      transition: theme.transitions.create('opacity'),
    }
  });

interface Props extends WithStyles<typeof styles> {
  store: AppModel.Type;
}

 
class CharacterSelector extends React.Component<Props> {
  private defaultContributions(): Array<{
    key: any;
    title: any;
    value: any;
    url: any;
  }> {
    return [
      // { key: 0, title: 'Tracy', value: 0, url: './imgs/04-select.png' },
      { key: 1, title: 'Riley', value: 1, url: './imgs/04-select2.png' },
      { key: 2, title: 'Finley', value: 2, url: './imgs/04-select3.png' }
    ];
  }

  private onChipClick(item: any) {
    this.props.store.debate.setCharacter(item.value);
  }

  public render() {
    const { classes, store } = this.props;
    // const selected = store.debate.character;

    const contrib = this.defaultContributions();
    /* if(selected!==-1) {
        contrib.forEach( (e) => {
            if(e.label=== selected) e.color = 'primary';
        })
    }*/

    return (
      <div>
        <Paper className={classes.root}>
          {contrib.map(item => {
            return (
              <ButtonBase
                focusRipple
                key={item.title}
                className={classes.image}
                focusVisibleClassName={classes.focusVisible}
                style={{
                  width: '30%'
                }}
                onClick={() => this.onChipClick(item)}
              >
                <span
                  className={classes.imageSrc}
                  style={{
                    backgroundImage: `url(${item.url})`
                  }}
                />
                <span className={classes.imageBackdrop} />
                <span className={classes.imageButton}>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    className={classes.imageTitle}
                  >
                    {item.title}
                    <span className={classes.imageMarked} />
                  </Typography>
                </span>
              </ButtonBase>
            );
          })}
        </Paper>
      </div>
    );
  }
}
{
  /* 
  <Chip
                key={item.key}
                label={item.label}
                color={item.color}
                onClick={() => this.onChipClick(item)}
                className={classes.button}
                clickable
            />
  
  <Button key={item.key} variant="outlined" size="small" color="primary" 
className={classes.button} onClick={() => this.onChipClick(item)}>
{item.label.valueOf()}
</Button> */
}

export default HOC(CharacterSelector, styles);
