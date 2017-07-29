import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import { oneShot as psos } from './PubSubOneShot';

export default class StageListEntryLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'open': this.open.bind(this),
    }, 'ui.stagelistentry');
    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.stagelistentry');
  }

  init(realm, type, id, action, data) {
    this.repo.getStageByTripIdId(data.tripid, data.stageid).then(stage => {
      data.init = true;
      data.obj = stage;

      return Promise.all([
        psos(
          `service.format.timestampFull`,
          {timestamp: data.obj.timestampstart},
        ),
        psos(
          `service.format.timestampFull`,
          {timestamp: data.obj.timestampend},
        ),
      ]);
    }).then(res => {
      data.timestampstart = res[0].timestamp;
      data.timestampend = res[1].timestamp;
      this.publisher.publish(`${id}.update`, data);
    });
  }

  open(realm, type, id, action, data) {
    this.nav.goToStage(data.obj.tripid, data.obj.stageid);
  }
}
