export default class RepositoryPouchDb {
  constructor(PouchDb) {
    this.pouch = new PouchDb('more-travels_data');
    this.id_min = '00000000-0000-0000-0000-000000000000';
    this.id_max = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
  }

  getAllTrips() {
    return this.pouch.allDocs({
      startkey: `trips/${this.id_min}`,
      endkey: `trips/${this.id_max}`,
      include_docs: true
    }).then(res => res.rows.map(entry => entry.doc));
  }

  getTripById(id) {
    return this._getObjById(id);
  }

  getStagesByTripId(tripId) {
    return this.pouch.allDocs({
      startkey: `${tripId}/stages/${this.id_min}`,
      endkey: `${tripId}/stages/${this.id_max}`,
      include_docs: true
    }).then(res => {
      return res.rows.map(entry => entry.doc);
    });
  }

  getStageById(id) {
    return this._getObjById(id);
  }

  updateObject(obj) {
    return this.pouch.put(obj);
  }

  _getObjById(id) {
    return this.pouch.get(id);
  }
}
