import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import LoggerConsole from './LoggerConsole';
import TripListLogic from './TripListLogic';
import TripListEntryLogic from './TripListEntryLogic';

new LoggerConsole();
new TripListLogic();
new TripListEntryLogic();

injectTapEventPlugin();
ReactDOM.render(
  <Router>
    <App/>
  </Router>, document.getElementById('root')
);
registerServiceWorker();
