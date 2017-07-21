import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class AppLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'showConfig': this.showConfig.bind(this),
    }, 'ui.app');
    this.handler.subscribe();
    this.publisher = new PubSubPublisher('ui.app');
  }

  showConfig(realm, type, id, action, data) {
    this.nav.goToConfiguration();
  }
}
