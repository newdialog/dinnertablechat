import { Auth, API } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import DynamodbFactory from '@awspilot/dynamodb';
import { refreshCredentials } from './AuthService';

import { from, defer, throwError, of, interval, fromEvent } from 'rxjs';
import {
  // delay as delayRx,
  map,
  filter,
  // retry as retryRx,
  tap,
  concatMap,
  timeout,
  take,
  takeUntil,
  throttleTime,
  last,
  bufferTime,
  combineLatest,
  flatMap, throttle
} from 'rxjs/operators';

// use Guest Login, use RID or guestSeed
let docClient: any; // DynamoDB.DocumentClient;
let started:boolean = false;

export async function init() {
  if (docClient) return docClient;

  const f = x => (x && !!x.accessKeyId) || docClient;

  let cr = await defer( () => refreshCredentials()).pipe(throttleTime(3000), filter(f), take(1), map(x=>x||docClient)).toPromise();

  console.log('DB init');
  console.log('DB cr', cr); // , Object.keys(cr).length < 2);

  /// console.log('DB cred', cr);
  docClient = DynamodbFactory(new DynamoDB(cr)); // await refreshCredentials()));
  started = true;
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
  return docClient;
}

export async function submitAll(users:Array<{user:string, answers:{}}>, conf:string) {
  if (!docClient) await init();
  return await Promise.all(users.map(user=>submit(user.answers, conf, user.user)));
}

export async function delAll(conf:string) {
  if (!docClient) await init();

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

export async function submitReady(ready: boolean, conf: string) {
  if (!docClient) await init();

  const p = new Promise( (resolve, reject) => {
    docClient
      .table('conf')
      .return(docClient.UPDATED_OLD)
      .insert_or_update(
        {
          conf,
          'user': '_',
          answers: { ready }
        },
        (err:any, data:any) => {
          if(err) reject(err);
          else resolve(data);
        }
      );
  });
  return await p;
}

export async function isReady(conf: string) {
  if (!docClient) await init();

  const p = // new Promise( (resolve, reject) => {
    docClient
      .table('conf')
      .return(docClient.UPDATED_OLD)
      .select('user', 'answers')
      .having('user')
      .eq('_')
      .having('conf')
      .eq(conf)
      .scan();
  // });

  const re = (await p) as any[];
  console.log(re);

  if(!re) return false;
  if(re.length === 0) return false;
  return re[0].answers.ready === true;
}

export async function getAll(conf: string) {
  if (!docClient) await init();

  return docClient
    .table('conf')
    .select('user', 'answers')
    .having('conf')
    .eq(conf)
    .scan()
    .then( x => x.filter(x=>x.user!=='_')) // remove metadata
}
