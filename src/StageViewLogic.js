import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import { oneShot as psos } from './PubSubOneShot';

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
      Promise.all([
        psos(
          `service.format.timestampFull`,
          {timestamp: data.obj.timestampstart}
        ),
        psos(
          `service.format.timestampFull`,
          {timestamp: data.obj.timestampend}
        ),
        this.repo.getAttachmentOnObject(data.obj, 'maps/locationstart').catch(() => { return; }),
        this.repo.getAttachmentOnObject(data.obj, 'maps/locationend').catch(() => { return; }),
      ]).then(res => {
        data.init = true;
        data.timestampstart = res[0].timestamp;
        data.timestampend = res[1].timestamp;

        if (res[2]) {
          data.locationstartmap = res[2];
        }

        if (res[3]) {
          data.locationendmap = res[3];
        }

        this.publisher.publish(`${id}.update`, data);
      });

      return;
    }
  }
}
