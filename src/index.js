import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';
import TripPage from './TripPage';
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
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/trip" component={TripPage}/>
    </div>
  </Router>, document.getElementById('root')
);
registerServiceWorker();
