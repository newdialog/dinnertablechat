import { Typography } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from'@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';

const screen = window.screen;
// requires user action
function setLandscape() {
  // Lock orientation if possible
  if (screen.orientation && typeof screen.orientation.lock === 'function') {
    screen.orientation.lock('landscape').catch(e => {
      console.warn('screen.orientation.lock failed', e);
    });
  }

  // const s = window.screen as any;
  const lockOrientationUniversal =
    window.screen['lockOrientation'] ||
    window.screen['mozLockOrientation'] ||
    window.screen['msLockOrientation'];

  if (lockOrientationUniversal) {
    if (lockOrientationUniversal.call(window.screen, 'landscape')) {
      console.log('screen.lockOrientation set to landscape');
    } else {
      console.warn('screen.lockOrientation failed to lock');
    }
  } else {
    console.warn('screen.lockOrientation not available');
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(1) / 2
  },
  button: {
    margin: theme.spacing(1) / 2
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
      height: 150
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15
      },
      '& $imageMarked': {
        opacity: 0
      },
      '& $imageTitle': {
        border: '4px solid currentColor'
      }
    }
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
    color: theme.palette.common.white
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%'
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity')
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme
      .spacing(1) + 6}px`
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity')
  }
}));

interface Props {
  store: AppModel.Type;
}

const defaultContributions: Array<{
  key: any;
  title: any;
  value: any;
  url: any;
}> = [
  { key: 0, title: 'Tracy', value: 0, url: './imgs/04-select.png' },
  { key: 1, title: 'Riley', value: 1, url: './imgs/04-select2.png' },
  { key: 2, title: 'Finley', value: 2, url: './imgs/04-select3.png' }
];

export default function CharacterSelector(props: Props) {
  // const store = props.store;
  const classes = useStyles({});
  // const { t } = useTranslation();
  const onChipClick = (ev: any, item: any) => {
    setLandscape();
    props.store.debate.setCharacter(item.value);
    // TODO for now skip topic selection
    // props.store.debate.setPosition(100, TopicInfo.getTopics(t)[0].id);
  };

  const contrib = defaultContributions;

  return (
    <div className={classes.root}>
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
            onClick={e => onChipClick(e, item)}
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
    </div>
  );
}
