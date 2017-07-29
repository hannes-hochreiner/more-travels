import PubSub from 'pubsub-js';
import { oneShot as psos } from './PubSubOneShot';
import axios from 'axios';

export default class ServiceMap {
  constructor() {
    PubSub.subscribe('service.map.getLocation.request', this.getLocation.bind(this));
  }

  getLocation(topic, data) {
    let baseTopic = 'service.map.getLocation';
    let id = topic.split('.')[4];

    psos('service.configuration.getMapboxAuthToken').then(res => {
      return axios({
        method: 'get',
        url: `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${data.longitude},${data.latitude},${data.zoom}/600x600?access_token=${res.mapboxAuthToken}`,
        responseType: 'blob'
      });
    }).then(resp => {
      PubSub.publish(
        `${baseTopic}.response.${id}`,
        { map: resp.data }
      );
    }).catch(error => {
      PubSub.publish(
        `${baseTopic}.error.${id}`,
        error
      );
    });
  }
}
