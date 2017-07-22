import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import LinearProgress from 'material-ui/LinearProgress';
import AppBar from 'material-ui/AppBar';

import MoreTravelsMuiThemeProvider from './MoreTravelsMuiThemeProvider';
import StageView from './StageView';
import StageEdit from './StageEdit';

export default class StagePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tripid: props.match.params.tripid,
      stageid: props.match.params.stageid
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.stagepage.${this.state.stageid}`);
    this.publisher = new PubSubPublisher(`ui.stagepage.${this.state.stageid}`);
  }

  componentDidMount() {
    this.handler.subscribe();
    this.publisher.publish('init', this.state);
  }

  componentWillUnmount() {
    this.handler.unsubscribe();
  }

  update(realm, type, id, action, state) {
    if (action === 'update') {
      this.setState(state);
    }
  }

  render() {
    if (!this.state.init) {
      return (
        <MoreTravelsMuiThemeProvider>
          <div className="StagePage">
            <AppBar
              title="...loading..."
            />
            <LinearProgress mode="indeterminate" />
          </div>
        </MoreTravelsMuiThemeProvider>
      );
    }

    let content = [];

    if (this.state.editMode) {
      content = [
        <StageEdit
          key={`stageedit${this.state.stageid}`}
          stageid={this.state.stageid}
          tripid={this.state.tripid}
          stage={this.state.obj}
        />,
      ];
    } else {
      content = [
        <StageView
          key={`stageview${this.state.stageid}`}
          stageid={this.state.stageid}
          tripid={this.state.tripid}
          stage={this.state.obj}
        />,
      ];
    }

    return (
      <MoreTravelsMuiThemeProvider>
        <div className="StagePage">
          {content}
        </div>
      </MoreTravelsMuiThemeProvider>
    );
  }
}
