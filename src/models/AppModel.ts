import { types } from 'mobx-state-tree';
import { RouterModel } from 'mst-react-router';
import AuthModel from './AuthModel';
import DebateModel from './DebateModel';
import { Instance } from 'mobx-state-tree';

const AppModel = types.model({
  auth: AuthModel,
  debate: DebateModel,
  router: RouterModel,
  showNav: true
}).actions(self => ({
  gotoHomeMenu() {
    self.showNav = true;
    if(!self.debate.isTest) self.router.push('/play');
    else self.router.push('/test');
  },
  showNavbar() {
    // self.text = newTitle
    self.showNav = true;
  },
  hideNavbar() {
    // self.text = newTitle
    self.showNav = false;
  },
}));

export type Type = Instance<typeof AppModel>;

export const create = (routerModel: RouterModel, fetcher: any) =>
  AppModel.create(
    {
      auth: AuthModel.create({}),
      debate: DebateModel.create({}),
      router: routerModel,
    },
    {
      fetch: fetcher,
      alert: m => console.log(m) // Noop for demo: window.alert(m)
    }
  );
