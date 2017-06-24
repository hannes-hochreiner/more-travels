import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import List from 'material-ui/List';
import StageListEntry from './StageListEntry';

export default class StageList extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.stagelist.${this.props.id}`);
    this.publisher = new PubSubPublisher(`ui.stagelist.${this.props.id}`);
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
