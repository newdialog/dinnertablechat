import { types, Instance } from 'mobx-state-tree';

const DebateModel = types
  .model({
    contribution: -1,
    position: '',
    propostion: '',
    step: 0,
    topic: '',
  })
  .actions(self => ({
    setPosition(position: string, proposition: string, topic: string) {
      self.position = position;
      self.propostion = proposition;
      self.topic = topic;

    },
    setContribution(amount: number) {
      self.contribution = amount;
    },
    setStep(step: number) {
      self.step = step;
    },
    resetQueue() {
      self.contribution = -1;
      self.position = '';
      self.propostion = '';
      self.step = 0;
      self.topic = '';
    }
  }));

export default DebateModel;
