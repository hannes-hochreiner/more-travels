import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import tz from 'timezone';
import tzZones from 'timezone/zones';

export default class ServiceTimezone {
  constructor() {
    this.psh = new PubSubHandler({
      'convertDateTime': this.convertDateTime.bind(this),
      'getZones': this.getZones.bind(this),
    }, 'service.timezone');
    this.psp = new PubSubPublisher('service.timezone');
    this.psh.subscribe();
    this.tz = tz(tzZones);
    this.tzones = this._extractZones(tzZones);
  }

  convertDateTime(realm, type, id, action, data) {
    let dt = this.tz(this.tz(data.dateTime, data.fromTimezone), '%F %T', data.toTimezone).substr(0, 16);

    this.psp.publish(`${id}.convertedDateTime`, {dateTime: dt});
  }

  getZones(realm, type, id, action, data) {
    this.psp.publish(`${id}.zones`, {zones: this.tzones});
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
