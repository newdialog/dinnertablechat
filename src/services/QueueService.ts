import AWS from 'aws-sdk';
import { integer, float } from 'aws-sdk/clients/lightsail';

let gameLift: AWS.GameLift;

export function init() {
  const options: AWS.GameLift.ClientConfiguration = {}
  gameLift = new AWS.GameLift(options)
}

function onMatch(err: AWS.AWSError, data: AWS.GameLift.StartMatchmakingOutput) {
  if (err) {
    console.log('onMatch', err)
    return;
  }
  console.log('onMatch output', data.MatchmakingTicket)
}

export function queueUp(topic: string, side: integer, playerId: string, donation: float) {
  const teamName = side === 0 ? 'red' : 'blue';
  console.log('queueUp');
  const options: AWS.GameLift.StartMatchmakingInput = {
    ConfigurationName: 'dtc-match-config',
    // TicketId: 'STRING_VALUE', allow autogeneration
    Players: [ /* required */
      {
        LatencyInMs: {
          '<NonEmptyString>': 0,
          /* '<NonEmptyString>': ... */
        },
        PlayerAttributes: {
          'side': { 'N': side },
          'donation': { 'N': donation },
          'topic': { 'S': topic },
        },
        PlayerId: playerId,
        Team: teamName
      }
    ]
  }
  gameLift.startMatchmaking(options, onMatch)
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