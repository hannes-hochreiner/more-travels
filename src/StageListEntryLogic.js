import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import { oneShot as psos } from './PubSubOneShot';
import uuid from 'uuid';

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

      let fReqId1 = uuid();
      let fReqId2 = uuid();

      return Promise.all([
        psos(
          `service.format.${fReqId1}.timestampFull`,
          {timestamp: data.obj.timestampstart},
          `service.format.${fReqId1}.formattedTimestampFull`
        ),
        psos(
          `service.format.${fReqId2}.timestampFull`,
          {timestamp: data.obj.timestampend},
          `service.format.${fReqId2}.formattedTimestampFull`
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
