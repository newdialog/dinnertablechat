// import awsExportsJs from './aws-exports.js';

import * as express from 'express';

// var AWSXRay = require('aws-xray-sdk');
import bodyParser from 'body-parser';
import * as mysql from 'promise-mysql';

const port = process.env.PORT || 8000;

const sqloptions = {
  host: process.env.SQL_HOST || 'localhost',
  user: process.env.SQL_USER || 'me',
  password: process.env.SQL_PW || 'secret',
  database: 'dtc',
};

const app = express();
// const mysql = require('mysql');
let connection: any;

app.get('/hello', async (req: any, res: any, next: any) => {
  if (!connection) throw new Error('db not init yet');
  const qres = await connection.query('select * from debate_session');
  console.log(qres.rows); // Hello world!
  res.send(qres.rows);
});

// app.use(bodyParser.json());
// app.use(AWSXRay.express.closeSegment());
app.listen(port, async () => {
  try {
    connection = await mysql.createConnection(sqloptions);
  } catch (e) {
    throw new Error(e.toString());
  }
  // await connection.connect();
  console.log(`Live on port: ${port}!`);

  sqloptions.password = 'removed';
  console.log('sqloptions', sqloptions);
});
