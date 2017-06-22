import PubSub from 'pubsub-js';

export default class PubSubHandler {
  constructor(funArray, topic) {
    this.funArray = funArray;
    this.topic = topic;
  }

  subscribe() {
    this.pubSubToken = PubSub.subscribe(this.topic, this._handle.bind(this));
  }

  unsubscribe() {
    PubSub.unsubscribe(this.pubSubToken);
    this.pubSubToken = null;
  }

  _handle(topic, data) {
    let [realm, type, id, action] = topic.split('.');

    if (this.funArray[action]) {
      this.funArray[action](realm, type, id, action, data);
    }
  }
}
