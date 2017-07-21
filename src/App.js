import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightGreen800, deepOrangeA400} from 'material-ui/styles/colors';

import TripList from './TripList';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import PubSubPublisher from './PubSubPublisher';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: lightGreen800,
    accent1Color: deepOrangeA400,
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.psp = new PubSubPublisher(`ui.app.main`);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppBar
            title="more travels"
            iconElementLeft={
              <IconMenu
                iconButtonElement={<IconButton iconStyle={{color: '#ffffff'}}><NavigationMenu /></IconButton>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
              >
                <MenuItem primaryText="Configuration" onTouchTap={() => {this.psp.publish('showConfig', {})}}/>
              </IconMenu>
            }
          />
        <TripList id='1'/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
