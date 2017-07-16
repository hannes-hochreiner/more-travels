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
          `service.timezone.${id}start.convertDateTime`,
          {dateTime: data.obj.timestampstart.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.obj.timestampstart.timezone},
          `service.timezone.${id}start.convertedDateTime`
        ),
        psos(
          `service.timezone.${id}end.convertDateTime`,
          {dateTime: data.obj.timestampend.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.obj.timestampend.timezone},
          `service.timezone.${id}end.convertedDateTime`
        ),
      ]).then(res => {
        this.publisher.publish(`${id}.update`, {
          init: true,
          timestampstart: `${res[0].dateTime} (${data.obj.timestampstart.timezone})`,
          timestampend: `${res[1].dateTime} (${data.obj.timestampend.timezone})`,
        });
      });

      return;
    }
  }
}
