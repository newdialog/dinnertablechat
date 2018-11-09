// import awsExportsJs from './aws-exports.js';

import * as express from 'express';

// var AWSXRay = require('aws-xray-sdk');
import bodyParser from 'body-parser';
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
// const mysql = require('mysql');
let connection: any;

app.get('/hello', async (req: any, res: any, next: any) => {
  if (!connection) throw new Error('db not init yet');
  const qres = await connection.query('select * from debate_session');
  console.log(qres.rows); // Hello world!

  const ctx = JSON.parse(req.headers['x-context'])
  const ctxstr = JSON.stringify(ctx, null, 2);

  res.send({rows: qres.rows, ctx: ctxstr});
});

// app.use(bodyParser.json());
// app.use(AWSXRay.express.closeSegment());
app.listen(port, async () => {
  console.log('starting')
  try {
    connection = new Client(); // sqloptions
    await connection.connect();
  } catch (e) {
    throw new Error(e.toString());
  }
  // await connection.connect();
  console.log(`Live on port: ${port}!`);

  sqloptions.password = 'removed';
  console.log('sqloptions', sqloptions);
});
