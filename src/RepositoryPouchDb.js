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
    }).then(res => res.rows.map(entry => entry.doc));
  }

  createNewTrip(id) {
    return new Promise((resolve, reject) => {
      resolve({
        _id: `trips/${id}`,
        id: id,
        title: 'new trip',
        start: '2017-01-01',
        end: '2017-01-02'
      });
    });
  }

  getTripById(id) {
    return this._getObjById(`trips/${id}`);
  }

  getStagesByTripId(tripId) {
    return this.pd.allDocs({
      startkey: `stages/${tripId}/`,
      endkey: `stages/${tripId}/\uffff`,
      include_docs: true
    }).then(res => {
      return res.rows.map(entry => entry.doc);
    });
  }

  getStageByTripIdId(tripId, id) {
    return this._getObjById(`stages/${tripId}/${id}`);
  }

  createNewStage(tripId, id) {
    return new Promise((resolve, reject) => {
      resolve({
        _id: `stages/${tripId}/${id}`,
        stageid: id,
        tripid: tripId,
        type: 'stage',
        subtype: 'stay',
        title: 'new stay',
        timestampstart: {datetime: '2017-01-01 12:00', timezone: 'Europe/Berlin'},
        timestampend: {datetime: '2017-01-05 12:00', timezone: 'Europe/Berlin'}
      });
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
