import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import LoggerConsole from './LoggerConsole';
import ListLogic from './ListLogic';
import ListEntryLogic from './ListEntryLogic';

new LoggerConsole();
new ListLogic();
new ListEntryLogic();

ReactDOM.render(
  <Router>
    <App/>
  </Router>, document.getElementById('root')
);
registerServiceWorker();
