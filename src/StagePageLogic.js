import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class StagePageLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'close': this.close.bind(this),
      'edit': this.edit.bind(this),
      'view': this.view.bind(this),
    }, 'ui.stagepage');
    this.publisher = new PubSubPublisher('ui.stagepage');
    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    data.editMode = false;
    this.repo.getStageByTripIdId(data.tripid, data.stageid).catch(err => {
      data.editMode = true;

      return this.repo.createNewStage(data.tripid, data.stageid);
    }).then(stage => {
      data.obj = stage;

      this.viewHandler = new PubSubHandler({
        'edit': this.edit.bind(this),
        'close': this.close.bind(this),
      }, `ui.stageview.${id}`);
      this.viewHandler.subscribe();

      this.editHandler = new PubSubHandler({
        'view': this.view.bind(this),
        'close': this.close.bind(this)
      }, `ui.stageedit.${id}`);
      this.editHandler.subscribe();

      data.init = true;
      this.publisher.publish(`${id}.update`, data);
    });
  }

  close(realm, type, id, action, data) {
    this.nav.goToTrip(data.obj.tripid);
  }

  edit(realm, type, id, action, data) {
    this.repo.getStageByTripIdId(data.tripid, data.stageid).then(stage => {
      data.obj = stage;
      data.editMode = true;

      this.publisher.publish(`${id}.update`, data);
    });
  }

  view(realm, type, id, action, data) {
    this.repo.getStageByTripIdId(data.obj.tripid, data.obj.stageid).then(stage => {
      data.obj = stage;
      data.editMode = false;

      this.publisher.publish(`${id}.update`, data);
    });
  }
}
