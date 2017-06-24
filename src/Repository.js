export default class Repository {
  constructor() {
    this.objs = [
      { id: '1', type: 'trip', title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      { id: '2', type: 'trip', title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      { id: '3', type: 'trip', title: 'test3', start: '2017-03-01', end: '2017-03-05' },
      { id: 'p1', parent: '2', type: 'place', title: 'place1'},
      { id: 'p2', parent: '2', type: 'place', title: 'place2'},
      { id: 'p3', parent: '2', type: 'place', title: 'place3'},
      { id: 'p4', parent: '2', type: 'place', title: 'place4'},
      { id: 't1', parent: '2', type: 'travel', title: 'travel2-3'},
      { id: 't2', parent: '2', type: 'travel', title: 'travel3-4'},
    ];
  }

  getAllTrips() {
    return this.objs.filter(obj => obj.type === 'trip');
  }

  getTripById(id) {
    return this._getObjById(id);
  }

  getStagesByTripId(tripId) {
    return this.objs.filter(obj => obj.parent === tripId && (obj.type === 'place' || obj.type === 'travel'));
  }

  getStageById(id) {
    return this._getObjById(id);
  }

  _getObjById(id) {
    return this.objs.filter(obj => obj.id === id)[0];
  }
}
