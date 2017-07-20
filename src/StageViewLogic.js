import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import { oneShot as psos } from './PubSubOneShot';
import uuid from 'uuid';

export default class StageViewLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
    }, 'ui.stageview');
    this.publisher = new PubSubPublisher('ui.stageview');
    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    if (data.obj) {
      let fReqId1 = uuid();
      let fReqId2 = uuid();

      Promise.all([
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
      ]).then(res => {
        this.publisher.publish(`${id}.update`, {
          init: true,
          timestampstart: res[0].timestamp,
          timestampend: res[1].timestamp,
        });
      });

      return;
    }
  }
}
