import {default as PubSub} from 'pubsub-js';

export default class LoggerConsole {
  constructor() {
    PubSub.subscribe('ui', (topic, data) => {
      console.log({
        'topic': topic,
        'data': data
      });
    });
    PubSub.subscribe('service', (topic, data) => {
      console.log({
        'topic': topic,
        'data': data
      });
    });
  }
}
