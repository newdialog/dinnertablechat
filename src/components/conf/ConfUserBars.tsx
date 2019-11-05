import { Theme } from '@material-ui/core/styles';
import { makeStyles } from'@material-ui/core/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveBar } from '@nivo/bar';
import * as AppModel from '../../models/AppModel';
import { ResponsiveBubble } from '@nivo/circle-packing';
import { getOtherTopics } from 'utils/TopicInfo';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    layout2: {
      width: '100%',
      height: '64px',
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
  { name: 'ConfUserBars' }
);

interface Props {
  store: AppModel.Type;
  data: any;
  qdata: any;
  id: string;
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

export default function ConfUserBars(props: Props) {
  const store = props.store;
  const classes = useStyles({});
  const { t } = useTranslation();

  const data2 = props.data.members.map((x, i) => ({ name: i, answers: x }));

  /*
  qdata {
  0:
    us-east-1:996b8af9-c5bd-41c8-bee7-4068792f28e0:
      conf-bbb-q0-id: 0
      conf-bbb-q1-id: 1
  */

  // get ansers
  const tdata = props.questions; // getOtherTopics(props.id, t, 'conf');
  // debugger;

  // Users into question response totals
  // ex [{id: "conf-pub1-q0-id", Yes: 11, No: 2}]
  const keys: string[] = [];
  const data3 = tdata.map((q, qindex) => {
    const pss = q.positions;
    const answ = {};
    pss.forEach((qr, i) => {
      // console.log('q', qr, i);
      if (keys.indexOf(qr) === -1) keys.push(qr);
      answ[qr] = data2.filter((u, index) => u.answers[q.id] === i).length;
    });
    return { id: (qindex + 1).toString(), ...answ, proposition: q.proposition };
  });

  // console.log('data3', data3, tdata);

  // return null;
  // console.log(JSON.stringify(valo, null, 2));

  return (
    <div className={classes.layout}>
      {data3.map((r, index) => {
        // console.log('r', r);
        return (
          <span key={index}>
            <Typography variant="body1">
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
    />
  );
}
