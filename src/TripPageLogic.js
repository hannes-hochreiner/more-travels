import PubSub from 'pubsub-js';

export default class TripPageLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
    this.handleFunctions = {
      'didMount': this.didMount,
      'close': this.close,
      'edit': this.edit,
      'editDatesStart': this.editDatesStart,
      'editDatesEnd': this.editDatesEnd,
      'save': this.save
    };

    PubSub.subscribe('ui.trippage', this.handle.bind(this));
  }

  didMount(realm, type, id, action, state) {
    state.obj = this.objs[id];

    PubSub.publish(`ui.trippage.${id}.update`, state);
  }

  close(realm, type, id, action, state) {
    this.nav.goToTripList();
  }

  edit(realm, type, id, action, state) {
    state.editMode = true;

    PubSub.publish(`ui.trippage.${id}.update`, state);
  }

  editDatesStart(realm, type, id, action, state) {
    state.editDates = true;
    state.dateStart = new Date(state.obj.start);
    state.dateEnd = new Date(state.obj.end);

    PubSub.publish(`ui.trippage.${id}.update`, state);
  }

  editDatesEnd(realm, type, id, action, state) {
    state.obj.start = state.dateStart.toLocaleFormat('%Y-%m-%d');
    state.obj.end = state.dateEnd.toLocaleFormat('%Y-%m-%d');
    state.editDates = false;

    PubSub.publish(`ui.trippage.${id}.update`, state);
  }

  save(realm, type, id, action, state) {
    state.editMode = false;
    
    PubSub.publish(`ui.trippage.${id}.update`, state);
  }

  handle(topic, data) {
    let [realm, type, id, action] = topic.split('.');
    let fun = this.handleFunctions[action];

    if (fun) {
      return fun.bind(this)(realm, type, id, action, data);
    }
  }
}
