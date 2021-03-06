// Note: only include headers on non-IAM resources, guest accounts are only IAM

import Auth from '@aws-amplify/auth';
import API from '@aws-amplify/api';

let _cfg = {};
/* const API:any = {
  get: () => {},
  post: () => {},
  configure: (cfg) => _cfg = Object.assign(_cfg, cfg)
}*/

export async function getScores() {
  let apiName = 'History';
  let path = '/history'; // /hello
  let myInit = {
    // OPTIONAL
    headers: await getTokenHeaders(), // OPTIONAL
    // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {
      // name: 'param'
    }
    // body: {}, // replace this with attributes you need
  };
  // console.log('/history', myInit);

  return API.get(apiName, path, myInit)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(apiName, path, error.response);
    });
}

export async function reviewSession(review: any, matchId: string) {
  let apiName = 'History';
  let path = '/review'; // /hello
  let myInit = {
    // OPTIONAL
    headers: await getTokenHeaders(), // OPTIONAL
    // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {
      // name: 'param'
    },
    body: {
      matchId,
      review
    } // replace this with attributes you need
  };
  console.log('reviewSession', myInit);

  return API.post(apiName, path, myInit)
    .then(response => {
      // Add your code here
      return response;
    })
    .catch(error => {
      console.log(apiName, path, error.response);
    });
}

export async function getICE() {
  let apiName = 'Ice';
  let path = '/ice'; // /hello
  let myInit = {
    // OPTIONAL
    //// headers: await getTokenHeaders(), // OPTIONAL
    // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {
      cb: '' + Math.random() * 100000
    }
  };
  // console.log('getICE', myInit);

  return API.get(apiName, path, myInit)
    .then(response => {
      // Add your code here
      return (response.iceServers as any[]).map(x => {
        const { url, ...r } = x; // rename prop
        return { ...r, urls: url };
      });
    })
    .catch(error => {
      console.error('getICE err', apiName, path, error.response);
      throw error;
    });
}

export async function bail(matchId: string) {
  let apiName = 'History';
  let path = '/bail'; // /hello
  let myInit = {
    // OPTIONAL
    /// headers: await getTokenHeaders(), // OPTIONAL
    // response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters: {
      // name: 'param'
    },
    body: {
      matchId
    } // replace this with attributes you need
  };
  // console.log('myInit', myInit);

  return API.post(apiName, path, myInit)
    .then(response => {
      // Add your code here
      return response;
    })
    .catch(error => {
      console.log(apiName, path, error.response);
    });
}

export function configure(conf: any) {
  // console.log('API conf', conf);
  return API.configure(conf);
}

async function getTokenHeaders() {
  return {
    Authorization: ((await Auth.currentSession()) as any).idToken.jwtToken
  };
}

// export default { getScores, configure, reviewSession, bail, getICE };

// import axios, { AxiosRequestConfig } from 'axios';
/*
var instance = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  timeout: 3000
  // headers: { 'X-Custom-Header': 'foobar' }
});

axios.interceptors.request.use(
  async function(config) {
    // Do something before request is sent
    config.headers.Authorization = ((await Auth.currentSession()) as any).idToken.jwtToken;
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
*/

/*
  const url =
    'https://lbbyqvw3x9.execute-api.us-east-1.amazonaws.com/staging/hello';
  const parsed_url = _parseUrl(url);
  const params = {
    method: 'GET',
    url,
    host: parsed_url.host,
    path: parsed_url.path,
    headers: await getTokenHeaders(),
    data: null,
    withCredentials: true
  };

  return _request(params);
  */

/*
function _request(params: AxiosRequestConfig, isAllResponse = false) {
  return instance
    .request(params)
    .then(response => (isAllResponse ? response : response.data))
    .catch(error => {
      console.debug(error);
      throw error;
    });
}

function _parseUrl(url: string) {
  const parts = url.split('/');

  return {
    host: parts[2],
    path: '/' + parts.slice(3).join('/')
  };
}
*/
