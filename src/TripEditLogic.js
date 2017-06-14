import PubSub from 'pubsub-js';

export default class TripEditLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
    this.handleFunctions = {
      'init': this.init,
      'editDatesStart': this.editDatesStart,
      'editDatesEnd': this.editDatesEnd,
      'editTitleStart': this.editTitleStart,
      'editTitleEnd': this.editTitleEnd,
    };

    PubSub.subscribe('ui.tripedit', this.handle.bind(this));
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

    PubSub.publish(`ui.tripedit.${id}.update`, state);
  }

  editDatesStart(realm, type, id, action, state) {
    state.editDates = true;
    state.dateStart = new Date(state.obj.start);
    state.dateEnd = new Date(state.obj.end);

    PubSub.publish(`ui.tripedit.${id}.update`, state);
  }

  editDatesEnd(realm, type, id, action, state) {
    state.obj.start = state.dateStart.toLocaleFormat('%Y-%m-%d');
    state.obj.end = state.dateEnd.toLocaleFormat('%Y-%m-%d');
    state.editDates = false;

    PubSub.publish(`ui.tripedit.${id}.update`, state);
  }

  editTitleStart(realm, type, id, action, state) {
    state.editTitle = true;
    state.title = state.obj.title;

    PubSub.publish(`ui.tripedit.${id}.update`, state);
  }

  editTitleEnd(realm, type, id, action, state) {
    state.obj.title = state.title;
    state.editTitle = false;

    PubSub.publish(`ui.tripedit.${id}.update`, state);
  }
}
