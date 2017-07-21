import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import { oneShot as psos } from './PubSubOneShot';
import uuid from 'uuid';
import axios from 'axios';

export default class ServiceMap {
  constructor() {
    this.psh = new PubSubHandler({
      'locationRequest': this.locationRequest.bind(this),
    }, 'service.map');
    this.psp = new PubSubPublisher('service.map');
    this.psh.subscribe();
  }

  locationRequest(realm, type, id, action, data) {
    let confReqId = uuid();

    psos(
      `service.configuration.${confReqId}.getMapboxAuthToken`,
      {},
      `service.configuration.${confReqId}.mapboxAuthToken`
    ).then(res => {
      return axios({
        method: 'get',
        url: `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${data.longitude},${data.latitude},${data.zoom}/600x600?access_token=${res.mapboxAuthToken}`,
        responseType: 'blob'
      });
    }).then(res => {
      this.psp.publish(`${id}.locationResponse`, {
        map: res.data
      });
    });
  }
}
