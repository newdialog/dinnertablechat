import AWS, { GameLift } from 'aws-sdk';
import { integer, float } from 'aws-sdk/clients/lightsail';

let gameLift: AWS.GameLift;

export function init(options: AWS.GameLift.ClientConfiguration) {
  console.log('gamelift init accessKeyId sessionToken', options.accessKeyId);
  if(!!gameLift) return;
  /* const options: AWS.GameLift.ClientConfiguration = { 
    region: 'us-east-1',
    accessKeyId,
    secretAccessKey,
    sessionToken
  }; */
  gameLift = new AWS.GameLift(options);
}

function onMatch(err: AWS.AWSError, data: AWS.GameLift.StartMatchmakingOutput) {
  if (err) {
    console.log('onMatch', err);
    return;
  }
  console.log('onMatch output', data.MatchmakingTicket);
  console.log('onMatch Status', data.MatchmakingTicket!.Status);

  if(data.MatchmakingTicket!.Status==='QUEUED') {
    console.log('data.MatchmakingTicket!.TicketId!', data.MatchmakingTicket!.TicketId!)
    poll(data.MatchmakingTicket!.TicketId!);
  }
}

async function poll(id:string) {
  // const info = await 
  // gameLift.dec
  gameLift.describeMatchmaking({TicketIds: [id]}, (e:any, d:any) => {
    if(e) return console.log('err', e);
    const ticket = d.TicketList[0];
    if(ticket.Players.length > 1) {
      console.log('!!!', ticket.Players);
      return;
    }
    if(ticket.Status === 'PLACING') {
      // console.log('entering placing, stopping poll')
      // return;
    }
    if(ticket.Status === 'TIMED_OUT') {
      console.log('timed out, stopping poll')
      return;
    }
    console.log('ticketinfo', ticket.Status, ticket)
    setTimeout(poll, 9000, id)
  });
  // console.log('info', info)
  // 
}

export function queueUp(topic: string, side: integer, playerId: string, donation: float) {
  
  const teamName = side === 0 ? 'red' : 'blue';
  console.log('queueUp', topic, side, playerId, donation, 'teamName: ' + teamName)

  const options: AWS.GameLift.StartMatchmakingInput = {
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
          topic: { S: topic }
        },
        PlayerId: playerId,
        Team: teamName
      }
    ]
  };
  gameLift.startMatchmaking(options, onMatch);
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
