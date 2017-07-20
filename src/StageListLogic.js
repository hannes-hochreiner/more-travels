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
      stages.sort((s1, s2) => {
        let dt1 = s1.timestampstart.datetime;
        let dt2 = s2.timestampstart.datetime;

        if (dt1 < dt2) {
          return -1;
        }

        if (dt1 > dt2) {
          return 1;
        }

        return 0;
      });
      data.init = true;
      data.stages = stages;
      this.publisher.publish(`${id}.update`, data);
    });
  }
}
