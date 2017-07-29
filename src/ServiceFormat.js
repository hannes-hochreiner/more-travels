import PubSub from 'pubsub-js';
import { oneShot as psos } from './PubSubOneShot';

export default class ServiceFormat {
  constructor() {
    PubSub.subscribe('service.format.timestampFull.request', this.timestampFull.bind(this));
  }

  timestampFull(topic, data) {
    let baseTopic = 'service.format.timestampFull';
    let id = topic.split('.')[4];

    psos(
      `service.timezone.convertDateTime`,
      {dateTime: data.timestamp.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.timestamp.timezone}
    ).then(res => {
      PubSub.publish(`${baseTopic}.response.${id}`, {
        timestamp: `${res.dateTime} (${data.timestamp.timezone})`
      });
    }).catch(error => {
      PubSub.publish(`${baseTopic}.error.${id}`, error);
    });
  }
}
