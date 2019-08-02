import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import * as AppModel from '../../models/AppModel';
import { ResponsiveBubble } from '@nivo/circle-packing';
import { getGroupByIndex } from 'utils/TopicInfo';

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',
      height: '30vh',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    btn: {
      color: '#ffffff',
      fontSize: '1.1em'
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
  confid: string;
}

export default function ConfGraph(props: Props) {
  // const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  // const [state, setState] = React.useState<State>({ data: [], checks: 0 });

  // console.log('ConfGraph', props.data);
  if(props.data.length === 0) return null;

  const data2 = props.data.map( (g, index) => {
    const children = Object.keys(g).map(k => {
      const val = g[k];
      return { name: 'USER: ' + k, color: 'hsl(79, 70%, 50%)', loc: 100 }
    });

    const name = 'GROUP: ' + getGroupByIndex(props.confid, index, t);
    return { name, children, color: 'hsl(245, 70%, 50%)' }
  });

  const valo = {
    name: 'TOTAL',
    color: 'hsl(34, 70%, 50%)',
    children: data2
  }

  // console.log(JSON.stringify(valo, null, 2));

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
        tooltip={({ id, value, color }) => (
          <strong style={{ color: 'black' }}>
            {id}
          </strong>
        )}
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