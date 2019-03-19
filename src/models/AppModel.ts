import { types } from 'mobx-state-tree';
import { RouterModel } from 'mst-react-router';
import AuthModel from './AuthModel';
import DebateModel from './DebateModel';
import { Instance } from 'mobx-state-tree';
import React from 'react';

const AppModel = types
  .model({
    auth: AuthModel,
    debate: DebateModel,
    router: RouterModel,
    showNav: true,
    _isStandalone: false,
    dailyOpen: false, // only use for invalidation
    micAllowed: false
  })
  .views(self => ({
    /* isDailyOpen() {
      return self.dailyOpen || TimeService.
    },*/
    isGuest() {
      if (!self.auth.user) return false;
      return self.auth.user!.email === 'guest@dinnertable.chat';
    },
    isLive() {
      const h = window.location.hostname;
      return (
        h.indexOf('test') === -1 &&
        h.indexOf('.dinnertable') === -1 &&
        h.indexOf('dinnertable.chat') !== -1
      );
    },
    isAdmin() {
      return (
        self.auth.user && self.auth.user!.id === 'Google_111841421166386376573'
      );
    },
    isStandalone() {
      if (self._isStandalone) return true;
      // return true;
      const enabledOnSafari = (window.navigator as any).standalone === true;
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        enabledOnSafari ||
        !!window['cordova'] ||
        document.URL.indexOf('file://') > -1 ||
        document.URL.indexOf('FILE://') > -1 ||
        navigator.userAgent === 'Mozilla/5.0 Google' ||
        navigator.userAgent === 'Mozilla/5.0 Google PWA'
      );
    },
    isQuickmatch() {
      const param = new URLSearchParams(window.location.search);
      return param.has('quickmatch');
    }
  }))
  .actions(self => ({
    setMicAllowed(isEnabled: boolean) {
      self.micAllowed = isEnabled;
    },
    setStandalone() {
      self._isStandalone = true;
    },
    setDailyOpen(open: boolean) {
      self.dailyOpen = open;
    },
    gotoHomeMenu() {
      self.showNav = true;
      // if (!self.debate.isTest)
      self.router.push('/home');
      // else self.router.push('/test');
    },
    showNavbar() {
      self.showNav = true;
    },
    hideNavbar() {
      self.showNav = false;
    },
    login() {
      if (self.isGuest()) self.auth.logout();
      self.auth.login();
    },
    // Covers guest login action as well
    authenticated(signedIn: boolean) {
      console.log('signedIn');
      // localStorage.removeItem('signup');
      // if (!signedIn) return;

      if (localStorage.getItem('quickmatch')) {
        localStorage.removeItem('quickmatch');
        self.router.push('/quickmatch');
      } else if (self.isStandalone()) self.router.push('/home');
      else if (self.isGuest()) {
        self.router.push('/tutorial');
      } else self.router.push('/tutorial');
      /* else if (
        localStorage.getItem('quickmatch') &&
        self.auth.isAuthenticated() &&
        self.isGuest()
      ) {
        // localStorage.setItem('quickmatch', 'y');
        // store.router.push('/tutorial');
        self.router.push('/quickmatch'); // just do it
      }*/

      // (self as any).signedIn();
    }
  }));

export type Type = Instance<typeof AppModel>;

export const create = (routerModel: RouterModel, fetcher: any) =>
  AppModel.create(
    {
      auth: AuthModel.create({}),
      debate: DebateModel.create({}),
      router: routerModel
    },
    {
      fetch: fetcher,
      alert: m => console.log(m) // Noop for demo: window.alert(m)
    }
  );

export const Context = React.createContext<Type | null>(null);
