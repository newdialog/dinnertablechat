import { retryBackoff, intervalBackoff } from 'backoff-rxjs';
// import { Auth, API } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import DynamodbFactory from '@awspilot/dynamodb';
import { refreshCredentials } from './AuthService';

import { from, defer, throwError, of, interval, fromEvent, empty } from 'rxjs';
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
  flatMap,
  throttle,
  takeWhile
} from 'rxjs/operators';

// use Guest Login, use RID or guestSeed
let docClient: any; // DynamoDB.DocumentClient;
let started: boolean = false;

const USERS_TABLE = 'conf-users';
const CONF_TABLE = 'conf';

let identityId: string = '';
export async function init() {
  if (docClient) return docClient;

  const f = x => x && !!x.identityId; // || docClient;

  let cr = await interval(1000)
    .pipe(flatMap(_ => defer(() => refreshCredentials())))
    .pipe(
      filter(f),
      take(1)
    )
    .toPromise();

  if (docClient) return docClient; // already set

  console.log('DB init');
  console.log('DB cr', cr);

  if (!identityId) identityId = cr.identityId;

  // , Object.keys(cr).length < 2);

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
    },
    {
      TableName: 'conf-users',
      KeySchema: [
        {
          AttributeName: 'user',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'conf',
          KeyType: 'RANGE'
        }
      ]
    }
  ]);
  return docClient;
}

export async function submitAll(
  users: Array<{ user: string; answers: {} }>,
  conf: string
) {
  if (!docClient) await init();

  // TODO: low: batch
  return await Promise.all(
    users.map(user => submit(user.answers, conf, user.user))
  );
}

export async function delAll(conf: string) {
  if (!docClient) await init();

  console.warn('Deleting all: conf=' + conf, ' from ' + USERS_TABLE);

  return docClient
    .table(USERS_TABLE)
    .where('user')
    .not_null()
    .delete();
}

export async function submit(positions: any, conf: string, user?: string) {
  if (!docClient) await init();

  if (!user) user = identityId;

  console.log('submit user', user);

  return docClient
    .table(USERS_TABLE)
    .return(docClient.UPDATED_OLD)
    .insert_or_update({
      conf,
      user,
      answers: positions
    });
}

export async function submitSeats(
  seatIndex: number[],
  users: number[],
  conf: string
  // user: string
) {
  if (!docClient) await init();

  let batch = docClient
    .batch()
    .table(USERS_TABLE)
    .return(docClient.UPDATED_OLD);

  seatIndex.forEach((seat, index) => {
    const user = users[index];
    batch = batch.insert_or_update({
      conf,
      user,
      seat: seat
    });
  });

  return batch.write();
}

export async function submitReady(ready: boolean, conf: string, results: any) {
  if (!docClient) await init();

  if (!ready) {
    return await docClient
      .table(USERS_TABLE)
      .where('conf')
      .eq(conf)
      .where('user')
      .eq('_')
      .delete();
  }
  return docClient
    .table(USERS_TABLE)
    .return(docClient.UPDATED_OLD)
    .insert_or_update({
      conf,
      user: '_',
      answers: { ready, results }
    });
}

export async function waitForReady(conf: string, targetState: boolean = true) {
  return intervalBackoff({ initialInterval: 5000, maxInterval: 9000 })
    .pipe(
      tap(x => console.log('waiting', x)),
      flatMap(() => isReady(conf)),
      tap(x => console.log('waiting isReady', x)),
      takeWhile(x => x !== targetState)
    )
    .toPromise();
}

export async function isReady(conf: string) {
  if (!docClient) await init();

  const p = docClient // new Promise( (resolve, reject) => {
    .table(USERS_TABLE)
    .return(docClient.UPDATED_OLD)
    .select('user', 'answers')
    .having('user')
    .eq('_')
    .having('conf')
    .eq(conf)
    .scan();

  const re = (await p) as any[];
  if (re && re.length > 0) console.log(re[0].answers);

  if (!re) return false;
  if (re.length === 0) return false;
  return re[0].answers.ready === true;
}

export async function getResults(conf: string) {
  if (!docClient) await init();

  const p = docClient // new Promise( (resolve, reject) => {
    .table(USERS_TABLE)
    .return(docClient.UPDATED_OLD)
    .select('user', 'answers')
    .having('user')
    .eq('_')
    .having('conf')
    .eq(conf)
    .scan();

  const re = (await p) as any[];
  if (re && re.length > 0) console.log(re[0].answers);

  if (!re) return null;
  if (re.length === 0) return null;

  if (re[0].answers.ready === true) return re[0].answers.results;
  else return null;
}

export async function getAll(
  conf: string
): Promise<{ results: any[]; meta: any }> {
  if (!docClient) await init();

  return docClient
    .table(USERS_TABLE)
    .select('user', 'answers')
    .having('conf')
    .eq(conf)
    .scan()
    .then(x => {
      const filterOut = x.filter(x => x.user !== '_');
      const filterFor = x.filter(x => x.user === '_');

      return {
        results: filterOut,
        meta: filterFor.length === 0 ? null : filterFor[0].answers
      };
    }); // remove metadata
}
