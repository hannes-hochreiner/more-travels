import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripViewLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
    }, 'ui.tripview');

    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.tripview');
  }

  init(realm, type, id, action, data) {
    data.obj = this.repo.getTripById(id);
    data.init = true;

    this.publisher.publish(`${id}.update`, data);
  }
}
