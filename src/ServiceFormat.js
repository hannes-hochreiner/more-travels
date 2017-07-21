import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import { oneShot as psos } from './PubSubOneShot';
import uuid from 'uuid';

export default class ServiceFormat {
  constructor() {
    this.psh = new PubSubHandler({
      'timestampFull': this.timestampFull.bind(this),
    }, 'service.format');
    this.psp = new PubSubPublisher('service.format');
    this.psh.subscribe();
  }

  timestampFull(realm, type, id, action, data) {
    let tzReqId = uuid();

    psos(
      `service.timezone.${tzReqId}.convertDateTime`,
      {dateTime: data.timestamp.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.timestamp.timezone},
      `service.timezone.${tzReqId}.convertedDateTime`
    ).then(res => {
      this.psp.publish(`${id}.formattedTimestampFull`, {
        timestamp: `${res.dateTime} (${data.timestamp.timezone})`
      });
    });
  }
}
