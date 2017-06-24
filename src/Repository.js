export default class Repository {
  constructor() {
    this.trips = {
      1: { id: 1, title: 'test1', start: '2017-01-01', end: '2017-01-05' },
      2: { id: 2, title: 'test2', start: '2017-02-01', end: '2017-02-05' },
      3: { id: 3, title: 'test3', start: '2017-03-01', end: '2017-03-05' }
    };
  }

  getAllTrips() {
    return Object.keys(this.trips).map(key => this.trips[key]);
  }

  getTripById(id) {
    return this.trips[id];
  }
}
