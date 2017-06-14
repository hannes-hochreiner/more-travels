import PubSub from 'pubsub-js';

export default class StageListEntryLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      'p1': { id: 'p1', type: 'place', title: 'place1'},
      'p2': { id: 'p2', type: 'place', title: 'place2'},
      't1': { id: 't1', type: 'travel', title: 'travel2-3'},
      'p3': { id: 'p3', type: 'place', title: 'place3'},
      't2': { id: 't2', type: 'travel', title: 'travel3-4'},
      'p4': { id: 'p4', type: 'place', title: 'place4'},
    };

    PubSub.subscribe('ui.stagelistentry', this.handle.bind(this));
  }

  handle(topic, data) {
    let [, , id, action] = topic.split('.');

    if (action === 'didMount') {
      data.obj = this.objs[id];

      PubSub.publish(`ui.stagelistentry.${id}.update`, data);
    }
  }
}
