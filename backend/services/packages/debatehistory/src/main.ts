// import awsExportsJs from './aws-exports.js';

import * as express from 'express';
import * as cors from 'cors';
// var AWSXRay = require('aws-xray-sdk');
// import bodyParser from 'body-parser';
// import * as mysql from 'promise-mysql';
import { Client, Pool } from 'pg';

const port = process.env.PORT || 8000;

const sqloptions = {
  host: 'localhost',
  user: 'me',
  password: 'secret',
  database: 'dtc',
};

const app = express();
app.use(express.json());
app.use(cors());
// const mysql = require('mysql');
const connection: Pool = new Pool();

app.get('/history', async (req: any, res: any, next: any) => {
  const { id, ...user } = getClaims(req);

  const client = await connection.connect();
  console.log('QUERY for user', id);
  const qres = await client.query(
    `select ds.topic, ds.created as debate_created, du.*, 
  du.review_aggrement as aggrement
  from debate_session as ds
  INNER JOIN debate_session_users du ON du.debate_session_id=ds.id
  where ds.id = (select id from debate_session as ds2
          INNER JOIN debate_session_users as du2 ON du2.debate_session_id=ds2.id
          where du2.user_id = $1
          )`,
    [id],
  );
  console.log(qres.rows);

  // const ctxstr = JSON.stringify(user, null, 2);
  // console.log(ctxstr)

  client.release();
  res.send({ rows: qres.rows });
});

app.post('/review', async (req: any, res: any, next: any) => {
  const { id, ...user } = getClaims(req);
  const body = req.body;
  if(!body.matchId) throw new Error(`no match id on ${JSON.stringify(body)}`);
  if(!body.review) throw new Error(`no review on ${JSON.stringify(body)}`);
  const {matchId, review} = body;
  const agreement = review.agreement;

  const client = await connection.connect();
  console.log('QUERY for user', id);
  const qres = await client.query(
`UPDATE public.debate_session_users
SET review=$1, review_aggrement=$2, end_created=CURRENT_TIMESTAMP
WHERE debate_session_id=$4 AND user_id=$5;`,
  [review, agreement, matchId, id],
  );
  console.log(qres.rows);

  // const ctxstr = JSON.stringify(user, null, 2);
  // console.log(ctxstr)

  client.release();
  res.send({ rows: qres.rows });
});

app.post('/bail', async (req: any, res: any, next: any) => {
  const { id, ...user } = getClaims(req);
  const body = req.body;
  if(!body.matchId) throw new Error(`no match id on ${JSON.stringify(body)}`);
  if(!body.review) throw new Error(`no review on ${JSON.stringify(body)}`);
  const {matchId, review} = body;

  const client = await connection.connect();
  console.log('QUERY for user', id);
  const qres = await client.query(
`UPDATE public.debate_session_users
end_created=CURRENT_TIMESTAMP, bailed=$1
WHERE debate_session_id=$2 AND user_id=$3;`,
    [true, matchId, id],
  );
  console.log(qres.rows);

  // const ctxstr = JSON.stringify(user, null, 2);
  // console.log(ctxstr)

  client.release();
  res.send({ rows: qres.rows });
});

// app.options('/hello', cors());
app.get('/hello', async (req: any, res: any, next: any) => {
  const { id, ...user } = getClaims(req);

  // const id = claims['cognito:username'];
  console.log('ID', id, 'claims:', user);
  // `req.headers.authorization: ${req.headers.authorization}`,
  // console.log('req.headers', req.headers.authorization);
  res.send({ rows: ['ok'] });
});

// app.use(bodyParser.json());
// app.use(AWSXRay.express.closeSegment());
app.listen(port, async () => {
  // await connection.connect();
  console.log(`Live on port: ${port}!`);

  sqloptions.password = 'removed';
  // console.log('sqloptions', sqloptions);
});

function getClaims(req: any) {
  const ctx = JSON.parse(req.headers['x-context'] || '{}');
  const claims =
    ctx.authorizer && ctx.authorizer.claims ? ctx.authorizer.claims : null;
  const id = claims['cognito:username'];

  return { ...claims, id };
}

// 'cognito:username': '996b8af9-c5bd-1111-1111-4068792f28e0',
// email:
// email_verified:
// name
