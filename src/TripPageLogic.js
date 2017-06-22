import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripPageLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'close': this.close.bind(this),
      'edit': this.edit.bind(this),
      'view': this.view.bind(this),
    }, 'ui.trippage');
    this.publisher = new PubSubPublisher('ui.trippage');
    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    data.state.obj = this.objs[id];

    this.publisher.publish(`${id}.update`, data.state);
  }

  close(realm, type, id, action, data) {
    this.nav.goToTripList();
  }

  edit(realm, type, id, action, data) {
    data.state.editMode = true;

    this.publisher.publish(`${id}.update`, data.state);
  }

  view(realm, type, id, action, data) {
    data.state.editMode = false;

    this.publisher.publish(`${id}.update`, data.state);
  }
}
