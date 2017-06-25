import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class TripEditLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'editDatesStart': this.editDatesStart.bind(this),
      'editDatesEnd': this.editDatesEnd.bind(this),
      'editTitleStart': this.editTitleStart.bind(this),
      'editTitleEnd': this.editTitleEnd.bind(this),
      'save': this.save.bind(this),
    }, 'ui.tripedit');
    this.publisher = new PubSubPublisher('ui.tripedit');
    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    if (data.obj) {
      data.init = true;
      this.publisher.publish(`${id}.update`, data);
      return;
    }

    this.repo.getTripById(id).then(trip => {
      data.obj = trip;
      data.init = true;
      this.publisher.publish(`${id}.update`, data);
    });
  }

  editDatesStart(realm, type, id, action, data) {
    data.editDates = true;
    data.dateStart = new Date(data.obj.start);
    data.dateEnd = new Date(data.obj.end);

    this.publisher.publish(`${id}.update`, data);
  }

  editDatesEnd(realm, type, id, action, data) {
    data.obj.start = data.dateStart.toLocaleFormat('%Y-%m-%d');
    data.obj.end = data.dateEnd.toLocaleFormat('%Y-%m-%d');
    data.editDates = false;

    this.publisher.publish(`${id}.update`, data);
  }

  editTitleStart(realm, type, id, action, data) {
    data.editTitle = true;
    data.title = data.obj.title;

    this.publisher.publish(`${id}.update`, data);
  }

  editTitleEnd(realm, type, id, action, data) {
    data.obj.title = data.title;
    data.editTitle = false;

    this.publisher.publish(`${id}.update`, data);
  }

  save(realm, type, id, action, data) {
    this.repo.updateObject(data.obj).then(() => {
      this.publisher.publish(`${id}.view`, data);
    });
  }
}
