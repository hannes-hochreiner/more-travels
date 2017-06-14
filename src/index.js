import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';
import TripPage from './TripPage';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import Navigator from './Navigator';
import LoggerConsole from './LoggerConsole';
import TripListLogic from './TripListLogic';
import TripListEntryLogic from './TripListEntryLogic';
import TripPageLogic from './TripPageLogic';
import StageListLogic from './StageListLogic';
import StageListEntryLogic from './StageListEntryLogic';
import TripViewLogic from './TripViewLogic';
import TripEditLogic from './TripEditLogic';

let nav = new Navigator();
new LoggerConsole();
new TripListLogic();
new TripListEntryLogic(nav);
new TripPageLogic(nav);
new StageListLogic();
new StageListEntryLogic();
new TripViewLogic(nav);
new TripEditLogic(nav);

injectTapEventPlugin();
ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/trip/:tripid" component={TripPage}/>
    </div>
  </Router>, document.getElementById('root')
);
registerServiceWorker();
