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
    this.repo.getStageById(id).catch(err => {
      return null;
    }).then(trip => {
      data.editMode = false;
      data.obj = trip;

      if (!data.obj) {
        let d = new Date();

        data.editMode = true;
        data.obj = {
          _id: id,
          type: 'stage',
          subtype: 'stay',
          title: 'new ',
          start: '2017-01-01T12:00:00',
          end: '2017-01-05T12:00:00'
        };
      }

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
    this.nav.goToTripList();
  }

  edit(realm, type, id, action, data) {
    this.repo.getStageById(id).then(trip => {
      data.obj = trip;
      data.editMode = true;

      this.publisher.publish(`${id}.update`, data);
    });
  }

  view(realm, type, id, action, data) {
    this.repo.getStageById(id).then(trip => {
      data.obj = trip;
      data.editMode = false;

      this.publisher.publish(`${id}.update`, data);
    });
  }
}
