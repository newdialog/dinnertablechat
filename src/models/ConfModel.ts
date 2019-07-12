import { types } from 'mobx-state-tree';

const ConfModel = types
  .model({
    positions: types.maybeNull(types.frozen<any>()),
    finished: false,
    isTest: false
  })
  .actions(self => ({
    setPosition(positions: any) {
      self.positions = positions;
    },
    setTest(isTest: boolean) {
      self.isTest = isTest;
    },
    resetQueue() {
      self.positions = null;
    }
  }));

export default ConfModel;
