import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import {ListItem} from 'material-ui/List';

export default class TripListEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
    PubSub.subscribe(`ui.triplistentry.${this.state.id}.update`, this.update.bind(this));
  }

  componentDidMount() {
    PubSub.publish(`ui.triplistentry.${this.state.id}.didMount`, this.state);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.triplistentry.${this.state.id}`);
  }

  update(topic, data) {
    this.setState({ obj: data.obj });
  }

  open() {
    PubSub.publish(`ui.triplistentry.${this.state.id}.open`, this.state);;
  }

  render() {
    let l = '';
    let t = '';

    if (this.state.obj) {
      l = this.state.obj.title;
      t = `from ${this.state.obj.start} to ${this.state.obj.end}`;
    }

    return (
      <ListItem
        primaryText = {l}
        secondaryText = {t}
        onTouchTap={this.open.bind(this)}
      />
    );
  }
}
