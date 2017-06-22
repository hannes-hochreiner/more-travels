import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripEditLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'editDatesStart': this.editDatesStart.bind(this),
      'editDatesEnd': this.editDatesEnd.bind(this),
      'editTitleStart': this.editTitleStart.bind(this),
      'editTitleEnd': this.editTitleEnd.bind(this),
      'save': this.save.bind(this),
    }, 'ui.tripedit');
    this.publisher = new PubSubPublisher('ui.tripedit');
    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    data.state.obj = this.objs[id];
    data.state.init = true;

    this.publisher.publish(`${id}.update`, data.state);
  }

  editDatesStart(realm, type, id, action, data) {
    data.state.editDates = true;
    data.state.dateStart = new Date(data.state.obj.start);
    data.state.dateEnd = new Date(data.state.obj.end);

    this.publisher.publish(`${id}.update`, data.state);
  }

  editDatesEnd(realm, type, id, action, data) {
    data.state.obj.start = data.state.dateStart.toLocaleFormat('%Y-%m-%d');
    data.state.obj.end = data.state.dateEnd.toLocaleFormat('%Y-%m-%d');
    data.state.editDates = false;

    this.publisher.publish(`${id}.update`, data.state);
  }

  editTitleStart(realm, type, id, action, data) {
    data.state.editTitle = true;
    data.state.title = data.state.obj.title;

    this.publisher.publish(`${id}.update`, data.state);
  }

  editTitleEnd(realm, type, id, action, data) {
    data.state.obj.title = data.state.title;
    data.state.editTitle = false;

    this.publisher.publish(`${id}.update`, data.state);
  }

  save(realm, type, id, action, data) {
    console.log('saving');
    this.publisher.publish(`${id}.view`, data);
  }
}
