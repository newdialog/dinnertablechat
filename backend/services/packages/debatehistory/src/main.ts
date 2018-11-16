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

app.get('/db', async (req: any, res: any, next: any) => {
  const client = await connection.connect();

  /*if (!connection) {
    // throw new Error('db not init yet');
    const e = process.env;
    console.log('starting sql connection'); // , e.PGHOST, e.PGDATABASE, e.PGUSER, e.PGPASSWORD, e.PGPORT);
    try {
       // sqloptions
      
    } catch (e) {
      connection = null;
      // console.warn('error', e);
      // res.send({ err: e });
      // return;
      throw new Error(e.toString());
    }
  }*/
  console.log('query');
  const qres = await client.query('select * from debate_session');
  console.log(qres.rows); // Hello world!

  const ctx = JSON.parse(req.headers['x-context'] || '{}');
  const claims =
    ctx.authorizer && ctx.authorizer.claims ? ctx.authorizer.claims : null;

  const ctxstr = JSON.stringify(claims, null, 2);

  client.release();
  res.send({ rows: qres.rows, ctx: ctxstr });
});

// app.options('/hello', cors());
app.get('/hello', async (req: any, res: any, next: any) => {
  const ctx = JSON.parse(req.headers['x-context'] || '{}');
  const claims =
    ctx.authorizer && ctx.authorizer.claims ? ctx.authorizer.claims : null;
  console.log('claims:', claims);
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

// 'cognito:username': '996b8af9-c5bd-1111-1111-4068792f28e0',
// email:
// email_verified:
// name
