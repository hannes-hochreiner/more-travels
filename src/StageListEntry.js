import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import {ListItem} from 'material-ui/List';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import MapsDirections from 'material-ui/svg-icons/maps/directions';
import LinearProgress from 'material-ui/LinearProgress';

export default class TripListEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
    PubSub.subscribe(`ui.stagelistentry.${this.state.id}.update`, this.update.bind(this));
  }

  componentDidMount() {
    PubSub.publish(`ui.stagelistentry.${this.state.id}.didMount`, this.state);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.stagelistentry.${this.state.id}`);
  }

  update(topic, data) {
    this.setState({ obj: data.obj });
  }

  open() {
    PubSub.publish(`ui.stagelistentry.${this.state.id}.open`, this.state);;
  }

  render() {
    if (!this.state.obj) {
      return <LinearProgress mode="indeterminate" />;
    }

    return (
      <ListItem key={this.state.obj.id} primaryText={`${this.state.obj.title}`} leftIcon={this.state.obj.type === 'place' ? <MapsPlace/> : <MapsDirections/>} />
    );
  }
}
