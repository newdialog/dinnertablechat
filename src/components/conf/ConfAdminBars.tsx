import { Theme } from '@material-ui/core/styles';
import { makeStyles } from'@material-ui/core/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveBar } from '@nivo/bar';
import * as AppModel from '../../models/AppModel';
import { ResponsiveBubble } from '@nivo/circle-packing';
// import { getOtherTopics } from 'utils/TopicInfo';
import { Typography } from '@material-ui/core';
const {linearGradientDef} = require('@nivo/core') 

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',
      marginTop: '1em',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    layout2: {
      width: '100%',
      height: '64px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    bar: {
      width: '100%',
      height: '64px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    barLarge: {
      width: '100%',
      height: `calc(50vh / 5)`,
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
  { name: 'ConfAdminBars' }
);

interface Props {
  store: AppModel.Type;
  payload: any;
  id: string;
  large?: boolean;
  questions: any;
}

const btheme = {
  legends: {
    text: {
      fontSize: '1em',
      fontWeight: 500
    }
  },
  labels: {
    text: {
      fontSize: '1.4em',
      fontWeight: 500
    }
  }
};

export default function ConfAdminBars(props: Props) {
  const store = props.store;
  const { t } = useTranslation();
  // const [state, setState] = React.useState<State>({ data: [], checks: 0 });

  const data = props.payload.data; // .results
  const classes = useStyles({numElem:data.length});

  if(data.length === 0) return null;
  
  // array of users ans answers
  const data2 = data.map(u => {
    return {name:u.user, answers: u.answers};
  })


  // get ansers
  const tdata: [{proposition:string, id:string, positions: string[]}]  = props.questions; // getOtherTopics(props.id, t, 'conf');
  // const numQ = tdata.length;

  // Users into question response totals
  // ex [{id: "conf-pub1-q0-id", Yes: 11, No: 2}]
  let keys:string[] = [];
  const data3 = tdata.map( (q, qindex) => {
    const pss = q.positions;
    const answ = {};

    let propo = q.proposition;
    // const lineLimit = 100;
    // if(propo.length > lineLimit) propo = propo.slice(0, (lineLimit - propo.length)) + '...';

    pss.forEach((qr,i) => {
      if(keys.indexOf(qr)===-1) keys.push(qr);

      const tally = data2.filter((u, index)=>u.answers[q.id]===i).length;
      answ[qr] = tally === 0 ? 0 : tally;
    });

    
    
    return { id: (qindex+1).toString(), ...answ, proposition: propo, version: props.questions.version! }
  });

  return (
    <div className={classes.layout}>
      {data3.map((r, index) => {
        // console.log('r', r);
        return (
          <span key={index}>
            <Typography align="left" variant="body1" style={{marginLeft:'20px'}}>
              {r.proposition}
            </Typography>
            <div key={index} className={classes.layout2}>
              {makeBar([r], keys, index)} 
            </div>
          </span>
        );
      })}
    </div>
  );
}

function makeBar(data3: any, keys: any, key: number) {
  return (
    <ResponsiveBar
      theme={btheme}
      layers={
        [
          'grid',
          'bars',
          'markers',
          'legends',
          'annotations'
        ] as any
      }
      key={key}
      data={data3}
      keys={keys}
      axisBottom={null}
      axisLeft={null}
      indexBy={'id'}
      reverse={true}
      margin={{ top: 3, right: 20, bottom: 10, left: 20 }}
      padding={0.1}
      layout="horizontal"
      colors={{ scheme: 'nivo' }}
      tooltip={({ id, value, color }) => (
        <strong style={{ color: 'black' }}>{value + ' ' + id}</strong>
      )}
      label={({ id, value }) => value + ' ' + id}
      innerPadding={4}
      axisTop={null}
      axisRight={null}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor='#282828'
      legends={undefined}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      // labelTextColor='white'
    />
  );
}

function makeBar2(data3:any, keys:any, key:number) {
  return <ResponsiveBar
        theme={btheme}
        layers={['bars', 'legends', 'annotations'] as any}
        key={key}
        data={data3}
        keys={keys}
        axisBottom={null}
        axisLeft={null}
        indexBy={'id'}
        reverse={true}
        margin={{ top: 22, right: 130, bottom: 0, left: 20 }}
        padding={0.1}
        layout="horizontal"
        colors={{ scheme: 'nivo' }}
        tooltip={({ id, value, color }) => (
          <strong style={{ color: 'black' }}>
            {id}
          </strong>
        )}
        innerPadding={4}
        // borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}

        defs={[
          linearGradientDef('gradientA', [
            { offset: 0, color: '#ff896b' }
        ]),
        linearGradientDef('gradientB', [
            { offset: 0, color: '#06a7bf' }
        ]),
          {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true
          },
          {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
          }
      ]}
      fill={[
          {
              match: {
                  id: keys[1]
              },
              id: 'gradientA'
          },
          {
              match: {
                id: keys[0]
              },
              id: 'gradientB'
          }
      ]}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor='white'
        // labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={ [
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
}

/*

          <Typography variant="body1">
            {r.proposition}
          </Typography>
          */