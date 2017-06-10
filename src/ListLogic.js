import PubSub from 'pubsub-js';

export default class ListLogic {
  constructor() {
    PubSub.subscribe('ui.list.didMount', this.didMount);
  }

  didMount(topic, data) {
    PubSub.publish('ui.list.update', {
      list: [
        { id: 1, title: 'test1' },
        { id: 2, title: 'test2' },
        { id: 3, title: 'test3' }
      ]
    });
  }
}
