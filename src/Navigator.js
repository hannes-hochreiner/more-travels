import { HashRouter as Router } from 'react-router-dom';

export default class Navigator {
  goToTrip(tripid) {
    (new Router()).history.push(`/trips/${tripid}`);
  }

  goToStage(tripid, stageid) {
    (new Router()).history.push(`/trips/${tripid}/stages/${stageid}`);
  }

  goToTripList() {
    (new Router()).history.push(`/`);
  }

  goToConfiguration() {
    (new Router()).history.push(`/conf`);
  }
}
