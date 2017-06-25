import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripPageLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'close': this.close.bind(this),
      'edit': this.edit.bind(this),
      'view': this.view.bind(this),
    }, 'ui.trippage');
    this.publisher = new PubSubPublisher('ui.trippage');
    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    this.repo.getTripById(id).then(trip => {
      data.editMode = false;
      data.obj = trip;

      if (!data.obj) {
        let d = new Date();

        data.editMode = true;
        data.obj = {
          id: id,
          type: 'trip',
          title: 'new trip',
          start: '2017-01-01',
          end: '2017-01-05'
        };
      }

      this.viewHandler = new PubSubHandler({
        'edit': this.edit.bind(this),
        'close': this.close.bind(this)
      }, `ui.tripview.${id}`);
      this.viewHandler.subscribe();

      this.editHandler = new PubSubHandler({
        'view': this.view.bind(this),
        'close': this.close.bind(this)
      }, `ui.tripedit.${id}`);
      this.editHandler.subscribe();

      data.init = true;
      this.publisher.publish(`${id}.update`, data);
    });
  }

  close(realm, type, id, action, data) {
    this.nav.goToTripList();
  }

  edit(realm, type, id, action, data) {
    this.repo.getTripById(id).then(trip => {
      data.obj = trip;
      data.editMode = true;

      this.publisher.publish(`${id}.update`, data);
    });
  }

  view(realm, type, id, action, data) {
    this.repo.getTripById(id).then(trip => {
      data.obj = trip;
      data.editMode = false;

      this.publisher.publish(`${id}.update`, data);
    });
  }
}
