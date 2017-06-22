import PubSub from 'pubsub-js';

export default class PubSubPublisher {
  constructor(baseTopic) {
    this.baseTopic = baseTopic;
  }

  publish(topicExtension, data) {
    PubSub.publish(`${this.baseTopic}.${topicExtension}`, data);
  }
}
