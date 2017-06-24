import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripListLogic {
  constructor(repo) {
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this)
    }, 'ui.triplist');
    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.triplist');
  }

  init(realm, type, id, action, data) {
    let state = data.state;

    state.trips = this.repo.getAllTrips();

    this.publisher.publish(`${id}.update`, state);
  }
}
