// import awsExportsJs from './aws-exports.js';

import * as express from 'express';
import * as cors from 'cors';
// var AWSXRay = require('aws-xray-sdk');
// import bodyParser from 'body-parser';
// import * as mysql from 'promise-mysql';
import { Client } from 'pg';

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
let connection: any;

app.get('/db', async (req: any, res: any, next: any) => {
  if (!connection) {
    // throw new Error('db not init yet');
    console.log('starting');
    try {
      connection = new Client(); // sqloptions
      await connection.connect();
    } catch (e) {
      throw new Error(e.toString());
    }
  }
  const qres = await connection.query('select * from debate_session');
  console.log(qres.rows); // Hello world!

  const ctx = JSON.parse(req.headers['x-context'] || '{}');
  const ctxstr = JSON.stringify(ctx, null, 2);

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
