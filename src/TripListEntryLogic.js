import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripListEntryLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'open': this.open.bind(this),
    }, 'ui.triplistentry');
    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.triplistentry');
  }

  init(realm, type, id, action, data) {
    this.repo.getTripById(id).then(trip => {
      data.init = true;
      data.obj = trip;
      this.publisher.publish(`${id}.update`, data);
    });
  }

  open(realm, type, id, action, data) {
    this.nav.goToTrip(id);
  }
}
