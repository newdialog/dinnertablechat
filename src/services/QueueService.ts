import AWS from 'aws-sdk';

let gameLift: AWS.GameLift;

export function init() {
  const options: AWS.GameLift.ClientConfiguration = {}
  gameLift = new AWS.GameLift(options)
}

function onMatch(err: AWS.AWSError, data: AWS.GameLift.StartMatchmakingOutput) {
  
}

export function queueUp() {
  console.log('queueUp');
  const options: AWS.GameLift.StartMatchmakingInput = {
    ConfigurationName: 'STRING_VALUE',
    // TicketId: 'STRING_VALUE'
    Players: [ /* required */
      {
        LatencyInMs: {
          '<NonEmptyString>': 0,
          /* '<NonEmptyString>': ... */
        },
        PlayerAttributes: {

        },
        PlayerId: 'STRING_VALUE',
        Team: 'STRING_VALUE'
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