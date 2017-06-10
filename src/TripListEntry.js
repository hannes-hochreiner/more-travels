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

  update(topic, data) {
    this.setState({ obj: data.obj });
  }

  open() {
    console.log('open');
  }

  render() {
    let l = '';

    if (this.state.obj) {
      l = this.state.obj.title;
    }

    return (
      <ListItem
        primaryText = {l}
        secondaryText = "Jan 20, 2014"
         onTouchTap={this.open.bind(this)}
      />
    );
  }
}
