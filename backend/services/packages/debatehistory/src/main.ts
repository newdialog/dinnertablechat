// import awsExportsJs from './aws-exports.js';

import * as express from 'express';

// var AWSXRay = require('aws-xray-sdk');
import bodyParser from 'body-parser';
import { Client } from 'pg';

const port = process.env.PORT || 8000;
const app = express();


const client = new Client()
// await client.end()


app.get('/hello', async (req: any, res: any, next: any) => {
  const qres = await client.query('select * from "DebateSession"');
  console.log(qres.rows) // Hello world!
  res.send(qres.rows);
});

// app.use(bodyParser.json());
// app.use(AWSXRay.express.closeSegment());
app.listen(port, async () => {
  await client.connect()
  console.log(`Live on port: ${port}!`);
});
