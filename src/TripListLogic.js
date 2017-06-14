import PubSub from 'pubsub-js';

export default class TripListLogic {
  constructor() {
    PubSub.subscribe('ui.triplist', this.handle.bind(this));
  }

  handle(topic, data) {
    let [, , id, action] = topic.split('.');

    if (action === 'didMount') {
      PubSub.publish(`ui.triplist.${id}.update`, {
        trips: [
          { id: 1 },
          { id: 2 },
          { id: 3 }
        ]
      });
    }
  }
}
