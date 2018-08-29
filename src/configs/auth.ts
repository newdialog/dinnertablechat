// AWS Mobile Hub Project Constants
const awsOauth = {
  // Domain name
  // domain : 'your-domain-prefix.auth.us-east-1.amazoncognito.com',
  domain: 'auth.dinnertable.chat',
  // Authorized scopes
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],

  // Callback URL
  redirectSignIn: 'https://jadbox.asuscomm.com/callback',

  // Sign out URL
  redirectSignOut: 'https://jadbox.asuscomm.com/signout',

  // 'code' for Authorization code grant,
  // 'token' for Implicit grant
  responseType: 'code',

  // optional, for Cognito hosted ui specified options
  options: {
    // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
    AdvancedSecurityDataCollectionFlag: true
  }
};

export const oauth = awsOauth;

export const injectConfig = (cfg: any, redirect?: string) => {
  cfg.Auth = {
    oauth: awsOauth
  };
  if (redirect) {
    cfg.Auth.oath.redirectSignIn = redirect + '/callback';
    cfg.Auth.oath.redirectSignOut = redirect + '/signout';
  }
  return cfg;
};
