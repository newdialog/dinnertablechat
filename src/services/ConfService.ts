import { Auth, API } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import DynamodbFactory from '@awspilot/dynamodb';
import { refreshCredentials } from './AuthService';

// use Guest Login, use RID or guestSeed
let docClient: any; // DynamoDB.DocumentClient;

export async function init() {
  if (!docClient)
    docClient = DynamodbFactory(new DynamoDB(await refreshCredentials()));

  docClient.schema([
    {
      TableName: 'conf',
      KeySchema: [
        {
          AttributeName: 'conf',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'user',
          KeyType: 'RANGE'
        }
      ]
    }
  ]);
}

export async function submit(positions: any, conf: string, user: string) {
  if (!docClient) await init();

  docClient
    .table('conf')
    .return(docClient.UPDATED_OLD)
    .insert_or_update(
      {
        conf,
        user,
        answers: positions
      },
      function(err, data) {
        console.log(err, data);
      }
    );
}

async function updateMatch(state: any) {
  const teamkey = '';
  const key = '';

  const params2: DynamoDB.DocumentClient.UpdateItemInput = {
    Key: {
      id: ''
    },
    AttributeUpdates: {
      [teamkey]: {
        Action: 'ADD', // ADD | PUT | DELETE,
        Value: [
          key // .map(k => JSON.stringify(key))
        ] /* "str" | 10 | true | false | null | [1, "a"] | {a: "b"} */
      }
      /* [statekey]: {
            Action: 'PUT',
            Value: state
          } */
    },
    TableName: 'match'
  };
  // console.log('rx save data', JSON.stringify(params2));
  await docClient
    .update(params2)
    .promise()
    .catch(e => {
      console.error(e);
      throw new Error(e);
    });
  // console.log('ut2,', ticket2);
  return true;
}
