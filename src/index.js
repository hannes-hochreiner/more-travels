import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import LoggerConsole from './LoggerConsole';
import ListLogic from './ListLogic';
import ListEntryLogic from './ListEntryLogic';

new LoggerConsole();
new ListLogic();
new ListEntryLogic();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
