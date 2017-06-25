import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import uuid from 'uuid';

export default class TripListLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'add': this.add.bind(this)
    }, 'ui.triplist');
    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.triplist');
  }

  init(realm, type, id, action, data) {
    this.repo.getAllTrips().then(trips => {
      data.init = true;
      data.trips = trips;
      this.publisher.publish(`${id}.update`, data);
    });
  }

  add(realm, type, id, action, data) {
    this.nav.goToTrip(uuid());
  }
}
