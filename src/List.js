import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import ListEntry from './ListEntry';

export default class List extends Component {
  constructor() {
    super();
    PubSub.subscribe('ui.list.update', this.update.bind(this));
  }

  componentDidMount() {
    PubSub.publish('ui.list.didMount', this.state);
  }

  update(topic, data) {
    this.setState({ list: data.list });
  }

  render() {
    let l = '';

    if (this.state) {
      l = this.state.list.map(entry => {
        return <ListEntry key={entry.id} id={entry.id}/>
      });
    }

    return (
      <div className="List">
        <p>list</p>
        <ul>
          {l}
        </ul>
      </div>
    );
  }
}
