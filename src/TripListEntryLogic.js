import PubSub from 'pubsub-js';
import { HashRouter as Router } from 'react-router-dom';

export default class TripListEntryLogic {
  constructor() {
    this.objs = {
      1: { id: 1, title: 'test1' },
      2: { id: 2, title: 'test2' },
      3: { id: 3, title: 'test3' }
    };
    PubSub.subscribe('ui.triplistentry', this.handle.bind(this));
  }

  handle(topic, data) {
    let [realm, type, id, action] = topic.split('.');

    if (action === 'didMount') {
      data.obj = this.objs[id];

      PubSub.publish(`ui.triplistentry.${id}.update`, data);
    } else if (action === 'open') {
      (new Router()).history.push('/trip');
    }
  }
}
