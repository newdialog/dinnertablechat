import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import * as TopicInfo from '../../utils/TopicInfo';
import { ResponsiveBubble } from '@nivo/circle-packing';

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',
      height: '30vh',
      marginLeft: 'auto',
      marginRight: 'auto',
      [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
        // width: 1100,
        // marginLeft: 'auto',
        // marginRight: 'auto',
      }
    },
    btn: {
      // marginLeft: '1.5em',
      color: '#ffffff',
      fontSize: '1.1em'
      // color: theme.palette.secondary.main
    },
    submit: {
      width: '100px',
      fontSize: '1.1em',
      color: '#ffffff'
    }
  }),
  { name: 'PositionSelector' }
);

interface Props {
  store: AppModel.Type;
  data: any[];
}

interface User {
  user: string;
  answers: Array<any>;
  answersHash?: Array<any>;
}

// type Data = Array<User>;
interface State {
  checks: number;
  myGroup?: any;
}

export default function ConfGraph(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  // const [state, setState] = React.useState<State>({ data: [], checks: 0 });

  console.log('ConfGraph', props.data);
  if(props.data.length === 0) return null;

  const data2 = props.data.map( (g, index) => {
    const children = Object.keys(g).map(k => {
      const val = g[k];
      return { name: k, color: 'hsl(79, 70%, 50%)', loc: 100 }
    });

    return { name: ''+index, children, color: 'hsl(245, 70%, 50%)' }
  });

  const valo = {
    name: 'nivo',
    color: 'hsl(34, 70%, 50%)',
    children: data2
  }

  console.log(JSON.stringify(valo, null, 2));

  return (
    <div className={classes.layout}>
      <ResponsiveBubble
        root={valo}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        identity="name"
        value="loc"
        colors={{ scheme: 'nivo' }}
        padding={6}
        enableLabel={false}
        labelTextColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        borderWidth={2}
        borderColor={{ from: 'color' }}
        defs={[
          {
            id: 'lines',
            type: 'patternLines',
            background: 'none',
            color: 'inherit',
            rotation: -45,
            lineWidth: 5,
            spacing: 8
          }
        ]}
        fill={[{ match: { depth: 1 }, id: 'lines' }]}
        animate={true}
        motionStiffness={90}
        motionDamping={12}
      />
    </div>
  );
}

const root = {
  name: 'nivo',
  color: 'hsl(34, 70%, 50%)',
  children: [
    {
      name: 'viz',
      color: 'hsl(245, 70%, 50%)',
      children: [
        {
          name: 'stack',
          color: 'hsl(79, 70%, 50%)',
          children: [
            {
              name: 'chart',
              color: 'hsl(305, 70%, 50%)',
              loc: 1725
            },
            {
              name: 'xAxis',
              color: 'hsl(354, 70%, 50%)',
              loc: 64723
            },
            {
              name: 'yAxis',
              color: 'hsl(251, 70%, 50%)',
              loc: 197230
            },
            {
              name: 'layers',
              color: 'hsl(158, 70%, 50%)',
              loc: 96505
            }
          ]
        },
        {
          name: 'pie',
          color: 'hsl(79, 70%, 50%)',
          children: [
            {
              name: 'chart',
              color: 'hsl(188, 70%, 50%)',
              children: [
                {
                  name: 'pie',
                  color: 'hsl(243, 70%, 50%)',
                  children: [
                    {
                      name: 'outline',
                      color: 'hsl(128, 70%, 50%)',
                      loc: 199669
                    },
                    {
                      name: 'slices',
                      color: 'hsl(250, 70%, 50%)',
                      loc: 30764
                    },
                    {
                      name: 'bbox',
                      color: 'hsl(182, 70%, 50%)',
                      loc: 196764
                    }
                  ]
                },
                {
                  name: 'donut',
                  color: 'hsl(7, 70%, 50%)',
                  loc: 167152
                },
                {
                  name: 'gauge',
                  color: 'hsl(84, 70%, 50%)',
                  loc: 20702
                }
              ]
            },
            {
              name: 'legends',
              color: 'hsl(350, 70%, 50%)',
              loc: 177857
            }
          ]
        }
      ]
    },
    {
      name: 'colors',
      color: 'hsl(164, 70%, 50%)',
      children: [
        {
          name: 'rgb',
          color: 'hsl(358, 70%, 50%)',
          loc: 178840
        },
        {
          name: 'hsl',
          color: 'hsl(4, 70%, 50%)',
          loc: 174003
        }
      ]
    },
    {
      name: 'utils',
      color: 'hsl(54, 70%, 50%)',
      children: [
        {
          name: 'randomize',
          color: 'hsl(328, 70%, 50%)',
          loc: 180656
        },
        {
          name: 'resetClock',
          color: 'hsl(14, 70%, 50%)',
          loc: 38764
        },
        {
          name: 'noop',
          color: 'hsl(336, 70%, 50%)',
          loc: 197949
        },
        {
          name: 'tick',
          color: 'hsl(224, 70%, 50%)',
          loc: 191569
        },
        {
          name: 'forceGC',
          color: 'hsl(138, 70%, 50%)',
          loc: 177638
        },
        {
          name: 'stackTrace',
          color: 'hsl(8, 70%, 50%)',
          loc: 150326
        },
        {
          name: 'dbg',
          color: 'hsl(196, 70%, 50%)',
          loc: 194081
        }
      ]
    },
    {
      name: 'generators',
      color: 'hsl(103, 70%, 50%)',
      children: [
        {
          name: 'address',
          color: 'hsl(76, 70%, 50%)',
          loc: 43692
        },
        {
          name: 'city',
          color: 'hsl(193, 70%, 50%)',
          loc: 68217
        },
        {
          name: 'animal',
          color: 'hsl(233, 70%, 50%)',
          loc: 93033
        },
        {
          name: 'movie',
          color: 'hsl(292, 70%, 50%)',
          loc: 134221
        },
        {
          name: 'user',
          color: 'hsl(112, 70%, 50%)',
          loc: 2776
        }
      ]
    },
    {
      name: 'set',
      color: 'hsl(322, 70%, 50%)',
      children: [
        {
          name: 'clone',
          color: 'hsl(232, 70%, 50%)',
          loc: 16264
        },
        {
          name: 'intersect',
          color: 'hsl(325, 70%, 50%)',
          loc: 26344
        },
        {
          name: 'merge',
          color: 'hsl(121, 70%, 50%)',
          loc: 28169
        },
        {
          name: 'reverse',
          color: 'hsl(273, 70%, 50%)',
          loc: 140355
        },
        {
          name: 'toArray',
          color: 'hsl(294, 70%, 50%)',
          loc: 29994
        },
        {
          name: 'toObject',
          color: 'hsl(57, 70%, 50%)',
          loc: 179174
        },
        {
          name: 'fromCSV',
          color: 'hsl(351, 70%, 50%)',
          loc: 67120
        },
        {
          name: 'slice',
          color: 'hsl(233, 70%, 50%)',
          loc: 39285
        },
        {
          name: 'append',
          color: 'hsl(319, 70%, 50%)',
          loc: 170548
        },
        {
          name: 'prepend',
          color: 'hsl(348, 70%, 50%)',
          loc: 6297
        },
        {
          name: 'shuffle',
          color: 'hsl(118, 70%, 50%)',
          loc: 6136
        },
        {
          name: 'pick',
          color: 'hsl(264, 70%, 50%)',
          loc: 95930
        },
        {
          name: 'plouc',
          color: 'hsl(37, 70%, 50%)',
          loc: 79178
        }
      ]
    },
    {
      name: 'text',
      color: 'hsl(81, 70%, 50%)',
      children: [
        {
          name: 'trim',
          color: 'hsl(11, 70%, 50%)',
          loc: 167319
        },
        {
          name: 'slugify',
          color: 'hsl(36, 70%, 50%)',
          loc: 134092
        },
        {
          name: 'snakeCase',
          color: 'hsl(213, 70%, 50%)',
          loc: 10207
        },
        {
          name: 'camelCase',
          color: 'hsl(183, 70%, 50%)',
          loc: 27693
        },
        {
          name: 'repeat',
          color: 'hsl(136, 70%, 50%)',
          loc: 5788
        },
        {
          name: 'padLeft',
          color: 'hsl(248, 70%, 50%)',
          loc: 182981
        },
        {
          name: 'padRight',
          color: 'hsl(165, 70%, 50%)',
          loc: 73369
        },
        {
          name: 'sanitize',
          color: 'hsl(234, 70%, 50%)',
          loc: 73536
        },
        {
          name: 'ploucify',
          color: 'hsl(84, 70%, 50%)',
          loc: 73168
        }
      ]
    },
    {
      name: 'misc',
      color: 'hsl(223, 70%, 50%)',
      children: [
        {
          name: 'whatever',
          color: 'hsl(159, 70%, 50%)',
          children: [
            {
              name: 'hey',
              color: 'hsl(264, 70%, 50%)',
              loc: 185170
            },
            {
              name: 'WTF',
              color: 'hsl(220, 70%, 50%)',
              loc: 128598
            },
            {
              name: 'lol',
              color: 'hsl(278, 70%, 50%)',
              loc: 76924
            },
            {
              name: 'IMHO',
              color: 'hsl(168, 70%, 50%)',
              loc: 105834
            }
          ]
        },
        {
          name: 'other',
          color: 'hsl(54, 70%, 50%)',
          loc: 21885
        },
        {
          name: 'crap',
          color: 'hsl(283, 70%, 50%)',
          children: [
            {
              name: 'crapA',
              color: 'hsl(73, 70%, 50%)',
              loc: 104346
            },
            {
              name: 'crapB',
              color: 'hsl(157, 70%, 50%)',
              children: [
                {
                  name: 'crapB1',
                  color: 'hsl(343, 70%, 50%)',
                  loc: 140775
                },
                {
                  name: 'crapB2',
                  color: 'hsl(294, 70%, 50%)',
                  loc: 97180
                },
                {
                  name: 'crapB3',
                  color: 'hsl(272, 70%, 50%)',
                  loc: 176272
                },
                {
                  name: 'crapB4',
                  color: 'hsl(136, 70%, 50%)',
                  loc: 97002
                }
              ]
            },
            {
              name: 'crapC',
              color: 'hsl(37, 70%, 50%)',
              children: [
                {
                  name: 'crapC1',
                  color: 'hsl(273, 70%, 50%)',
                  loc: 67773
                },
                {
                  name: 'crapC2',
                  color: 'hsl(255, 70%, 50%)',
                  loc: 46950
                },
                {
                  name: 'crapC3',
                  color: 'hsl(124, 70%, 50%)',
                  loc: 59415
                },
                {
                  name: 'crapC4',
                  color: 'hsl(349, 70%, 50%)',
                  loc: 199884
                },
                {
                  name: 'crapC5',
                  color: 'hsl(338, 70%, 50%)',
                  loc: 125918
                },
                {
                  name: 'crapC6',
                  color: 'hsl(50, 70%, 50%)',
                  loc: 153279
                },
                {
                  name: 'crapC7',
                  color: 'hsl(117, 70%, 50%)',
                  loc: 33399
                },
                {
                  name: 'crapC8',
                  color: 'hsl(235, 70%, 50%)',
                  loc: 174296
                },
                {
                  name: 'crapC9',
                  color: 'hsl(324, 70%, 50%)',
                  loc: 190644
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
