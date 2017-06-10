import PubSub from 'pubsub-js';

export default class ListEntryLogic {
  constructor() {
    this.objs = {
      1: { id: 1, title: 'test1' },
      2: { id: 2, title: 'test2' },
      3: { id: 3, title: 'test3' }
    };
    PubSub.subscribe('ui.listentry', this.handle.bind(this));
  }

  handle(topic, data) {
    let tokens = topic.split('.');
    let id = tokens[2];
    let action = tokens[3];

    if (action === 'didMount') {
      data.obj = this.objs[id];

      PubSub.publish(`ui.listentry.${id}.update`, data);
    }
  }
}
