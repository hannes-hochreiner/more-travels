import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import {ListItem} from 'material-ui/List';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import MapsDirections from 'material-ui/svg-icons/maps/directions';
import LinearProgress from 'material-ui/LinearProgress';

export default class TripListEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripid: props.tripid,
      stageid: props.stageid,
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.stagelistentry.${this.state.stageid}`);
    this.publisher = new PubSubPublisher(`ui.stagelistentry.${this.state.stageid}`);
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

  open() {
    this.publisher.publish('open', this.state);
  }

  render() {
    if (!this.state.init) {
      return <LinearProgress mode="indeterminate" />;
    }

    return (
      <ListItem
        key={this.state.obj.id}
        primaryText={`${this.state.obj.title}`}
        secondaryText={`${this.state.timestampstart} - ${this.state.timestampend}`}
        leftIcon={this.state.obj.subtype === 'stay' ? <MapsPlace/> : <MapsDirections/>}
        onTouchTap={this.open.bind(this)}
      />
    );
  }
}
