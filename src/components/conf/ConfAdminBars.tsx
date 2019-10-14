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
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    layout2: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      minHeight: '50vh'
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
  
  // console.log('ConfBars', props.data);
  // array of users ans answers
  const data2 = data.map(u => {
    return {name:u.user, answers: u.answers};
  })

  // console.log('data2', data2);

  // get ansers
  const tdata = props.questions; // getOtherTopics(props.id, t, 'conf');
  // const numQ = tdata.length;

  // console.log('tdata', tdata, numQ);

  // Users into question response totals
  // ex [{id: "conf-pub1-q0-id", Yes: 11, No: 2}]
  let keys:string[] = [];
  const data3 = tdata.map( (q, qindex) => {
    const pss = q.positions;
    const answ = {};
    pss.forEach((qr,i) => {
      if(keys.indexOf(qr)===-1) keys.push(qr);

      const tally = data2.filter((u, index)=>u.answers[q.id]===i).length;
      answ[qr] = tally === 0 ? 0.01 : tally;
    });

    let propo = q.proposition;
    if(propo.length > 48) propo = propo.slice(0, (48 - propo.length)) + '...';
    
    return { id: (qindex+1).toString(), ...answ, proposition: propo}
  });

  console.log('data3', data3, tdata);

  // return null;
  // console.log(JSON.stringify(valo, null, 2));

  const layoutStyle = props.large ? classes.layout2 : classes.layout;
  const barStyle = props.large ? classes.barLarge : classes.bar;
  const barStyleOv = props.large ? {height:`calc(50vh / ${data3.length})`} : {};

  return (
    <div className={layoutStyle}>
      {data3.map( (r, index) => {
        return <div key={index} className={barStyle} style={barStyleOv}>
          {makeBar([r], keys, index, index===data3.length-1)}
        </div>
      })}
    </div>
  );
}

const Notes = (props:any) => {
  const { bars, xScale, yScale, data } = props;
  // debugger
  return <React.Fragment>{data.map( (bar, key) => {
    return <text key={key} style={{color:'#444444', fontSize: '1.15em'}}>
            {(key+1)}. {bar.proposition}
          </text>
  })}</React.Fragment>
}

function makeBar(data3:any, keys:any, key:number, showLegend:boolean) {
  return <ResponsiveBar
        theme={btheme}
        layers={['grid', 'axes', 'bars', Notes, 'markers', 'legends', 'annotations'] as any}
        key={key}
        data={data3}
        keys={keys}
        axisBottom={null}
        axisLeft={null}
        indexBy={'id'}
        reverse={true}
        margin={{ top: 22, right: 130, bottom: 0, left: 60 }}
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
        /* axisBottom={{
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
        }} */
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor='white'
        // labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={ !showLegend ? undefined : [
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