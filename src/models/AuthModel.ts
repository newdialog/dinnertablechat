import { types } from 'mobx-state-tree';

const UserModel = types.model({
  email: types.maybe(types.string),
  name: types.string,
  credits: types.integer,
  karma: types.integer
});

const AuthModel = types
  .model({
    user: types.maybe(UserModel),
    doLogin: false
  })
  .actions(self => ({
    login() {
      // self.text = newTitle
      self.doLogin = true;
      console.log('login action');
    },
    authenticated(user: any, username: string) {}
  }));

export default AuthModel;
