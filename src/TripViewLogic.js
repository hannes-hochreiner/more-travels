import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripViewLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
    }, 'ui.tripview');

    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.tripview');
  }

  init(realm, type, id, action, data) {
    data.state.obj = this.objs[id];
    data.state.init = true;

    this.publisher.publish(`${id}.update`, data.state);
  }
}
