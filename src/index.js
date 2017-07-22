import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PouchDb from 'pouchdb';

import App from './App';
import TripPage from './TripPage';
import StagePage from './StagePage';
import ConfPage from './ConfPage';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import AppLogic from './AppLogic';
import Navigator from './Navigator';
import LoggerConsole from './LoggerConsole';
import TripListLogic from './TripListLogic';
import TripListEntryLogic from './TripListEntryLogic';
import TripPageLogic from './TripPageLogic';
import StageListLogic from './StageListLogic';
import StageListEntryLogic from './StageListEntryLogic';
import TripViewLogic from './TripViewLogic';
import TripEditLogic from './TripEditLogic';
import RepositoryPouchDb from './RepositoryPouchDb';
import StagePageLogic from './StagePageLogic';
import StageEditLogic from './StageEditLogic';
import StageViewLogic from './StageViewLogic';
import ServiceTimezone from './ServiceTimezone';
import ServiceFormat from './ServiceFormat';
import ServiceConfiguration from './ServiceConfiguration';
import ConfPageLogic from './ConfPageLogic';
import ServiceMap from './ServiceMap';

let nav = new Navigator();
let repo = new RepositoryPouchDb(PouchDb);
new LoggerConsole();
new AppLogic(nav, repo);
new TripListLogic(nav, repo);
new TripListEntryLogic(nav, repo);
new TripPageLogic(nav, repo);
new StageListLogic(repo);
new StageListEntryLogic(nav, repo);
new TripViewLogic(nav, repo);
new TripEditLogic(nav, repo);
new StagePageLogic(nav, repo);
new StageEditLogic(nav, repo);
new StageViewLogic(nav, repo);
new ServiceTimezone();
new ServiceFormat();
new ServiceConfiguration(repo);
new ConfPageLogic(nav, repo);
new ServiceMap();

injectTapEventPlugin();
ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={App}/>
        <Route exact path="/conf" component={ConfPage}/>
        <Route exact path="/trips/:tripid" component={TripPage}/>
        <Route exact path="/trips/:tripid/stages/:stageid" component={StagePage}/>
      </Switch>
    </div>
  </Router>, document.getElementById('root')
);
registerServiceWorker();
