import API from '@aws-amplify/api';

async function getScores() {
  let apiName = 'History';
  let path = '/hello';
  let myInit = {
    // OPTIONAL
    headers: { Authorization: '' }, // OPTIONAL
    // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {
      // name: 'param'
    }
    // body: {}, // replace this with attributes you need
  };
  return API.get(apiName, path, myInit)
    .then(response => {
      // Add your code here
      return response;
    })
    .catch(error => {
      console.log(apiName, path, error.response);
    });
}

function configure(conf) {
  return API.configure(conf);
}

export default { getScores, configure };
