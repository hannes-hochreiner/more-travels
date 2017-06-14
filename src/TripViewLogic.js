import PubSub from 'pubsub-js';

export default class TripViewLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
    this.handleFunctions = {
      'init': this.init,
    };

    PubSub.subscribe('ui.tripview', this.handle.bind(this));
  }

  handle(topic, data) {
    let [realm, type, id, action] = topic.split('.');
    let fun = this.handleFunctions[action];

    if (fun) {
      return fun.bind(this)(realm, type, id, action, data);
    }
  }

  init(realm, type, id, action, state) {
    state.obj = this.objs[id];
    state.init = true;

    PubSub.publish(`ui.tripview.${id}.update`, state);
  }
}
