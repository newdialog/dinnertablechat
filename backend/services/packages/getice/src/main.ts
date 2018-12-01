import * as express from 'express';
import * as cors from 'cors';
import * as twilio from 'twilio';

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

const accountSid = 'ACea7e5231e06bb4e3e665ee00857f8c81';
const authToken = process.env.TWILIOAUTH;
const client = twilio(accountSid, authToken);

app.get('/ice', async (req: any, res: any, next: any) => {
  const keys = await client.tokens.create();
  // .then((token: any) => console.log(token.username));
  // .done();
  res.send({ iceServers: keys.iceServers });
});

// app.options('/hello', cors());
app.get('/hello', async (req: any, res: any, next: any) => {
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
