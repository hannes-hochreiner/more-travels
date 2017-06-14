import PubSub from 'pubsub-js';

export default class TripListEntryLogic {
  constructor(nav) {
    this.nav = nav;
    this.objs = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
    PubSub.subscribe('ui.triplistentry', this.handle.bind(this));
  }

  handle(topic, data) {
    let [, , id, action] = topic.split('.');

    if (action === 'didMount') {
      data.obj = this.objs[id];

      PubSub.publish(`ui.triplistentry.${id}.update`, data);
    } else if (action === 'open') {
      this.nav.goToTrip(id);
    }
  }
}
