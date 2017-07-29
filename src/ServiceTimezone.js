import PubSub from 'pubsub-js';

import tz from 'timezone';
import tzZones from 'timezone/zones';

export default class ServiceTimezone {
  constructor() {
    this.tz = tz(tzZones);
    this.tzones = this._extractZones(tzZones);

    PubSub.subscribe('service.timezone.convertDateTime.request', this.convertDateTime.bind(this));
    PubSub.subscribe('service.timezone.getZones.request', this.getZones.bind(this));
  }

  convertDateTime(topic, data) {
    let baseTopic = 'service.timezone.convertDateTime';
    let id = topic.split('.')[4];

    try {
      let dt = this.tz(this.tz(data.dateTime, data.fromTimezone), '%F %T', data.toTimezone).substr(0, 16);

      PubSub.publish(
        `${baseTopic}.response.${id}`,
        {dateTime: dt}
      );
    } catch (error) {
      PubSub.publish(
        `${baseTopic}.error.${id}`,
        error
      );
    }
  }

  getZones(topic, data) {
    let baseTopic = 'service.timezone.getZones';
    let id = topic.split('.')[4];

    try {
      PubSub.publish(
        `${baseTopic}.response.${id}`,
        {zones: this.tzones}
      );
    } catch (error) {
      PubSub.publish(
        `${baseTopic}.error.${id}`,
        error
      );
    }
  }

  _extractZones(zones, prev) {
    let res = prev || [];

    return zones.reduce((curr, next) => {
      if (Array.isArray(next)) {
        return curr.concat(this._extractZones(next));
      }

      if (next.zones) {
        for (let key in next.zones) {
          curr.push(key);
        }
      }

      return curr;
    }, res);
  }
}
