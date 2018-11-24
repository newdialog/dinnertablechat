// const AWSXRay = require('aws-xray-sdk');
const AWS = require('aws-sdk'); // AWSXRay.captureAWS(require('aws-sdk'));
const gamelift = new AWS.GameLift();
const { Pool } = require('pg'); // AWSXRay.capturePostgres(require('pg'));


console.log('Loading function');
// AWSXRay.enableManualMode();

/*
const db = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});
*/
const pool = new Pool();

exports.handle = async (event, context, callback) => {
  // if(action === 'CONFIRMED') await savePG(event.request.userAttributes, 1);

  // TODO: this doens't work because pre-login users have no ID
  // if(event.triggerSource === 'PreSignUp_SignUp') 
  //  await savePG(event.request.userAttributes, 0);

  
  if(event.triggerSource === 'PostConfirmation_ConfirmSignUp')
    await savePG(event.request.userAttributes, 1);
  else (event.triggerSource === 'PostAuthentication_Authentication')
    await savePG(event.request.userAttributes, 1);
  // console.log(event);
  //console.log(JSON.stringify(event))

  // callback(null, "Success");
  context.succeed(event);
};

async function savePG(user, status) {
  /*{ sub: 'c40fd3fc-f1fc-440e-aebd-f50497efe6b1',
        'cognito:email_alias': 'j@gmail.com',
        'cognito:user_status': 'CONFIRMED',
        email_verified: 'true',
        name: 'JD',
        email: 'j@gmail.com' } }*/
  console.log('saving user', status, user);

  // return;
  const client = await pool.connect();
  let success = true;
  try {
    const r1 = await client.query(`INSERT INTO public.users(
      id, username, email, status, xp, credits)
      VALUES ($1, $2, $3, $4, 0, 0)
      ON CONFLICT (id) 
      DO UPDATE SET 
        updated = CURRENT_TIMESTAMP,
        username = $2,
        email = $3,
        status = $4;`, [user.sub, user.name, user.email, status]);
    } catch (e) {
      console.error('AUTHSQLErr: id', [user.sub, user.name, user.email, status]);
      throw e;
    } finally {
      client.release();
    }
    return success;
}

/*
{ version: '1',
  region: 'us-east-1',
  userPoolId: 'us-east-1_qnnbmLfh0',
  userName: 'c40fd3fc-f1fc-440e-aebd-f50497efe6b1',
  callerContext: 
   { awsSdkVersion: 'aws-sdk-unknown-unknown',
     clientId: '1a66tr0jclinub7j3ls0j3mutt' },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
  request: 
   { userAttributes: 
      { sub: 'c40fd3fc-f1fc-440e-aebd-f50497efe6b1',
        'cognito:email_alias': 'j@gmail.com',
        'cognito:user_status': 'CONFIRMED',
        email_verified: 'true',
        name: 'JD',
        email: 'j@gmail.com' } },
  response: {} }

*/

