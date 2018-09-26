import { types, Instance } from 'mobx-state-tree';

const MatchModel = types.model({
  team: types.enumeration(['red', 'blue']),
  leader: types.boolean,
  userId: types.string,
  matchId: types.string,
  otherState: types.string, // serialized state of other person
  timeStarted: types.maybe(types.number),
  sync: false
});

export type MatchModelType = Instance<typeof MatchModel>;

const DebateModel = types
  .model({
    contribution: -1,
    position: -1,
    topic: '',
    character: -1,
    match: types.maybeNull(MatchModel)
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
    syncMatch() {
      if (!self.match) throw new Error('match not init');
      self.match!.sync = true;
    },
    setContribution(amount: number) {
      self.contribution = amount;
    },
    setCharacter(character: number) {
      self.character = character;
    },
    resetQueue() {
      self.contribution = -1;
      self.position = -1;
      self.character = -1;
      self.topic = '';
      self.match = null;
    }
  }));

export default DebateModel;
