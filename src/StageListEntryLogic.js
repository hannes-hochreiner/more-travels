import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class StageListEntryLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
    }, 'ui.stagelistentry');
    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.stagelistentry');
  }

  init(realm, type, id, action, data) {
    this.repo.getStageByTripIdId(data.tripid, data.stageid).then(stage => {
      data.init = true;
      data.obj = stage;
      this.publisher.publish(`${id}.update`, data);
    });
  }
}
