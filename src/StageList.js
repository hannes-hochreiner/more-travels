import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import List from 'material-ui/List';
import StageListEntry from './StageListEntry';

export default class StageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      tripId: props.tripId
    };
    PubSub.subscribe(`ui.stagelist.${this.state.id}.update`, this.update.bind(this));
  }

  componentDidMount() {
    PubSub.publish(`ui.stagelist.${this.state.id}.didMount`, this.state);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.stagelist.${this.state.id}`);
  }

  update(topic, data) {
    this.setState({ stages: data.stages });
  }

  render() {
    let l = '';

    if (this.state && this.state.stages) {
      l = this.state.stages.map(entry => {
        return <StageListEntry key={entry.id} id={entry.id}/>
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
