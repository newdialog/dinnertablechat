// import AWS, { GameLift } from 'aws-sdk';

import GameLift from 'aws-sdk/clients/gamelift';
// import DynamoDB from 'aws-sdk/clients/dynamodb'
import AWS from 'aws-sdk/global';

import { integer, float } from 'aws-sdk/clients/lightsail';
import * as shake from './HandShakeService';
import * as DebateModel from '../models/DebateModel';
type OnMatched = DebateModel.MatchModelType;

let gameLift: GameLift;

import retry from 'async-retry';

const stopFlags: { [ticket: string]: StopFlag } = {}; // ticketid: flag

const delayProp = async (obj: { flag: boolean }, prop: string) =>
  await retry(
    async bail => {
      if (obj[prop]) return true;
      else throw new Error('retry');
    },
    {
      retries: 8,
      factor: 1,
      maxTimeout: 1000,
      minTimeout: 1000
    }
  );
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function init(options: GameLift.ClientConfiguration) {
  console.log('gamelift init accessKeyId sessionToken', options.accessKeyId);
  if (!!gameLift) return;
  /* const options: AWS.GameLift.ClientConfiguration = { 
    region: 'us-east-1',
    accessKeyId,
    secretAccessKey,
    sessionToken
  }; */
  gameLift = new GameLift(options);
}

interface StopFlag {
  flag: boolean;
}

function onMatchEvent(
  stopFlag: StopFlag,
  onMatchedCB: OnMatchedCB,
  err: AWS.AWSError,
  data: GameLift.StartMatchmakingOutput
) {
  if (err) {
    console.log('onMatch', err);
    if (err.toString().indexOf('expired') !== -1) {
      onMatchedCB('expired_login');
    } else {
      onMatchedCB('qerror');
    }
    return;
  }
  console.log('onMatch output', data.MatchmakingTicket);
  console.log('onMatch Status', data.MatchmakingTicket!.Status);

  if (data.MatchmakingTicket!.Status === 'QUEUED') {
    console.log(
      'data.MatchmakingTicket!.TicketId!',
      data.MatchmakingTicket!.TicketId!
    );

    const pid: string = data.MatchmakingTicket!.Players![0].PlayerId!;
    console.log('pid', pid);
    poll(stopFlag, onMatchedCB, data.MatchmakingTicket!.TicketId!, pid);
  }
}

async function poll(
  stopFlag: StopFlag,
  onMatchedCB: OnMatchedCB,
  tid: string,
  playerId: string
) {
  if (stopFlag.flag) return; // end;
  // const info = await
  // gameLift.dec
  gameLift.describeMatchmaking({ TicketIds: [tid] }, async (e: any, d: any) => {
    if (e) return console.log('err', e);
    if (stopFlag.flag) return; // end;

    const ticket = d.TicketList[0];
    if (ticket.Players.length > 1) {
      console.log('!!!', ticket.Players);
      return;
    }
    if (ticket.Status === 'PLACING') {
      console.log('entering placing, stopping poll', ticket);
      // return;
      await delay(2500);
      const player = await shake.sync(playerId); // allow time for lambda to save
      onMatchedCB({
        team: player.team as any,
        leader: player.leader,
        matchId: player.match,
        sync: false,
        userId: playerId,
        otherState: null,
        timeStarted: 0
      });
      return;
    }
    if (ticket.Status === 'TIMED_OUT') {
      onMatchedCB('timeout');
      console.log('timed out, stopping poll');
      return; // not polling
    }
    if (ticket.Status === 'CANCELLED') {
      onMatchedCB('CANCELLED');
      console.log('CANCELLED, stopping poll');
      return; // not polling
    }
    console.log('ticketinfo', ticket.Status, ticket);
    setTimeout(poll, 9000, stopFlag, onMatchedCB, tid, playerId);
  });
  // console.log('info', info)
  //
}

type ErrorString = string;
type OnMatchedCB = (model: OnMatched | ErrorString) => void;
export async function queueUp(
  topic: string,
  side: integer,
  playerId: string,
  donation: float,
  chararacter: integer,
  onMatchedCB: OnMatchedCB
) {
  const teamName = side === 0 ? 'red' : 'blue';
  console.log(
    'queueUp',
    topic,
    'side ' + side,
    playerId,
    donation,
    'chararacter: ' + chararacter,
    'teamName: ' + teamName
  );

  const options: GameLift.StartMatchmakingInput = {
    ConfigurationName: 'dtc-match-config',
    // TicketId: 'STRING_VALUE', allow autogeneration
    Players: [
      /* required */
      {
        /* LatencyInMs: {
          '<NonEmptyString>': 0
        },*/
        PlayerAttributes: {
          side: { N: side },
          donation: { N: donation },
          character: { N: chararacter },
          topic: { S: topic }
        },
        PlayerId: playerId,
        Team: teamName
      }
    ]
  };
  const stopFlag: StopFlag = { flag: false };
  const r = (await gameLift.startMatchmaking(
    options,
    onMatchEvent.bind(null, stopFlag, onMatchedCB)
  )) as any; // const r = .promise();
  await delayProp(r.response, 'data');
  const TicketId = r.response.data.MatchmakingTicket.TicketId;
  console.log('r.MatchmakingTicket!.TicketId', TicketId);
  stopFlags[TicketId] = stopFlag;
  return TicketId;
}

export async function stopMatchmaking(TicketId: string) {
  console.log('stopMatchmaking');
  // stop our queue
  if (stopFlags[TicketId]) {
    console.log('queue stopFlag set');
    stopFlags[TicketId].flag = true;
  }
  try {
    const r = await gameLift.stopMatchmaking({ TicketId }).promise();
    console.log('stoppedMatchmaking TicketId', TicketId, r);
  } catch (e) {
    // console.log(e);
  }
  return true;
}

// todo remove later
export async function stopMatchmakingSimple(TicketId: string) {
  console.log('stopMatchmakingSimple');
  // stop our queue
  if (stopFlags[TicketId]) {
    console.log('queue stopFlag set');
    stopFlags[TicketId].flag = true;
  }
  const r = gameLift.stopMatchmaking({ TicketId }, e => {
    console.log('STOPPED');
  });
  console.log('stoppedMatchmakingSimple TicketId', TicketId);
  return true;
}

/*
          '<NonZeroAndMaxString>': {
            N: 0.0,
            S: 'STRING_VALUE',
            SDM: {
              '<NonZeroAndMaxString>': 0.0,
            },
            SL: [
              'STRING_VALUE',
            ]
          },
*/
