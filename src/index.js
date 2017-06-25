import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PouchDb from 'pouchdb';

import App from './App';
import TripPage from './TripPage';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import Navigator from './Navigator';
import RepositoryMock from './RepositoryMock';
import LoggerConsole from './LoggerConsole';
import TripListLogic from './TripListLogic';
import TripListEntryLogic from './TripListEntryLogic';
import TripPageLogic from './TripPageLogic';
import StageListLogic from './StageListLogic';
import StageListEntryLogic from './StageListEntryLogic';
import TripViewLogic from './TripViewLogic';
import TripEditLogic from './TripEditLogic';
import RepositoryPouchDb from './RepositoryPouchDb';

let nav = new Navigator();
let repo = new RepositoryPouchDb(PouchDb);
new LoggerConsole();
new TripListLogic(nav, repo);
new TripListEntryLogic(nav, repo);
new TripPageLogic(nav, repo);
new StageListLogic(repo);
new StageListEntryLogic(nav, repo);
new TripViewLogic(nav, repo);
new TripEditLogic(nav, repo);

injectTapEventPlugin();
ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/trips/:tripid" component={TripPage}/>
    </div>
  </Router>, document.getElementById('root')
);
registerServiceWorker();
