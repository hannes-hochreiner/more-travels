import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';
import { oneShot as psos } from './PubSubOneShot';

export default class StageEditLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.handler = new PubSubHandler({
      'init': this.init.bind(this),
      'editStartDateStart': this.editStartDateStart.bind(this),
      'editEndDateStart': this.editEndDateStart.bind(this),
      'editDateEnd': this.editDateEnd.bind(this),
      'editTitleStart': this.editTitleStart.bind(this),
      'editTitleEnd': this.editTitleEnd.bind(this),
      'save': this.save.bind(this),
      'editStartLocationStart': this.editStartLocationStart.bind(this),
      'editEndLocationStart': this.editEndLocationStart.bind(this),
      'editLocationEnd': this.editLocationEnd.bind(this),
    }, 'ui.stageedit');
    this.publisher = new PubSubPublisher('ui.stageedit');
    this.handler.subscribe();
  }

  init(realm, type, id, action, data) {
    if (data.obj) {
      Promise.all([
        psos(
          `service.timezone.${id}start.convertDateTime`,
          {dateTime: data.obj.timestampstart.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.obj.timestampstart.timezone},
          `service.timezone.${id}start.convertedDateTime`
        ),
        psos(
          `service.timezone.${id}end.convertDateTime`,
          {dateTime: data.obj.timestampend.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.obj.timestampend.timezone},
          `service.timezone.${id}end.convertedDateTime`
        ),
      ]).then(res => {
        let state = {
          init: true,
          timestampstart: `${res[0].dateTime} (${data.obj.timestampstart.timezone})`,
          timestampend: `${res[1].dateTime} (${data.obj.timestampend.timezone})`,
        };

        if (data.obj.locationstart) {
          state.locationstart = data.obj.locationstart.title;
        } else {
          state.locationstart = '';
        }

        if (data.obj.locationend) {
          state.locationend = data.obj.locationend.title;
        } else {
          state.locationend = '';
        }

        this.publisher.publish(`${id}.update`, state);
      });

      return;
    }
  }

  editStartDateStart(realm, type, id, action, data) {
    data.dte = {
      date: data.obj.timestampstart.datetime,
      timezone: data.obj.timestampstart.timezone,
      type: 'start'
    }

    this.publisher.publish(`${id}.update`, data);
  }

  editEndDateStart(realm, type, id, action, data) {
    data.dte = {
      date: data.obj.timestampend.datetime,
      timezone: data.obj.timestampend.timezone,
      type: 'end'
    }

    this.publisher.publish(`${id}.update`, data);
  }

  editDateEnd(realm, type, id, action, data) {
    if (data.dte.type === 'start') {
      data.obj.timestampstart.datetime = data.dte.date;
      data.obj.timestampstart.timezone = data.dte.timezone;
    } else if (data.dte.type === 'end') {
      data.obj.timestampend.datetime = data.dte.date;
      data.obj.timestampend.timezone = data.dte.timezone;
    }

    delete data.dte;

    Promise.all([
      psos(
        `service.timezone.${id}start.convertDateTime`,
        {dateTime: data.obj.timestampstart.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.obj.timestampstart.timezone},
        `service.timezone.${id}start.convertedDateTime`
      ),
      psos(
        `service.timezone.${id}end.convertDateTime`,
        {dateTime: data.obj.timestampend.datetime, fromTimezone: 'Etc/UTC', toTimezone: data.obj.timestampend.timezone},
        `service.timezone.${id}end.convertedDateTime`
      ),
    ]).then(res => {
      this.publisher.publish(`${id}.update`, {
        timestampstart: `${res[0].dateTime} (${data.obj.timestampstart.timezone})`,
        timestampend: `${res[1].dateTime} (${data.obj.timestampend.timezone})`,
      });
    });
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

  editStartLocationStart(realm, type, id, action, data) {
    let le = {
      title: '',
      latitude: 0,
      longitude: 0,
      zoom: 0,
    };

    if (data.obj.locationstart) {
      le = data.obj.locationstart;
    }

    le.type = 'start';
    data.le = le;
    this.publisher.publish(`${id}.update`, data);
  }

  editEndLocationStart(realm, type, id, action, data) {
    let le = {
      title: '',
      latitude: 0,
      longitude: 0,
      zoom: 0,
    };

    if (data.obj.locationend) {
      le = data.obj.locationend;
    }

    le.type = 'end';
    data.le = le;
    this.publisher.publish(`${id}.update`, data);
  }

  editLocationEnd(realm, type, id, action, data) {
    let loc = {
      title: data.title,
      longitude: data.longitude,
      latitude: data.latitude,
      zoom: data.zoom
    };

    if (data.state.le.type === 'start') {
      data.state.obj.locationstart = loc;
    } else if (data.state.le.type === 'end') {
      data.state.obj.locationend = loc;
    }

    if (data.state.obj.locationstart) {
      data.state.locationstart = data.state.obj.locationstart.title;
    } else {
      data.state.locationstart = '';
    }

    if (data.state.obj.locationend) {
      data.state.locationend = data.state.obj.locationend.title;
    } else {
      data.state.locationend = '';
    }

    delete data.state.le;

    this.publisher.publish(`${id}.update`, data.state);
  }
}
