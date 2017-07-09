export default class RepositoryPouchDb {
  constructor(PouchDb) {
    this.pouch = new PouchDb('more-travels_data');
  }

  getAllTrips() {
    return this.pouch.allDocs({
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
    return this.pouch.allDocs({
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

  updateObject(obj) {
    return this.pouch.put(obj);
  }

  _getObjById(id) {
    return this.pouch.get(id);
  }
}
