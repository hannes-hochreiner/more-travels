import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightGreen800, deepOrangeA400} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: lightGreen800,
    accent1Color: deepOrangeA400,
  }
});

export default function MoreTravelsMuiThemeProvider(props) {
  return (<MuiThemeProvider muiTheme={muiTheme}>
      {props.children}
    </MuiThemeProvider>);
}
