import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import { List, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import TripListEntry from './TripListEntry';

export default class TripList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    },`ui.triplist.${this.state.id}`);
    this.publisher = new PubSubPublisher(`ui.triplist.${this.state.id}`);
  }

  componentDidMount() {
    this.handler.subscribe();
    this.publisher.publish('init', {props: this.props, state: this.state});
  }

  componentWillUnmount() {
    this.handler.unsubscribe();
  }

  update(realm, type, id, action, data) {
    this.setState(data);
  }

  addTrip() {
    this.publisher.publish('add', {props: this.props, state: this.state});
  }

  render() {
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
        <FloatingActionButton secondary={true} style={style} onTouchTap={this.addTrip.bind(this)}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}
