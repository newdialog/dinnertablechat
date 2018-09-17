import { types, Instance } from 'mobx-state-tree';

const MatchModel = types.model({
  team: types.enumeration(['red', 'blue']),
  leader: types.boolean,
  userId: types.string,
  matchId: types.string,
  timeStarted: types.maybe(types.number),
  sync: false
})

export type MatchModelType = Instance<typeof MatchModel>;

const DebateModel = types
  .model({
    contribution: -1,
    position: -1,
    propostion: '',
    step: 0,
    topic: '',
    match: types.maybeNull(MatchModel)
  })
  .actions(self => ({
    setPosition(position: number, proposition: string, topic: string) {
      self.position = position;
      self.propostion = proposition;
      self.topic = topic;

    },
    createMatch(obj: Instance<typeof MatchModel>) {
      self.match = obj;
      // record match started time
      if(!obj.timeStarted) self.match!.timeStarted = Math.floor((new Date()).getTime() / 1000);
    },
    setContribution(amount: number) {
      self.contribution = amount;
    },
    setStep(step: number) {
      self.step = step;
    },
    resetQueue() {
      self.contribution = -1;
      self.position = -1;
      self.propostion = '';
      self.step = 0;
      self.topic = '';
      self.match = null;
    }
  }));

export default DebateModel;
