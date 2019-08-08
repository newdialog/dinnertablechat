import { getAll, submit, delAll, submitAll } from '../services/ConfService';
import { auth, configure } from '../services/AuthService';
import { Auth } from 'aws-amplify';
import { match2 } from '../services/ConfMath';

const TEST_CONF_ID = 'test';

function makeResponse(user: string, ans: number[]) {
  return {
    user,
    answers: { 'conf-test-q0-id': ans[0], 'conf-test-q1-id': ans[1] }
  };
}

function rndUser() {
  return '' + Math.floor(Math.random() * 100000);
}

function genRandomResponses() {
  let ans: any[] = [];
  const rr = () => randRange(2);
  for (let i = 0; i < 100; i++) {
    ans.push(makeResponse(rndUser(), [rr(), rr()]));
  }
  return ans;
}

function randRange(maxExclusive:number) {
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

afterAll(() => {});

it('add_users_to_db', async () => {
  const r = genRandomResponses();
  // console.log(r);
  // await submitAll(r, TEST_CONF_ID);

  // console.log('submitAll done')
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

  // console.log('result', result, Object.keys(result).length );
}, 4000);
