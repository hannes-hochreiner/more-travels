import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import List from 'material-ui/List';
import StageListEntry from './StageListEntry';
import LinearProgress from 'material-ui/LinearProgress';

export default class StageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      tripId: props.tripId
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.stagelist.${this.state.id}`);
    this.publisher = new PubSubPublisher(`ui.stagelist.${this.state.id}`);
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

  render() {
    if (!this.state.init) {
      return <LinearProgress mode="indeterminate" />;
    }

    let l = '';

    if (this.state && this.state.stages) {
      l = this.state.stages.map(entry => {
        return <StageListEntry key={entry._id} tripid={entry.tripid} stageid={entry.stageid}/>
      });
    }

    return (
      <div>
        <List>
          {l}
        </List>
      </div>
    );
  }
}
