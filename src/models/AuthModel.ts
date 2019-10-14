import { AwsAuth } from './../services/AuthService';
import {
  types,
  Instance,
  flow,
  getSnapshot,
  SnapshotIn
} from 'mobx-state-tree';
import uuid from 'short-uuid';
// import { signIn } from 'components/aws/AuthWrapper';

const UserModel = types
  .model({
    email: types.string,
    name: types.string,
    id: types.string,
    groups: types.array(types.string),
    guestSeed: types.string,
    numDebates: types.number,
    userPoolId: types.maybe(types.string)
    // creds: types.maybeNull(types.frozen<any>())
  })
  .actions(self => ({
    updateNumDebates(num: number) {
      self.numDebates = num;
    }
    /* setCred(creds: any) {
      self.creds = creds;
    } */
  }));

// TODO: remove?
const AWSModel = types.model({
  region: types.string
});

const AuthModel = types
  .model({
    user: types.maybe(UserModel),
    aws: types.maybe(AWSModel),
    doLogin: 0,
    doGuestLogin: false,
    doLogout: false,
    // didLogin: false,
    isNotLoggedIn: types.maybeNull(types.boolean)
  })
  .actions(self => ({
    guestLogin: function() {
      if (self.doGuestLogin) return;
      window.gtag('event', 'guest_login_action', {
        event_category: 'auth'
      });

      self.doGuestLogin = true;
      // self.loggedIn = true;
    },
    snapshot() {
      return JSON.stringify(getSnapshot(self));
    },
    login(loginTo?: string, register:boolean=false) {
      if (!self.doLogin)
        window.gtag('event', 'login_action', {
          event_category: 'auth'
        });

      //if (loginTo) {
      const current = window.location.href;
      localStorage.setItem('loginTo', loginTo || current);
      //}
      if(register) self.doLogin = 2;
      else self.doLogin = 1;
      // signIn();
    },
    signUp(loginTo?: string) {
      (self as any).login(loginTo, true);
    },
    logoutFinished() {
      self.aws = undefined;
      self.user = undefined;
      self.doLogout = false;
      self.isNotLoggedIn = true;

      const page = localStorage.getItem('logoutTo');
      localStorage.removeItem('logoutTo');

      if (page !== '' && page) window.location.assign(page);
      else {
        const loginPage = localStorage.getItem('loginTo');
        console.log('loginPage', loginPage);
        (self as any).login(loginPage);
      }
    },
    logout(logoutTo?: string) {
      if (logoutTo) localStorage.setItem('logoutTo', logoutTo || '/about');
      else localStorage.removeItem('logoutTo');

      self.doLogout = true;
    },
    logoutLogin(loginTo?: string) {
      const current = window.location.href;
      localStorage.setItem('loginTo', loginTo || current);
      localStorage.setItem('logoutTo', '');
      self.doLogout = true;
    },
    notLoggedIn() {
      self.isNotLoggedIn = true;
    },
    authenticated(adata: AwsAuth, viaLogin: boolean) {
      const { id } = adata;

      if (!id) throw new Error('no id');

      // self.didLogin = viaLogin;
      /* if (!self.user)
        window.gtag('event', 'authenticated', {
          event_category: 'auth'
        });*/
      let seed = localStorage.getItem('guestSeed');
      if (!seed) {
        seed = uuid.generate();
        console.log('generate seed', seed);
        localStorage.setItem('guestSeed', seed as string);
      }

      // Update analytics
      // const isGuest = user.id === '78439c31-beef-4f4d-afbb-e948e3d3c932';
      // let idWithSeed = !isGuest ? user.id : user.id + '__' + seed;
      // console.log('idWithSeed', idWithSeed);
      if (window.gtag) window.gtag('set', 'userId', id);
      // mixpanel auth
      if (window.mixpanel) {
        (window.mixpanel as any).identify(id);
        adata.email &&
          (window.mixpanel as any).people.set({
            $email: adata.email,
            $last_login: new Date()
          });
      }
      // ======
      const umodel: SnapshotIn<typeof UserModel> = {
        // name: adata.name,
        // email: adata.email,
        // groups: adata.groups,
        // id: adata.id,
        ...adata,
        guestSeed: seed,
        numDebates: 0
      };

      if (adata.userPoolId) umodel.userPoolId = adata.userPoolId;

      const aws: Instance<typeof AWSModel> = {
        region: 'us-east-1'
      };

      self.aws = aws;
      self.user = UserModel.create(umodel);

      // self.loggedIn = true;
      self.isNotLoggedIn = false;
      self.doGuestLogin = false;
      self.doLogin = 0;

      console.log('user:', self.user!.id);
    }
  }))
  .views(self => ({
    isAdmin() {
      // console.log(self.isNotLoggedIn, !self.user);
      if (self.isNotLoggedIn || !self.user) return false;
      return self.user.groups.indexOf('conf_admins') !== -1;
    },
    geCogId() {
      if (!self.user) throw new Error('no user');
      return self.user!.id; // .replace('us-east-1:', '');
    },
    isAuthenticated() {
      if (!self.user || !self.aws) return false;
      return !self.isNotLoggedIn;
    }
  }));

export default AuthModel;
