import { Auth, API } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import DynamodbFactory from '@awspilot/dynamodb';
import { refreshCredentials } from './AuthService';

// use Guest Login, use RID or guestSeed
let docClient: any; // DynamoDB.DocumentClient;

export async function init(creds?: any) {
  if (!docClient)
    docClient = DynamodbFactory(new DynamoDB(await refreshCredentials())); // await refreshCredentials()));

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

export async function submitAll(users:Array<{user:string, answers:{}}>, conf:string) {
  return await Promise.all(users.map(user=>submit(user.answers, conf, user.user)));
}

export async function delAll(conf:string) {
  const p = new Promise( (resolve, reject) => {
    docClient
      .table('conf')
      .where('conf').eq(conf)
      .delete((err:any, data:any) => {
        if(err) reject(err);
        else resolve(data);
      })
  });
  return await p;
}

export async function submit(positions: any, conf: string, user: string) {
  if (!docClient) await init();

  const p = new Promise( (resolve, reject) => {
    docClient
      .table('conf')
      .return(docClient.UPDATED_OLD)
      .insert_or_update(
        {
          conf,
          user,
          answers: positions
        },
        (err:any, data:any) => {
          if(err) reject(err);
          else resolve(data);
          // console.log('saved', err, data);
        }
      );
  });
  return await p;
}

export async function getAll(conf: string) {
  if (!docClient) await init();

  return docClient
    .table('conf')
    .select('user', 'answers')
    .having('conf')
    .eq(conf)
    .scan();
}
