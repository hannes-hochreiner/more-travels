import { HashRouter as Router } from 'react-router-dom';

export default class Navigator {
  goToTrip(id) {
    (new Router()).history.push(`/trip/${id}`);
  }

  goToTripList() {
    (new Router()).history.push(`/`);
  }
}
