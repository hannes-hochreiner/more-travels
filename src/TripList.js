import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import { List, FloatingActionButton } from 'material-ui';
import LinearProgress from 'material-ui/LinearProgress';
import ContentAdd from 'material-ui/svg-icons/content/add';

import TripListEntry from './TripListEntry';
import DateTimeEdit from './DateTimeEdit';
import FlatButton from 'material-ui/FlatButton';

export default class TripList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      openDialog: false,
      date: (new Date()).toISOString().substr(0,16)
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    },`ui.triplist.${this.state.id}`);
    this.publisher = new PubSubPublisher(`ui.triplist.${this.state.id}`);
  }

  componentDidMount() {
    this.handler.subscribe();
    this.publisher.publish('init', this.state);
  }

  componentWillUnmount() {
    this.handler.unsubscribe();
  }

  update(realm, type, id, action, data) {
    this.setState(data);
  }

  addTrip() {
    this.publisher.publish('add', this.state);
  }

  render() {
    if (!this.state.init) {
      return (
        <LinearProgress mode="indeterminate" />
      );
    }

    let l = '';

    if (this.state && this.state.trips) {
      l = this.state.trips.map(entry => {
        return <TripListEntry key={entry.id} id={entry.id}/>
      });
    }

    let style = {
      position: "absolute",
      bottom: 20,
      right: 20
    };

    return (
      <div>
        <List>
          {l}
        </List>
        <FlatButton
          label="Edit"
          primary={true}
          keyboardFocused={true}
          onTouchTap={() => {this.setState({openDialog: true});}}
        />
      <DateTimeEdit id='1' date={this.state.date} timezone='Europe/Berlin' open={this.state.openDialog} onEditEnd={(res) => {console.log(res);this.setState({openDialog: false, date:res});}}/>
        <FloatingActionButton secondary={true} style={style} onTouchTap={this.addTrip.bind(this)}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
