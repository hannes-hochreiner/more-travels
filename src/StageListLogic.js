import PubSub from 'pubsub-js';

export default class StageListLogic {
  constructor() {
    this.stages = {
      2: [
        { id: 'p1'},
        { id: 'p2'},
        { id: 't1'},
        { id: 'p3'},
        { id: 't2'},
        { id: 'p4'},
      ]
    };

    PubSub.subscribe('ui.stagelist', this.handle.bind(this));
  }

  handle(topic, data) {
    let [, , id, action] = topic.split('.');
    let stages = this.stages[data.tripId] || [];

    if (action === 'didMount') {
      PubSub.publish(`ui.stagelist.${id}.update`, {
        stages: stages
      });
    }
  }
}
