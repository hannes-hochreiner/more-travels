import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {lightGreen800, deepOrangeA400} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionDateRange from 'material-ui/svg-icons/action/date-range';
import AppBar from 'material-ui/AppBar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import StageList from './StageList';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: lightGreen800,
    accent1Color: deepOrangeA400,
  }
});

export default class TripPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      datesEditDialog: false,
      id: props.match.params.tripid
    };

    PubSub.subscribe(`ui.trippage.${this.state.id}`, this.handle.bind(this));
  }

  componentDidMount() {
    PubSub.publish(`ui.trippage.${this.state.id}.didMount`, this.state);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.trippage.${this.state.id}`);
  }

  handle(topic, data) {
    let [, , , action] = topic.split('.');

    if (action === 'update') {
      this.setState(data);
    }
  }

  editDatesEnd() {
    PubSub.publish(`ui.trippage.${this.state.id}.editDatesEnd`, this.state);
  }

  editDatesStart() {
    PubSub.publish(`ui.trippage.${this.state.id}.editDatesStart`, this.state);
  }

  editDatesChange(type, event, date) {
    if (type === 'start') {
      this.setState({dateStart: date});
    } else if (type === 'end') {
      this.setState({dateEnd: date});
    }
  }

  render() {
    if (!this.state.obj) {
      return (
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className="TripPage">
            <AppBar
              title="...loading..."
            />
            <LinearProgress mode="indeterminate" />
          </div>
        </MuiThemeProvider>
      );
    }

    const viewAppBar = <AppBar
      title={this.state.obj.title}
      iconElementLeft={<IconButton><NavigationClose/></IconButton>}
      iconElementRight={
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText="edit" onTouchTap={PubSub.publish.bind(null, `ui.trippage.${this.state.id}.edit`, this.state)}/>
          <MenuItem primaryText="delete" />
        </IconMenu>
      }
      onLeftIconButtonTouchTap={PubSub.publish.bind(null, `ui.trippage.${this.state.id}.close`, this.state)}
    />;

    const editAppBar = <AppBar
      iconElementLeft={<IconButton><NavigationClose/></IconButton>}
      iconElementRight={<FlatButton label='save' onTouchTap={PubSub.publish.bind(null, `ui.trippage.${this.state.id}.save`, this.state)}/>}
      onLeftIconButtonTouchTap={PubSub.publish.bind(null, `ui.trippage.${this.state.id}.close`, this.state)}
    />;

    let appbar = viewAppBar;

    if (this.state.editMode) {
      appbar = editAppBar;
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="TripPage">
          {appbar}
          <List>
            <ListItem
              disabled={!this.state.editMode}
              primaryText={`${this.state.obj.start} - ${this.state.obj.end}`}
              leftIcon={<ActionDateRange />}
              onTouchTap={this.editDatesStart.bind(this)}
            />
          </List>
          <Dialog
            title="Trip dates"
            actions={[<FlatButton
              label="Ok"
              primary={true}
              keyboardFocused={true}
              onTouchTap={this.editDatesEnd.bind(this)}
            />]}
            modal={false}
            open={this.state.editDates}
            onRequestClose={this.editDatesEnd.bind(this)}
          >
            <DatePicker onChange={this.editDatesChange.bind(this, 'start')} hintText="start date" autoOk={true} value={this.state.dateStart}/>
            <DatePicker onChange={this.editDatesChange.bind(this, 'end')} hintText="end date" autoOk={true} value={this.state.dateEnd}/>
          </Dialog>
          <Divider />
          <StageList id='1' tripId={this.state.obj.id}/>
        </div>
      </MuiThemeProvider>
    );
  }
}
