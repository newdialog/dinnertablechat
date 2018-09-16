var AWS = require('aws-sdk');

console.log('Loading function');

/*
const db = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});
*/
const docClient = new AWS.DynamoDB.DocumentClient();

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
  await query();
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

function forEachSNS(record) {
  var message = JSON.parse(record.Sns.Message);
  var tickets = message.detail.tickets;
  var type = message.detail.type;
  var players = message.detail.gameSessionInfo.players;
  var matchId = message.detail.matchId;
  // console.log(type)
  var accepted = type === 'PotentialMatchCreated';
  if (!accepted) {
    // ignore other event types
    return;
  }

  const ticketIds = tickets.map(t => t.ticketId);

  console.log('Message received from SNS:', JSON.stringify(message));
  console.log('tickets', ticketIds, 'players', JSON.stringify(players))
}

function getQParam(players, matchId) {
  // leader
  var red = players.filter(p => p.team === 'red')[0];
  // follower
  var blue = players.filter(p => p.team === 'blue')[0];

  return {
    RequestItems: {
      "match": [{
        PutRequest: {
          Item: {
            "id": {
              S: matchId
            },
            "Artist": {
              S: "No One You Know"
            },
            "SongTitle": {
              S: "Call Me Today"
            }
          }
        }
      }],
      "dtc_sync": [{
          PutRequest: {
            Item: {
              "user": {
                S: red.playerId
              },
              "leader": {
                BOOL: true
              },
              "match": {
                S: matchId
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              "user": {
                S: blue.playerId
              },
              "leader": {
                BOOL: false
              },
              "match": {
                S: matchId
              }
            }
          }
        }
      ]
    }
  };
}
dynamodb.batchWriteItem(params, function (err, data) {

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