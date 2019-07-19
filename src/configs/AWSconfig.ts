/* tslint:disable:no-bitwise */
import { Auth } from 'aws-amplify';

// AWS Mobile Hub Project Constants
const awsOauth = {
  // Domain name
  // domain : 'your-domain-prefix.auth.us-east-1.amazoncognito.com',
  domain: 'auth.dinnertable.chat',
  // Authorized scopes
  scope: [
    'phone',
    'email',
    'profile',
    'openid',
    'aws.cognito.signin.user.admin'
  ],

  // Callback URL
  redirectSignIn: 'https://www.dinnertable.chat/callback',

  // Sign out URL
  redirectSignOut: 'https://www.dinnertable.chat/signout',

  // 'code' for Authorization code grant,
  // 'token' for Implicit grant
  responseType: 'code',

  // optional, for Cognito hosted ui specified options
  options: {
    // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
    AdvancedSecurityDataCollectionFlag: true
  }
};

export const API_CONF = {
  endpoints: [
    {
      name: 'History',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      endpoint: 'https://lbbyqvw3x9.execute-api.us-east-1.amazonaws.com/staging'
    },
    {
      name: 'Ice',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      endpoint:
        'https://lmtvbtw7dc.execute-api.us-east-1.amazonaws.com/production'
    }
  ]
};

export const API_CONF_PROD = {
  endpoints: [
    {
      name: 'History',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      endpoint:
        'https://lbbyqvw3x9.execute-api.us-east-1.amazonaws.com/production'
    },
    {
      name: 'Ice',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      endpoint:
        'https://lmtvbtw7dc.execute-api.us-east-1.amazonaws.com/production'
    }
  ]
};

const pubSubCfg = (region: string) => ({
  aws_pubsub_region: region,
  aws_pubsub_endpoint:
    'wss://a23rmqrj31k0l4-ats.iot.us-east-1.amazonaws.com/mqtt',
  clientId: uuidv4()
});

export const oauth = awsOauth;
let initLog = false;
export const injectConfig = (cfg: any) => {
  const localServer: string = String(process.env.REACT_APP_HOST_URL);
  const prod = process.env.REACT_APP_ENV === 'production';

  cfg.Analytics = cfg.Analytics || {};
  cfg.Analytics.disabled = true;
  cfg['aws_app_analytics'] = false;
  // OPTIONAL - disable Analytics if true

  cfg.API = API_CONF_PROD; // prod ? API_CONF_PROD : API_CONF;

  cfg.Auth = {
    oauth: awsOauth
  };

  const region = cfg.aws_cognito_region;

  // cfg.PubSub = pubSubCfg(region);

  cfg.Auth.oauth.redirectSignIn = localServer + '/callback';
  cfg.Auth.oauth.redirectSignOut = localServer + '/signout';

  /* if (!initLog)
    console.log(
      'cfg.Auth',
      cfg.Auth,
      process.env.REACT_APP_aws_user_pools_web_client_id,
      'isProd',
      prod
    );*/

  // For AWS -JD
  cfg.Auth.identityPoolId = 'us-east-1:5173fb21-e414-43bc-af6c-3a65de8caf22';

  cfg.aws_user_pools_web_client_id =
    process.env.REACT_APP_aws_user_pools_web_client_id ||
    '1a66tr0jclinub7j3ls0j3mutt';

  // if (!initLog) console.log(cfg);

  initLog = true;
  return cfg;
};

// https://github.com/aws-amplify/amplify-js/issues/684
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (c: string) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}
