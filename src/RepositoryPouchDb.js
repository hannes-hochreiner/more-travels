export default class RepositoryPouchDb {
  constructor(PouchDb) {
    this.pd = new PouchDb('more-travels_data');
    this.pc = new PouchDb('more-travels_conf');
  }

  getAllTrips() {
    return this.pd.allDocs({
      startkey: `trips/`,
      endkey: `trips/\uffff`,
      include_docs: true
    }).then(res => res.rows.map(entry => {
      let obj = entry.doc;

      this._addAdditionalKeys(obj, this._getTripAdditionalKeys());
      return obj;
    }));
  }

  createNewTrip(id) {
    return new Promise((resolve, reject) => {
      let newTrip = {
        _id: `trips/${id}`,
        id: id,
      };

      this._addAdditionalKeys(newTrip, this._getTripAdditionalKeys());
      resolve(newTrip);
    });
  }

  getTripById(id) {
    return this._getObjById(`trips/${id}`).then(obj => {
      this._addAdditionalKeys(obj, this._getTripAdditionalKeys());

      return obj;
    });
  }

  _getTripAdditionalKeys() {
    return {
      title: 'new trip',
      start: '2017-01-01',
      end: '2017-01-02',
    };
  }

  getStagesByTripId(tripId) {
    return this.pd.allDocs({
      startkey: `stages/${tripId}/`,
      endkey: `stages/${tripId}/\uffff`,
      include_docs: true
    }).then(res => {
      return res.rows.map(entry => {
        let obj = entry.doc;

        this._addAdditionalKeys(obj, this._getStageAdditionalKeys());
        return obj;
      });
    });
  }

  getStageByTripIdId(tripId, id) {
    return this._getObjById(`stages/${tripId}/${id}`).then(obj => {
      this._addAdditionalKeys(obj, this._getStageAdditionalKeys());

      return obj;
    });
  }

  _getLocationAdditionalKeys() {
    return {
      title: 'new location',
      latitude: 0,
      longitude: 0,
      zoom: 0
    };
  }

  _getTimestampAdditionalKeys() {
    return {
      datetime: '2017-01-01 12:00',
      timezone: 'Europe/Berlin'
    };
  }

  _getStageAdditionalKeys() {
    return {
      type: 'stage',
      subtype: 'stay',
      title: 'new stay',
      timestampstart: this._getTimestampAdditionalKeys(),
      timestampend: this._getTimestampAdditionalKeys(),
      locationstart: this._getLocationAdditionalKeys(),
      locationend: this._getLocationAdditionalKeys(),
    };
  }

  _addAdditionalKeys(obj, addKeys) {
    Object.keys(addKeys).forEach(key => {
      if (obj[key]) {
        if (typeof obj[key] === 'object') {
          this._addAdditionalKeys(obj[key], addKeys[key]);
        }
      } else {
        obj[key] = addKeys[key];
      }
    });
  }

  createNewStage(tripId, id) {
    return new Promise((resolve, reject) => {
      let newStage = {
        _id: `stages/${tripId}/${id}`,
        stageid: id,
        tripid: tripId,
      };

      this._addAdditionalKeys(newStage, this._getStageAdditionalKeys());
      resolve(newStage);
    });
  }

  updateObject(obj) {
    return this.pd.put(obj).then(res => {
      obj._rev = res.rev;
    });
  }

  updateAttachmentOnObject(obj, attachmentId, attachmentData, attachmentType) {
    return this.pd.putAttachment(obj._id, attachmentId, obj._rev, attachmentData, attachmentType).then(res => {
      obj._rev = res.rev;
    });
  }

  getAttachmentOnObject(obj, attachmentId) {
    return this.pd.getAttachment(obj._id, attachmentId, {rev: obj._rev});
  }

  _getObjById(id) {
    return this.pd.get(id);
  }

  getMapboxConf() {
    return this.pc.get('conf/mapbox');
  }

  createMapboxConf() {
    return new Promise((resolve, reject) => {
      resolve({
        _id: 'conf/mapbox',
        authKey: ''
      });
    });
  }

  updateMapboxConf(conf) {
    return this.pc.put(conf);
  }
}
