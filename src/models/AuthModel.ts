import { types, Instance } from 'mobx-state-tree';
import * as Auth from '../services/AuthService';

const UserModel = types.model({
  email: types.string,
  name: types.string,
  // credits: types.integer,
  // karma: types.maybe(types.integer),
  // token: types.string,
  // data: types.frozen({})
});

const AWSModel = types.model({
  accessKeyId: types.string,
  secretAccessKey: types.string,
  sessionToken: types.string,
  region: types.string,
})

const AuthModel = types
  .model({
    user: types.maybe(UserModel),
    aws: types.maybe(AWSModel),
    doLogin: false,
    loggedIn: false
  })
  .actions(self => ({
    login() {
      // self.text = newTitle
      self.doLogin = true;

      console.log('login action');
    },
    logout() {
      Auth.logout();
    },
    authenticated(authServiceData: any) {
      const { user, accessKeyId, secretAccessKey, sessionToken, region } = authServiceData;

      const umodel: Instance<typeof UserModel> = { 
        name: user.name, 
        email: user.email
      };

      const aws: Instance<typeof AWSModel> = { 
        accessKeyId,
        secretAccessKey, 
        sessionToken,
        region
      };

      self.aws = aws;
      self.user = umodel;
      self.loggedIn = true;
    }
  }));

export default AuthModel;
