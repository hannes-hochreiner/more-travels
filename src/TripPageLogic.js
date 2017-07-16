import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import uuid from 'uuid';

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
    data.editMode = false;

    this.repo.getTripById(id).catch(err => {
      data.editMode = true;

      return this.repo.createNewTrip(id);
    }).then(trip => {
      data.obj = trip;

      this.viewHandler = new PubSubHandler({
        'edit': this.edit.bind(this),
        'close': this.close.bind(this),
        'addStage': this.addStage.bind(this),
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

  addStage(realm, type, id, action, data) {
    this.nav.goToStage(id, uuid());
  }
}
