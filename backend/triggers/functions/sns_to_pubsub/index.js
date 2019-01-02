// const AWSXRay = require('aws-xray-sdk');
const AWS = require('aws-sdk'); // AWSXRay.captureAWS(require('aws-sdk'));
const gamelift = new AWS.GameLift();
const { Pool } = require('pg'); // AWSXRay.capturePostgres(require('pg'));


console.log('Loading function');
// AWSXRay.enableManualMode();

/*
const db = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});
*/
const docClient = new AWS.DynamoDB.DocumentClient();
const pool = new Pool();
// connection.connect();

async function query() {
  var params = {
    Key: {
      "user": {
        S: "x"
      }
    },
    TableName: "dtc_sync"
  };
  var t = await docClient.query(params);
  console.log('t,', t.response)
  return t;
}

exports.handle = async (event, context, callback) => {
  // await query();
  // console.log('Received event:', JSON.stringify(event, null, 4));
  // var message = JSON.parse(event.Records[0].Sns.Message);
  if (!event.Records || event.Records.length < 1 || !event.Records[0].Sns) {
    callback(null, "Success, not sns");
    return;
  }
  event.Records.forEach(forEachSNS);
  if (event.Records.length > 1) console.log("event.Records.length", event.Records.length)

  callback(null, "Success");
};

async function forEachSNS(record) {
  const message = JSON.parse(record.Sns.Message);
  const tickets = message.detail.tickets;
  const type = message.detail.type;
  const players = message.detail.gameSessionInfo.players;
  const matchId = message.detail.matchId;

  /* var segment = new AWSXRay.Segment('sns_to_pubsub', matchId);
  AWSXRay.setSegment(segment); */

  // const topic = message.detail.topic;
  var accepted = type === 'PotentialMatchCreated';
  if (!accepted) {
    // console.log('bad type', type);
    // ignore other event types
    return;
  }
  // console.log('PotentialMatchCreated', matchId, JSON.stringify(message));

  const ticketIds = tickets.map(t => t.ticketId);
  const matchInfo = await gamelift.describeMatchmaking( {TicketIds:ticketIds} ).promise();

  // clear queue
  /*
  ticketIds.forEach( ticket => {
    gamelift.stopMatchmaking({ "TicketId": ticket} ).promise().then(r=> {
      console.log('stopMatchmaking',matchId,ticket, r);
    });
  });
  const a = await gamelift.acceptMatch({
    "AcceptanceType": "ACCEPT",
    "PlayerIds": [ "string" ],
    "TicketId": ticketIds[0]
 }).promise()
 */

  // console.log('Message received from SNS:', JSON.stringify(message));
  // JSON.stringify(tickets), 
  // , 'players', JSON.stringify(players)
  console.log('MATCHREQ:', matchId, 'TICKETS:', ticketIds);

  const success = await savePG(players, matchId, matchInfo);
  if(success) await saveDB(players, matchId);
}

async function savePG(players, matchId, matchInfo) {
  // console.log('matchInfo', matchInfo);
  const player0 = matchInfo.TicketList[0].Players[0];
  const player0Id = player0.PlayerId;
  const side0 = player0.PlayerAttributes.side.N;
  const chracter0 = player0.PlayerAttributes.character.N;
  
  const donation = player0.PlayerAttributes.donation.N;
  const topic = player0.PlayerAttributes.topic.S;
  // --
  const player1 = matchInfo.TicketList[1].Players[0];
  const player1Id = player1.PlayerId;
  const side1 = player1.PlayerAttributes.side.N;
  const chracter1 = player1.PlayerAttributes.character.N;

  // console.log('player0', player0);

  // return;
  const client = await pool.connect();
  let success = true;
  try {
    await client.query('BEGIN');
    const r1 = await client.query(`INSERT INTO public.debate_session(
      id, topic)
      VALUES ($1, $2);`, [matchId, topic]);

    const r2 = await client.query(`INSERT INTO public.debate_session_users(
      user_id, debate_session_id, side, "character")
      VALUES ($1, $2, $3, $4);`, [player0Id, matchId, side0, chracter0]);

    const r3 = await client.query(`INSERT INTO public.debate_session_users(
        user_id, debate_session_id, side, "character")
        VALUES ($1, $2, $3, $4);`, [player1Id, matchId, side1, chracter1]);

    await client.query('COMMIT');
    console.log('MATCHSAVED:', matchId);

    } catch (e) {
      success = false;
      await client.query('ROLLBACK');
       // normal for duisplicate sns
      if(e.toString().indexOf('duplicate')!==-1) {
        console.log('DUPLICATE', matchId);
         // do not throw, abort error is normal
        return;
      }

      console.error('MATCHSQLErr: id', matchId, 'topic', topic, e);
      throw e;
    } finally {
      client.release();
    }
    return success;
}

async function saveDB(players, matchId) {
  const params = getQParam(players, matchId)

  const data = await docClient.batchWrite(params).promise();

  /*
  , function (err, data) {
    if (err) console.warn('!!! ERROR', err);
    // else console.log('updated db')
  }
  */
 return data;
}

function getQParam(players, matchId) {
  const ranPick = (Math.round() > .5) ? 0 : 1;
  // leader
  var red = players[ranPick]; // players.filter(p => p.team === 'red')[0];
  // flip
  var blue = players[ranPick===0 ? 1 : 0]; // players.filter(p => p.team === 'blue')[0];

  const ttl = Math.round((new Date).getTime() / 1000) + 60 * 3; // +3min
  const ttl2 = Math.round((new Date).getTime() / 1000) + 60 * 60; // +60min

  return {
    RequestItems: {
      "match": [{
        PutRequest: {
          Item: {
            "id": matchId,
            "redkey": "-",
            "bluekey": "-",
            "redkeyi": [],
            "bluekeyi": [], // documentClient.createSet([]),
            "ttl": '' + ttl2
          }
        }
      }],
      "dtc_sync": [{
          PutRequest: {
            Item: {
              "user": '' + red.playerId,
              "leader": true,
              "team": 'red',
              "match": matchId,
              "ttl": '' + ttl
            }
          }
        },
        {
          PutRequest: {
            Item: {
              "user": '' + blue.playerId,
              "leader": false,
              "team": 'blue',
              "match": matchId,
              "ttl": '' + ttl
            }
          }
        }
      ]
    }
  };
}

/*
r: { N: 1 },
  donation: { N: 0 },
  lang: { S: 'en' },
  side: { N: 1 },
  topic: { S: 'Immigration' } }
/aws/lambda/dtc-matchshake_sns_to_pubsub 2018-11-16T03:12:05.103Z	6406c9db-e94d-11e8-b9e2-552ea46a9e3e	a20225ae-3963-4165-af19-7d7fb4570eaa tickets [ { ticketId: '650b4b67-ebab-4a11-ac47-c4e315d0e98b',
    startTime: '2018-11-16T03:11:58.597Z',
    players: [ [Object] ] },
  { ticketId: '3780d568-072b-4d9c-b964-9b9541befecb',
    startTime: '2018-11-16T03:12:03.190Z',
    players: [ [Object] ] } ] [ '650b4b67-ebab-4a11-ac47-c4e315d0e98b',
  '3780d568-072b-4d9c-b964-9b9541befecb' ] players [{"playerId":"j@gmail.com_1542337918","team":"red"},{"playerId":"j@gmail.com_1542337923","team":"blue"}]
*/


//======
// tickets [ '129116a4-d6d7-4fc4-b401-fefbf0615ac4','0ff741a3-6417-4c39-b7d7-1210cc62f714' ] 
// players [{"playerId":"p89","team":"red"},{"playerId":"p40","team":"blue"}]
/*
const message = {
  "version": "0",
  "id": "b925b8c8-a678-4311-802f-a51346310294",
  "detail-type": "GameLift Matchmaking Event",
  "source": "aws.gamelift",
  "account": "681274315116",
  "time": "2018-09-15T19:19:21.385Z",
  "region": "us-east-1",
  "resources": ["arn:aws:gamelift:us-east-1:681274315116:matchmakingconfiguration/dtc-match-config"],
  "detail": {
    "tickets": [{
      "ticketId": "129116a4-d6d7-4fc4-b401-fefbf0615ac4",
      "startTime": "2018-09-15T19:19:16.677Z",
      "players": [{
        "playerId": "p89",
        "team": "red"
      }]
    }, {
      "ticketId": "0ff741a3-6417-4c39-b7d7-1210cc62f714",
      "startTime": "2018-09-15T19:19:21.283Z",
      "players": [{
        "playerId": "p40",
        "team": "blue"
      }]
    }],
    "ruleEvaluationMetrics": [{
      "ruleName": "SameTopic",
      "passedCount": 3,
      "failedCount": 0
    }, {
      "ruleName": "DonationMatch",
      "passedCount": 3,
      "failedCount": 0
    }, {
      "ruleName": "DifferentSide",
      "passedCount": 3,
      "failedCount": 0
    }],
    "acceptanceRequired": false,
    "type": "PotentialMatchCreated",
    "gameSessionInfo": {
      "players": [{
        "playerId": "p89",
        "team": "red"
      }, {
        "playerId": "p40",
        "team": "blue"
      }]
    },
    "matchId": "fd10a018-9053-4234-b890-8ed820317c3b"
  }
}


const ticketsExample = [{
    ticketId: 'e7e1b1eb-3021-470a-be69-83880b796bf0',
    startTime: '2018-09-15T19:03:50.190Z',
    players: [
      [Object]
    ]
  },
  {
    ticketId: '3e1411f1-f160-4b46-8a1e-91a410d7778e',
    startTime: '2018-09-15T19:03:52.504Z',
    players: [
      [Object]
    ]
  }
]
*/