import { getAll, submit, delAll, submitAll } from '../services/ConfService';
import { auth, configure } from '../services/AuthService';
import { match2 } from '../services/ConfMath';

const TEST_CONF_ID = 'test';

function makeResponse(
  conf: string,
  user: string,
  questionsNum: number,
  ans: number[]
) {
  const keys: string[] = [];
  for (var i = 0; i < questionsNum; i++) keys.push(`q${i}-id`);

  const answers = keys.reduce((acc, k, i) => {
    acc[k] = ans[i];
    return acc;
  }, {});

  return {
    user,
    answers
  };
}

function rndUser() {
  return '' + Math.floor(Math.random() * 100000);
}

function genRandomResponses(conf: string, questionsNum: number, count:number = 10) {
  let ans: any[] = [];
  const rr = () => randRange(2);
  for (let i = 0; i < count; i++) {
    const ansList: number[] = [];
    for (let j = 0; j < questionsNum; j++) {
      ansList.push(rr());
    }
    ans.push(makeResponse(conf, rndUser(), questionsNum, ansList));
  }
  return ans;
}

function randRange(maxExclusive: number) {
  return Math.floor(Math.random() * maxExclusive);
}

const TEST_DATA = [
  { user: '123', answers: { '1': 1, '2': 0 } },
  { user: '222', answers: { '1': 0, '2': 0 } },
  { user: '333', answers: { '1': 1, '2': 1 } },
  { user: '444', answers: { '1': 1, '2': 1 } },
  { user: '555', answers: { '1': 0, '2': 1 } },
  { user: '666', answers: { '1': 0, '2': 1 } },
  { user: '777', answers: { '1': 1, '2': 0 } },
  { user: '888', answers: { '1': 0, '2': 1 } },
  { user: '999', answers: { '1': 1, '2': 1 } }
];

/*
beforeAll(async () => {
  // Authenticate
  configure();
  await Auth.signIn(process.env.TEST_USER_NAME!, process.env.TEST_USER_PW!);

  // const raa = await Auth.currentUserCredentials();
  // console.log('rrraaaa',raa);

  auth(async x => {
    // console.log('authed?', x);
  });
}, 5000);
*/

afterAll(() => {});

it('add_users_to_db', async () => {
    const TABLE = 'pub1';
    let r = genRandomResponses(TABLE, 5, 400);

  // await submitAll(r, TABLE);

  console.log('submitAll done',r  )
  // delAll(TEST_CONF_ID);
}, 4000);

it('matches', async () => {
  const groups = 2;

  const result = match2(TEST_DATA, groups);

  // console.log(JSON.stringify(result));

  expect(result !== null);

  expect(Object.keys(result).length < groups);
  expect(Object.keys(result).length > 1);

  // expect(Object.keys(result[0]).length > 1);

  const userKeys = result
    .map(h => Object.keys(h))
    .reduce((acc, x) => acc.concat(x), []);
  expect(userKeys).toContain('123');
  expect(userKeys).toContain('999');
  expect(userKeys.length === TEST_DATA.length);

  console.log('result', result, Object.keys(result).length );
}, 4000);
