import { types } from 'mobx-state-tree';

const UserModel = types.model({
  email: types.string,
  name: types.string,
  // credits: types.integer,
  // karma: types.maybe(types.integer),
  token: types.string
  // data: types.frozen({})
});

const AuthModel = types
  .model({
    user: types.maybe(UserModel),
    doLogin: false,
    loggedIn: false
  })
  .actions(self => ({
    login() {
      // self.text = newTitle
      self.doLogin = true;
      console.log('login action');
    },
    authenticated(user: any) {
      const { email, name, username, email_verified } = user;
      self.user = self.user || { name, token: username, email };
      self.user.name = name;
      self.user.email = name;
      self.user.token = username;
      self.loggedIn = true;
    }
  }));

export default AuthModel;
