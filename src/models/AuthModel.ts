import { types, Instance } from 'mobx-state-tree';
import * as Auth from '../services/AuthService';
import * as AuthService from '../services/AuthService';

const UserModel = types.model({
  email: types.string,
  name: types.string,
  id: types.string
  // credits: types.integer,
  // karma: types.maybe(types.integer),
  // token: types.string,
  // data: types.frozen({})
});

// TODO: remove?
const AWSModel = types.model({
  region: types.string
});

const AuthModel = types
  .model({
    user: types.maybe(UserModel),
    aws: types.maybe(AWSModel),
    doLogin: false,
    // loggedIn: false,
    isNotLoggedIn: false
  })
  .actions(self => ({
    doGuestLogin() {
      window.gtag('event', 'guest_login_action', {
        event_category: 'auth'
      });
      AuthService.guestLogin();
    },
    login() {
      if (!self.doLogin)
        window.gtag('event', 'login_action', {
          event_category: 'auth'
        });
      self.doLogin = true;
    },
    logout() {
      Auth.logout();
      self.aws = undefined;
      self.user = undefined;
      // self.isNotLoggedIn = true;
    },
    notLoggedIn() {
      self.isNotLoggedIn = true;
    },
    authenticated(authServiceData: any) {
      const { user, region } = authServiceData;

      /* if (!self.user)
        window.gtag('event', 'authenticated', {
          event_category: 'auth'
        });*/

      const umodel: Instance<typeof UserModel> = {
        name: user.name,
        email: user.email,
        id: user.id
      };

      const aws: Instance<typeof AWSModel> = {
        region
      };

      self.aws = aws;
      self.user = umodel;
      // self.loggedIn = true;
      self.isNotLoggedIn = false;
    }
  }))
  .views(self => ({
    isAuthenticated() {
      return self.user && self.aws && !self.isNotLoggedIn;
    }
  }));

export default AuthModel;
