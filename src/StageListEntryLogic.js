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
    data.obj = this.repo.getStageById(id);
    this.publisher.publish(`${id}.update`, data);
  }
}
