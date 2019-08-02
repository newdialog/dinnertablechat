import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveBar } from '@nivo/bar';
import * as AppModel from '../../models/AppModel';
import { ResponsiveBubble } from '@nivo/circle-packing';
import { getOtherTopics } from 'utils/TopicInfo';

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
  id: string;
}

export default function ConfBars(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();
  // const [state, setState] = React.useState<State>({ data: [], checks: 0 });

  // console.log('ConfBars', props.data);
  if(props.data.length === 0) return null;

  // array of users ans answers
  const data2 = props.data.flatMap( (g, index) => {
    return Object.keys(g).flatMap(k => {
      const val = g[k];
      return { name: k, answers: val }
    });
  });

  // console.log('data2', data2);

  // get ansers
  const tdata = getOtherTopics(props.id, t, 'conf');
  const numQ = tdata.length;

  // console.log('tdata', tdata, numQ);

  // Users into question response totals
  // ex [{id: "conf-pub1-q0-id", Yes: 11, No: 2}]
  const keys:string[] = [];
  const data3 = tdata.map( (q, qindex) => {
    const pss = q.positions;
    const answ = {};
    pss.forEach((qr,i) => {
      // console.log('q', qr, i);
      if(keys.indexOf(qr)===-1) keys.push(qr);
      answ[qr] = data2.filter((u, index)=>u.answers[q.id]===i).length;
    });
    return { id: (qindex+1).toString(), ...answ }
  });

  // console.log('data3', data3, keys);

  // return null;
  // console.log(JSON.stringify(valo, null, 2));

  return (
    <div className={classes.layout}>
      <ResponsiveBar
        data={data3}
        keys={keys}
        indexBy={'id'}
        reverse={true}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        layout="horizontal"
        colors={{ scheme: 'nivo' }}
        tooltip={({ id, value, color }) => (
          <strong style={{ color: 'black' }}>
            {id}
          </strong>
        )}
        innerPadding={3}
        // borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'responses',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'questions',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
    </div>
  );
}