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