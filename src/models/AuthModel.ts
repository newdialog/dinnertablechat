import { types, Instance } from 'mobx-state-tree';

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

      const umodel: Instance<typeof UserModel> = { name, email, token: username };

      self.user = umodel;
      self.loggedIn = true;
    }
  }));

export default AuthModel;
