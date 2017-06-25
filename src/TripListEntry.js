import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import {ListItem} from 'material-ui/List';

export default class TripListEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    },`ui.triplistentry.${this.state.id}`);
    this.publisher = new PubSubPublisher(`ui.triplistentry.${this.state.id}`);
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
    this.publisher.publish('open', {props: this.props, state: this.state});
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
