import { types, Instance, flow, getSnapshot } from 'mobx-state-tree';
import uuid from 'short-uuid';
// import { signIn } from 'components/aws/AuthWrapper';

const UserModel = types
  .model({
    email: types.string,
    name: types.string,
    id: types.string,
    groups: types.array(types.string),
    guestSeed: types.string,
    numDebates: types.number
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
    doLogin: false,
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
    login(loginTo?: string) {
      if (!self.doLogin)
        window.gtag('event', 'login_action', {
          event_category: 'auth'
        });

      if (loginTo) {
        localStorage.setItem('loginTo', loginTo!);
      }
      self.doLogin = true;
      // signIn();
    },
    logout(didLogOut: boolean = false) {
      if (didLogOut) {
        self.doLogout = false;
        self.isNotLoggedIn = true;
        return;
      }

      self.doLogout = true;
      self.aws = undefined;
      self.user = undefined;
    },
    guestSignup() {
      localStorage.setItem('signup', 'y'); // TODO: figure out if this is still needed
      (self as any).logout();
      (self as any).login();
    },
    notLoggedIn() {
      self.isNotLoggedIn = true;
    },
    authenticated(authServiceData: any, viaLogin: boolean) {
      const {
        user,
        region
      }: {
        user: {
          name: string;
          email: string;
          id: string;
          groups: Array<string>;
        };
        region: any;
      } = authServiceData;

      if (!user.id) throw new Error('no id');

      // self.didLogin = viaLogin;
      /* if (!self.user)
        window.gtag('event', 'authenticated', {
          event_category: 'auth'
        });*/
      let seed = localStorage.getItem('guestSeed');
      if (!seed) {
        seed = uuid.generate();
        console.log('generate seed', seed);
        localStorage.setItem('guestSeed', seed);
      }

      // Update analytics
      // const isGuest = user.id === '78439c31-beef-4f4d-afbb-e948e3d3c932';
      // let idWithSeed = !isGuest ? user.id : user.id + '__' + seed;
      // console.log('idWithSeed', idWithSeed);
      window.gtag('set', 'userId', user.id);
      // mixpanel auth
      if (window.mixpanel) {
        (window.mixpanel as any).identify(user.id);
        user.email &&
          (window.mixpanel as any).people.set({
            $email: user.email,
            $last_login: new Date()
          });
      }
      // ======

      const umodel = {
        name: user.name,
        email: user.email,
        groups: user.groups,
        id: user.id,
        guestSeed: seed,
        numDebates: 0
      };

      const aws: Instance<typeof AWSModel> = {
        region
      };

      self.aws = aws;
      self.user = UserModel.create(umodel);

      // self.loggedIn = true;
      self.isNotLoggedIn = false;
      self.doGuestLogin = false;
      self.doLogin = false;
    }
  }))
  .views(self => ({
    isAdmin() {
      if (self.isNotLoggedIn || !self.user) return false;
      return self.user.groups.indexOf('conf_admins') !== -1;
    },
    geCogId() {
      return self.aws!.region + ':' + self.user!.id;
    },
    isAuthenticated() {
      return self.user && self.aws && !self.isNotLoggedIn;
    }
  }));

export default AuthModel;
