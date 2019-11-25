import DynamodbFactory from '@awspilot/dynamodb';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { defer, interval, merge, of } from 'rxjs';
import { filter, flatMap, take, catchError, startWith } from 'rxjs/operators';

import { refreshCredentials } from './AuthService';

export interface UserRow {
  user: string;
  answers: { [k: string]: number };
  answersArr?: Array<number>;
  version?: number; // TODO make manditory
}
export type UserRows = Array<UserRow>;

// use Guest Login, use RID or guestSeed
let docClient: any; // DynamoDB.DocumentClient;
const TABLE_USERS = 'conf-users';
const TABLE_ID = 'conf_id';
const filterValid = filter((x: any) => x && !!x.identityId);

export async function init() {
  // console.log('db: waiting on init');
  const cred = await interval(3000)
    .pipe(startWith(0))
    .pipe(flatMap(_ => defer(() => refreshCredentials())))
    .pipe(filterValid, take(1))
    .toPromise();

  if (cred.refreshed === undefined) throw new Error('refreshed prop not found');
  else if (docClient && cred.refreshed === false) {
    // console.warn('recycle db');
    return docClient;
  }

  console.log('db: init completed', cred);
  // if (docClient) return docClient; // already set

  docClient = DynamodbFactory(new DynamoDB({ credentials: cred })); // await refreshCredentials()));

  docClient.on('error', function(operation, error, payload) {
    const err = { operation, error, payload };
    console.error('dynerr', err);

    if (window.gtag)
      window.gtag('event', 'exception', {
        description: JSON.stringify(err),
        fatal: true
      });
    // you could use this to log call fails to LogWatch or
    // insert into SQS and process it later
  });

  docClient.schema([
    {
      TableName: TABLE_USERS,
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
    },
    {
      TableName: TABLE_ID,
      KeySchema: [
        {
          AttributeName: 'user',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'conf',
          KeyType: 'HASH' // 'RANGE'
        }
      ]
    }
  ]);
  return docClient;
}

export async function submitAll(
  users: Array<{ user: string; answers: {} }>,
  conf: string,
  version: number = 0
) {
  await init();

  // TODO: low: batch
  return await Promise.all(
    users.map(user => submit(user.answers, conf, user.user, version))
  );
}

export async function delAll(conf: string, user: string) {
  await init();

  console.log('Deleting all: conf=' + conf, ' from ' + TABLE_USERS);

  const _getAll = await getAll(conf);
  const users = _getAll.data.map(k => k.user);

  users.map(async user => {
    return await docClient
      .table(TABLE_USERS)
      .where('conf')
      .eq(conf)
      .where('user')
      .eq(user)
      .delete()
      .catch(errCatch);
  });

  submitReady(false, conf, [], user);

  console.log('delete done', conf);

  return true;
}

export async function submit(
  positions: any,
  conf: string,
  user: string,
  version: number
) {
  await init();

  // debugging
  // await new Promise(r => setTimeout(r, 5000));

  // if (!user) user = identityId;
  const updated = Math.floor(Date.now() / 1000);

  // console.log('submit user', user, conf, positions);

  const result = docClient
    .table(TABLE_USERS)
    .return(docClient.UPDATED_OLD)
    .insert_or_update({
      conf,
      user,
      answers: positions,
      version,
      updated
    })
    .catch(async e => {
      if (e.toString().indexOf('NetworkingError') === -1) catchError(e);
      // console.error('err', e);
      console.warn('retrying');
      await new Promise(r => setTimeout(r, 5000));
      return submit(positions, conf, user, version);
    });

  return result;
}

export async function submitSeats(
  seatIndex: number[],
  users: number[],
  conf: string
  // user: string
) {
  await init();

  let batch = docClient
    .batch()
    .table(TABLE_USERS)
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

export async function getResults(conf: string) {
  await init();

  const r = await idGet(conf);
  if (!r) return null;
  if (r.results === null || r.results === undefined)
    return { results: [], ready: false, version: r.version };

  return { results: r.results, ready: r.ready, version: r.version };
}

export async function getAll(
  conf: string,
  byVersion = -1
): Promise<{ data: UserRow[] }> {
  await init();

  console.log('fetching', byVersion);

  return docClient
    .table(TABLE_USERS)
    .select('user', 'answers')
    .having('conf')
    .eq(conf)
    .select('answers', 'user', 'updated', 'version')
    .scan()
    .then(async x => {
      const filterOut =
        byVersion > -1
          ? x.filter(y => {
              // console.log(y.version === byVersion, y.version, byVersion);
              // if (y.version === null || y.version === undefined) return true; // for older entries // take it out as it messes up existing conf after all
              return y.version === byVersion;
            })
          : x;

      const idRow = await idGet(conf);
      let meta: ConfIdRow = idNewQuestions(conf, '');

      // console.log('idRow', idRow);

      /* if (idRow !== null) {
        //  && (idRow as any).answers
        meta = idRow as any;
        meta.results = meta.results || Array<any>();
      } */

      return {
        data: filterOut
        // meta
      };
    }); // remove metadata
}

export interface ConfUIQuestion {
  version?: number;
  positions: string[];
  proposition: string;
  id: string;
}

export interface ConfIdQuestion {
  question: string;
  answer: string;
  id?: string;
}
// ==================
export type ConfIdQuestions = ConfIdQuestion[];
export type GroupResult = any[]; // [ { [q:string]: any} ];
export interface ConfIdRow {
  user: string;
  userPoolId: string;
  name: string;
  conf: string;
  questions: ConfIdQuestions;
  maxGroups: number;
  minGroupUserPairs: number;
  ready: boolean;
  results?: GroupResult;
  curl?: string;
  updated?: number;
  version: number;
  waitmsg?: string;
}
// ====================

export function idNewQuestions(conf: string, user: string): ConfIdRow {
  return {
    questions: [],
    minGroupUserPairs: 1,
    maxGroups: 40,
    user,
    name: '',
    conf,
    ready: false,
    userPoolId: '',
    version: 0
  };
}

export function idNewQuestion(
  question: string,
  answer: string,
  id: string
): ConfIdQuestion {
  return {
    question,
    answer,
    id
  };
}

export async function idIncVersion(conf: string, user: string) {
  await init();

  if (!user) throw new Error('No user specified');

  const data = await idGet(conf);
  if (!data) throw new Error('no id found');

  const version =
    data.version === null || data.version === undefined ? 0 : data.version + 1;

  return docClient
    .table(TABLE_ID)
    .where('conf')
    .eq(conf)
    .where('user')
    .eq(user)
    .return(docClient.ALL_OLD) // UPDATED_OLD
    .update({ version }) // .insert_or_update
    .catch(errCatch);
}

export async function idSubmit(data: ConfIdRow) {
  await init();
  // conf: string, user: string, questions: any[], maxGroups: number, minGroupUserPairs: number, curl?: string
  // if (!user) user = identityId;

  // console.log('submit user', user, conf, positions);

  data.updated = Math.floor(Date.now() / 1000);

  data.version =
    data.version === null || data.version === undefined ? 0 : data.version + 1;

  // Strings cannot be empty for dynamo
  if (data.curl === '') delete data.curl;
  // Clear previous results
  delete data.results;
  data.ready = false;

  console.log('saving', JSON.stringify(data));
  // clear out old entry, including assignments results
  // if (!!data.updated) await idDel(data.conf, data.user);

  return docClient
    .table(TABLE_ID)
    .return(docClient.ALL_OLD) // UPDATED_OLD
    .insert_or_replace(data) // .insert_or_update
    .catch(errCatch);
}

export async function submitReady(
  ready: boolean,
  conf: string,
  results: any[],
  user: string
) {
  await init();

  console.log('submitReady', ready, conf, user, results);

  return await docClient
    .table(TABLE_ID)
    .where('conf')
    .eq(conf)
    .where('user')
    .eq(user)
    .insert_or_update({
      conf,
      user,
      ready: ready === true,
      results: ready ? results : null
    })
    .catch(errCatch);
}

function errCatch(e: any) {
  if (e && (e.toString() as string).toLowerCase().indexOf('credentials') > -1) {
    console.warn('session expired- reloading');
    window.location.reload();
    return undefined;
  } else {
    window.alert(e);
    window.location.reload();
  }
}

export async function idDel(conf: string, user: string) {
  await init();

  return await docClient
    .table(TABLE_ID)
    .where('conf')
    .eq(conf)
    .where('user')
    .eq(user)
    .delete()
    .catch(errCatch);
}

export async function idGet(conf: string): Promise<ConfIdRow | null> {
  await init();

  return docClient
    .table(TABLE_ID)
    .index('conf-index')
    .select(
      'user',
      'questions',
      'ready',
      'conf',
      'maxGroups',
      'minGroupUserPairs',
      'results',
      'curl',
      'updated',
      'version',
      'waitmsg',
      'name'
    )
    .having('conf')
    .eq(conf)
    .scan()
    .then(x => {
      // console.log('xx', x, x && x[0])
      if (!x || x.length === 0) return null;
      const item = x[0];
      // if (item.questions) item.questions = JSON.parse(item.questions);
      if (!item.questions) item.questions = [];
      return item;
    }) // remove metadata
    .catch(errCatch);
}

export async function idGetByUser(user: string): Promise<ConfIdRow[] | null> {
  await init();

  return docClient
    .table(TABLE_ID)
    .index('user-index')
    .select(
      'user',
      'questions',
      'ready',
      'conf',
      'maxGroups',
      'minGroupUserPairs',
      'results',
      'curl',
      'updated',
      'version',
      'waitmsg',
      'name'
    )
    .having('user')
    .eq(user)
    .scan()
    .then(xs => {
      // console.log('xx', x, x && x[0])
      if (!xs || xs.length === 0) return null;

      // xs.forEach(x => x.questions = JSON.parse(x.questions));
      xs.forEach(x => (x.questions = x.questions || []));
      return xs as ConfIdRow[];
    }) // remove metadata
    .catch(errCatch);
}
