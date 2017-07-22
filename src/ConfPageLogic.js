import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

export default class ConvPageLogic {
  constructor(nav, repo) {
    this.nav = nav;
    this.repo = repo;
    this.psh = new PubSubHandler({
      'init': this.init.bind(this),
      'close': this.close.bind(this),
      'editMapBoxAuthKey': this.editMapBoxAuthKey.bind(this),
      'textEditEnd': this.textEditEnd.bind(this),
    }, 'ui.confpage');
    this.psp = new PubSubPublisher('ui.confpage');
    this.psh.subscribe();
  }

  init(realm, type, id, action, data) {
    this.repo.getMapboxConf().catch(err => {
      return this.repo.createMapboxConf();
    }).then(mbconf => {
      data.obj = {
        mapbox: mbconf
      };

      data.init = true;
      this.psp.publish(`${id}.update`, data);
    });
  }

  close(realm, type, id, action, data) {
    this.nav.goToTripList();
  }

  editMapBoxAuthKey(realm, type, id, action, data) {
    data.editText = true;
    data.editTextText = data.obj.mapbox.authKey;
    data.editTextTitle = 'MapBox Auth Key';
    this.psp.publish(`${id}.update`, data);
  }

  textEditEnd(realm, type, id, action, data) {
    data.state.editText = false;

    if (data.state.editTextTitle === 'MapBox Auth Key') {
      data.state.obj.mapbox.authKey = data.text;
    }

    delete data.state.editTextText;
    delete data.state.editTextTitle;

    this.repo.updateMapboxConf(data.state.obj.mapbox).then(() => {
      this.psp.publish(`${id}.update`, data.state);
    });
  }
}
