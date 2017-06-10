import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id
    };
    PubSub.subscribe(`ui.listentry.${this.state.id}.update`, this.update.bind(this));
  }

  componentDidMount() {
    PubSub.publish(`ui.listentry.${this.state.id}.didMount`, this.state);
  }

  update(topic, data) {
    this.setState({ list: data.list });
  }

  render() {
    let l = '';

    if (this.state.obj) {
      l = this.state.obj.title;
    }

    return (
      <div className="ListEntry">
        <p>{l}</p>
      </div>
    );
  }
}
