import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { string, number } from 'prop-types';
import { boolean } from 'mobx-state-tree/dist/internal';

const OtherPlayerModel = types.model({
  character: -1,
  side: -1
});

const MatchModel = types
  .model({
    team: types.enumeration(['red', 'blue']),
    leader: types.boolean,
    userId: types.string,
    matchId: types.string,
    otherState: types.maybeNull(OtherPlayerModel), // serialized state of other person
    timeStarted: types.maybe(types.number),
    sync: false
  })
  .actions(self => ({}));

export type MatchModelType = SnapshotIn<typeof MatchModel>;

const DebateModel = types
  .model({
    contribution: 0, // -1
    position: -1,
    topic: '',
    character: -1,
    isTest: false,
    match: types.maybeNull(MatchModel),
    finished: false,
    quarter: 0,
    agreed: false
  })
  .actions(self => ({
    setPosition(position: number, topic: string) {
      self.position = position;
      self.topic = topic;
    },
    createMatch(obj: Instance<typeof MatchModel>) {
      self.match = obj;
      // record match started time
      if (!obj.timeStarted)
        self.match!.timeStarted = Math.floor(new Date().getTime() / 1000);
    },
    setOtherState(state: Instance<typeof OtherPlayerModel>) {
      if (!self.match) throw new Error('match model not set yet');
      self.match!.otherState = state;
    },
    endMatch() {
      self.finished = true;
    },
    madeAgreement(agreed: boolean) {
      self.agreed = agreed;
    },
    syncMatch() {
      if (!self.match) throw new Error('match not init');
      self.match!.sync = true;
    },
    unMatch() {
      self.match = null;
    },
    setContribution(amount: number) {
      self.contribution = amount;
    },
    setCharacter(character: number) {
      self.character = character;
    },
    setTest(isTest: boolean) {
      self.isTest = isTest;
    },
    resetQueue() {
      self.contribution = 0; // -1;
      self.position = -1;
      self.character = -1;
      self.topic = '';
      self.quarter = 0;
      self.agreed = false;
      // self.isTest = false;
      self.match = null;
      self.finished = false;
    },
    setQuarter(q: number) {
      self.quarter = q;
    }
  }));

export default DebateModel;
