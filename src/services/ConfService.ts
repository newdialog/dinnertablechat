import { Auth, API } from 'aws-amplify';
import DynamoDB from 'aws-sdk/clients/dynamodb';

// use Guest Login, use RID or guestSeed
let docClient: DynamoDB.DocumentClient;

export function init(): void {
  if (!docClient)
    docClient = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10'
    });
}

async function updateMatch(state: any) {
  const params2: any = {};
  // console.log('rx save data', JSON.stringify(params2));
  await docClient
    .update(params2)
    .promise()
    .catch(e => {
      console.error(e);
      throw new Error(e);
    });
  // console.log('ut2,', ticket2);
  return true;
}
