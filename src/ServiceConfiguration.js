import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class ServiceConfiguration {
  constructor(repo) {
    this.repo = repo;
    this.psh = new PubSubHandler({
      'getMapboxAuthToken': this.getMapboxAuthToken.bind(this),
    }, 'service.configuration');
    this.psp = new PubSubPublisher('service.configuration');
    this.psh.subscribe();
  }

  getMapboxAuthToken(realm, type, id, action, data) {
    this.repo.getMapboxConf().then(res => {
      this.psp.publish(`${id}.mapboxAuthToken`, {
        mapboxAuthToken: res.authKey
      });
    });
  }
}
