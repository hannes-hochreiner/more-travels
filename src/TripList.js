import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import { List, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import TripListEntry from './TripListEntry';

export default class TripList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
    PubSub.subscribe(`ui.triplist.${this.state.id}.update`, this.update.bind(this));
  }

  componentDidMount() {
    PubSub.publish(`ui.triplist.${this.state.id}.didMount`, this.state);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.triplist.${this.state.id}`);
  }

  update(topic, data) {
    this.setState({ trips: data.trips });
  }

  addTrip() {
    console.log('adding trip');
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
