import { types } from 'mobx-state-tree';
import { RouterModel } from 'mst-react-router';
import AuthModel from './AuthModel';
import { Instance } from 'mobx-state-tree';

const AppModel = types
  .model({
    text: 'DEFAULT VAL',
    auth: AuthModel,
    router: RouterModel
  })
  .actions(self => ({
    setTitle(newTitle: string) {
      self.text = newTitle;
    }
  }));

export type Type = Instance<typeof AppModel>;

export const create = (routerModel: RouterModel, fetcher: any) =>
  AppModel.create(
    {
      text: 'DEFAULT VAL',
      router: routerModel,
      auth: AuthModel.create({})
    },
    {
      fetch: fetcher,
      alert: m => console.log(m) // Noop for demo: window.alert(m)
    }
  );
