import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightGreen800, deepOrangeA400} from 'material-ui/styles/colors';

import AppBar from 'material-ui/AppBar';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: lightGreen800,
    accent1Color: deepOrangeA400,
  }
});

export default class TripPage extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="TripPage">
          <AppBar
            title="Trip"
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
