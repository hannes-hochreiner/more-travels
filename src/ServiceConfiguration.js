import PubSub from 'pubsub-js';

export default class ServiceConfiguration {
  constructor(repo) {
    this.repo = repo;

    PubSub.subscribe('service.configuration.getMapboxAuthToken.request', this.getMapboxAuthToken.bind(this));
  }

  getMapboxAuthToken(topic, data) {
    let baseTopic = 'service.configuration.getMapboxAuthToken';
    let id = topic.split('.')[4];

    this.repo.getMapboxConf().then(res => {
      PubSub.publish(
        `${baseTopic}.response.${id}`,
        { mapboxAuthToken: res.authKey }
      );
    }).catch(error => {
      PubSub.publish(
        `${baseTopic}.error.${id}`,
        error
      );
    });
  }
}
