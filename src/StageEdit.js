import React, {Component} from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import ActionDateRange from 'material-ui/svg-icons/action/date-range';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';

import DateTimeEdit from './DateTimeEdit';
import LocationEdit from './LocationEdit';

export default class StageEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.stageid,
      obj: this.props.stage
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.stageedit.${this.state.id}`);
    this.publisher = new PubSubPublisher(`ui.stageedit.${this.state.id}`);
  }

  componentDidMount() {
    this.handler.subscribe();
    this.publisher.publish('init', this.state);
  }

  componentWillUnmount() {
    this.handler.unsubscribe();
  }

  update(realm, type, id, action, data) {
    if (action === 'update') {
      this.setState(data);
    }
  }

  changeHandler(picker, event, data) {
    if (picker === 'start') {
      this.setState({dateStart: data});
    } else if (picker === 'end') {
      this.setState({dateEnd: data});
    }
  }

  editTitleStart() {
    this.publisher.publish('editTitleStart', this.state);
  }

  editTitleEnd() {
    this.publisher.publish('editTitleEnd', this.state);
  }

  editStartDateStart() {
    this.publisher.publish('editStartDateStart', this.state);
  }

  editEndDateStart() {
    this.publisher.publish('editEndDateStart', this.state);
  }

  editStartLocationStart() {
    this.publisher.publish('editStartLocationStart', this.state);
  }

  editEndLocationStart() {
    this.publisher.publish('editEndLocationStart', this.state);
  }

  editLocationEnd(title, longitude, latitude, zoom) {
    this.publisher.publish('editLocationEnd', {
      state: this.state,
      title: title,
      longitude: longitude,
      latitude: latitude,
      zoom: zoom
    });
  }

  editDateEnd(date, timezone) {
    let newDte = JSON.parse(JSON.stringify(this.state.dte));

    newDte.date = date;
    newDte.timezone = timezone;

    this.setState({dte: newDte});
    this.publisher.publish('editDateEnd', this.state);
  }

  render() {
    if (!this.state.init) {
      return <LinearProgress mode="indeterminate" />;
    }

    let dte = '';

    if (this.state.dte) {
      dte = <DateTimeEdit
        id={`${this.state.id}dte`}
        onEditEnd={this.editDateEnd.bind(this)}
        timezone={this.state.dte.timezone}
        date={this.state.dte.date}
      />;
    }

    let le = '';

    if (this.state.le) {
      le = <LocationEdit
        id={`${this.state.id}le`}
        onEditEnd={this.editLocationEnd.bind(this)}
        title={this.state.le.title}
        latitude={this.state.le.latitude}
        longitude={this.state.le.longitude}
        zoom={this.state.le.zoom}
      />;
    }

    return (
      <div>
        <AppBar
          iconElementLeft={<IconButton><NavigationClose/></IconButton>}
          iconElementRight={<FlatButton label='save' onTouchTap={this.publisher.publish.bind(this.publisher, 'save', this.state)}/>}
          onLeftIconButtonTouchTap={this.publisher.publish.bind(this.publisher, 'close', this.state)}
        />
        <List>
          <ListItem
            primaryText={this.state.obj.title}
            insetChildren={true}
            onTouchTap={this.editTitleStart.bind(this)}
          />
          <ListItem
            primaryText={`from: ${this.state.timestampstart}`}
            leftIcon={<ActionDateRange />}
            onTouchTap={this.editStartDateStart.bind(this)}
          />
          <ListItem
            primaryText={`to: ${this.state.timestampend}`}
            leftIcon={<ActionDateRange />}
            onTouchTap={this.editEndDateStart.bind(this)}
          />
          <ListItem
            primaryText={`from: ${this.state.locationstart}`}
            leftIcon={<MapsPlace />}
            onTouchTap={this.editStartLocationStart.bind(this)}
          />
          <ListItem
            primaryText={`to: ${this.state.locationend}`}
            leftIcon={<MapsPlace />}
            onTouchTap={this.editEndLocationStart.bind(this)}
          />
        </List>
        {dte}
        {le}
        <Dialog
          title="Title"
          actions={[<FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.editTitleEnd.bind(this)}
          />]}
          modal={false}
          open={this.state.editTitle}
          onRequestClose={this.editTitleEnd.bind(this)}
        >
          <TextField onChange={(event, data) => this.setState({title: data})} value={this.state.title}/>
        </Dialog>
      </div>
    );
  }
}
