import awsExportsJs from './aws-exports.js';

import * as express from 'express';

// var AWSXRay = require('aws-xray-sdk');
const bodyParser = require('body-parser');
const CognitoExpress = require('cognito-express');
const port = process.env.PORT || 8000;

const cognitoUserPoolId = awsExportsJs.aws_user_pools_id;

console.log('cognitoUserPoolId', cognitoUserPoolId);

const app = express();
const authenticatedRoute = express.Router();

// app.use(AWSXRay.express.openSegment('MyApp'));
app.use('/api', authenticatedRoute);

// Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
  region: 'us-east-1',
  cognitoUserPoolId: cognitoUserPoolId, // "us-east-1_dXlFef73t",
  tokenUse: 'access', // Possible Values: access | id
  tokenExpiration: 3600000, // Up to default expiration of 1 hour (3600000 ms)
});

// Our middleware that authenticates all APIs under our 'authenticatedRoute' Router
authenticatedRoute.use((req: any, res: any, next: any) => {
  // I'm passing in the access token in header under key accessToken
  const accessTokenFromClient = req.headers.accesstoken;

  // Fail if token not present in header.
  if (!accessTokenFromClient)
    return res.status(401).send('Access Token missing from header');

  cognitoExpress.validate(accessTokenFromClient, (err: any, response: any) => {
    // If API is not authenticated, Return 401 with error message.
    if (err) return res.status(401).send(err);

    // Else API has been authenticated. Proceed.
    res.locals.user = response;
    next();
  });
});

// Define your routes that need authentication check
authenticatedRoute.get('/test', (req: any, res: any, next: any) => {
  res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});

app.get('/hello', (req: any, res: any, next: any) => {
  res.send(`hello world`);
});

app.get('/', (req: any, res: any, next: any) => {
  console.log('GET', req.query, req.headers);
  res.send(`ok`);
});

app.post('/', bodyParser.json(), (req: any, res: any, next: any) => {
  if (req.headers['x-amz-sns-message-type']) {
  }
  const event: any = req.body;
  console.log('event', event, req.query, req.headers);
  if (!event.Records) return res.status(500).send('Something broke!');
  const SnsMessageId = event.Records[0].Sns.MessageId;
  const SnsPublishTime = event.Records[0].Sns.Timestamp;
  const SnsTopicArn = event.Records[0].Sns.TopicArn;
  const LambdaReceiveTime = new Date().toString();
  const itemParams = {
    Item: {
      SnsTopicArn: { S: SnsTopicArn },
      SnsPublishTime: { S: SnsPublishTime },
      SnsMessageId: { S: SnsMessageId },
      LambdaReceiveTime: { S: LambdaReceiveTime },
    },
  };
  console.log('itemParams', itemParams);
  res.send(`ok`);
});

// app.use(bodyParser.json());
// app.use(AWSXRay.express.closeSegment());
app.listen(port, () => {
  console.log(`Live on port: ${port}!`);
});
