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
    data.state.obj = this.repo.getTripById(id);

    this.viewHandler = new PubSubHandler({
      'edit': this.edit.bind(this),
      'close': this.close.bind(this)
    }, `ui.tripview.${id}`);
    this.viewHandler.subscribe();

    this.editHandler = new PubSubHandler({
      'view': this.view.bind(this),
      'close': this.view.bind(this)
    }, `ui.tripedit.${id}`);
    this.editHandler.subscribe();

    this.publisher.publish(`${id}.update`, data.state);
  }

  close(realm, type, id, action, data) {
    this.nav.goToTripList();
  }

  edit(realm, type, id, action, data) {
    data.state.obj = this.repo.getTripById(id);
    data.state.editMode = true;

    this.publisher.publish(`${id}.update`, data.state);
  }

  view(realm, type, id, action, data) {
    data.state.obj = this.repo.getTripById(id);
    data.state.editMode = false;

    this.publisher.publish(`${id}.update`, data.state);
  }
}
