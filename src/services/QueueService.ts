// import AWS, { GameLift } from 'aws-sdk';

import GameLift from 'aws-sdk/clients/gamelift';
// import DynamoDB from 'aws-sdk/clients/dynamodb'
import AWS from 'aws-sdk/global';

import { integer, float } from 'aws-sdk/clients/lightsail';
import * as shake from './HandShakeService';
import * as DebateModel from '../models/DebateModel';
type OnMatched = DebateModel.MatchModelType;

let gameLift: GameLift;

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

function onMatchEvent(
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
    poll(onMatchedCB, data.MatchmakingTicket!.TicketId!, pid);
  }
}

async function poll(onMatchedCB: OnMatchedCB, tid: string, playerId: string) {
  // const info = await
  // gameLift.dec
  gameLift.describeMatchmaking({ TicketIds: [tid] }, async (e: any, d: any) => {
    if (e) return console.log('err', e);
    const ticket = d.TicketList[0];
    if (ticket.Players.length > 1) {
      console.log('!!!', ticket.Players);
      return;
    }
    if (ticket.Status === 'PLACING') {
      console.log('entering placing, stopping poll');
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
    console.log('ticketinfo', ticket.Status, ticket);
    setTimeout(poll, 9000, onMatchedCB, tid, playerId);
  });
  // console.log('info', info)
  //
}

type ErrorString = string;
type OnMatchedCB = (model: OnMatched | ErrorString) => void;
export function queueUp(
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
  gameLift.startMatchmaking(options, onMatchEvent.bind(null, onMatchedCB));
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
