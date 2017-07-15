import React, {Component} from 'react';

import { oneShot } from './PubSubOneShot';

import LinearProgress from 'material-ui/LinearProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class DateTimeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      timezone: this.props.timezone
    };
  }

  componentDidMount() {
    Promise.all([
      oneShot(
        `service.timezone.${this.props.id}.convertDateTime`,
        {dateTime: this.props.date, fromTimezone: 'Etc/UTC', toTimezone: this.state.timezone},
        `service.timezone.${this.props.id}.convertedDateTime`
      ),
      oneShot(
        `service.timezone.${this.props.id}.getZones`,
        {},
        `service.timezone.${this.props.id}.zones`
      )
    ]).then((resArray) => {
      this.setState({
        init: true,
        timezones: resArray[1].zones,
        equivalentLocalDate: resArray[0].dateTime,
        _dateObj: new Date(resArray[0].dateTime),
        _timeObj: new Date(resArray[0].dateTime),
      });
    });
  }

  componentWillUnmount() {
    delete this.zones;
    delete this.equivalentLocalDate;
  }

  handleTimezoneChange(evnt, idx, val) {
    this.setState({timezone: val});
  }

  handleDateChange(evnt, val) {
    let newDate = new Date(val.getFullYear(), val.getMonth(), val.getDate(), this.state._timeObj.getHours(), this.state._timeObj.getMinutes());

    this.setState({
      _dateObj: newDate,
      _timeObj: newDate,
      equivalentLocalDate: this.dateToEquivalentLocalDateString(newDate)
    })
  }

  handleTimeChange(evnt, val) {
    let newDate = new Date(this.state._dateObj.getFullYear(), this.state._dateObj.getMonth(), this.state._dateObj.getDate(), val.getHours(), val.getMinutes());

    this.setState({
      _timeObj: newDate,
      _dateObj: newDate,
      equivalentLocalDate: this.dateToEquivalentLocalDateString(newDate)
    });
  }

  onEditEnd(evnt, val) {
    oneShot(
      `service.timezone.${this.props.id}.convertDateTime`,
      {dateTime: this.state.equivalentLocalDate, fromTimezone: this.state.timezone, toTimezone: 'Etc/UTC'},
      `service.timezone.${this.props.id}.convertedDateTime`
    ).then(res => {
      if (typeof this.props.onEditEnd === 'function') {
        this.props.onEditEnd(res.dateTime);
      }
    });
  }

  dateToEquivalentLocalDateString(date) {
    let tokens = [
      `${date.getFullYear()}`,
      `${date.getMonth() + 1}`,
      `${date.getDate()}`,
      `${date.getHours()}`,
      `${date.getMinutes()}`
    ].map(t => t.length === 1 ? '0' + t : t);

    return `${tokens[0]}-${tokens[1]}-${tokens[2]} ${tokens[3]}:${tokens[4]}`;
  }

  render() {
    if (!this.state.init) {
      return <LinearProgress mode="indeterminate" />;
    }

    return (
      <div>
        {this.state.equivalentLocalDate}
        <Dialog
          title="Trip dates"
          actions={[<FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.onEditEnd.bind(this)}
          />]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.onEditEnd.bind(this)}
        >
          <DatePicker
            floatingLabelText="date"
            value={this.state._dateObj}
            onChange={this.handleDateChange.bind(this)}
          />
          <TimePicker
            floatingLabelText="time"
            value={this.state._timeObj}
            onChange={this.handleTimeChange.bind(this)}
            format="24hr"
          />
          <SelectField
            floatingLabelText="timezone"
            value={this.state.timezone}
            onChange={this.handleTimezoneChange.bind(this)}
          >
            {this.state.timezones.map(zone => {
              return <MenuItem key={zone} value={zone} primaryText={zone} />;
            })}
          </SelectField>
        </Dialog>
      </div>
    );
  }
}
