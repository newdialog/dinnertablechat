import { types } from 'mobx-state-tree';
import { RouterModel } from 'mst-react-router';
import AuthModel from './AuthModel';
import { Instance } from 'mobx-state-tree';

const AppModel = types.model({
  auth: AuthModel,
  router: RouterModel
});

export type Type = Instance<typeof AppModel>;

export const create = (routerModel: RouterModel, fetcher: any) =>
  AppModel.create(
    {
      router: routerModel,
      auth: AuthModel.create({})
    },
    {
      fetch: fetcher,
      alert: m => console.log(m) // Noop for demo: window.alert(m)
    }
  );
