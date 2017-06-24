import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class StageListLogic {
  constructor(repo) {
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this)
    }, 'ui.stagelist');
    this.publisher = new PubSubPublisher('ui.stagelist');

    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    data.state.id = data.props.id;
    data.state.tripId = data.props.tripId;
    data.state.stages = this.repo.getStagesByTripId(data.state.tripId);
    this.publisher.publish(`${id}.update`, data.state);
  }
}
