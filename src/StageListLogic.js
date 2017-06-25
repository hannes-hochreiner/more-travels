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
    this.repo.getStagesByTripId(data.tripId).then(stages => {
      data.init = true;
      data.stages = stages;
      this.publisher.publish(`${id}.update`, data);
    });
  }
}
