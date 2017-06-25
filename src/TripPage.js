import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';

import MoreTravelsMuiThemeProvider from './MoreTravelsMuiThemeProvider';
import StageList from './StageList';
import TripView from './TripView';
import TripEdit from './TripEdit';

export default class TripPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.tripid
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.trippage.${this.state.id}`);
    this.publisher = new PubSubPublisher(`ui.trippage.${this.state.id}`);
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
          <div className="TripPage">
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
        <TripEdit
          key={`tripedit${this.state.id}`}
          tripId={this.state.id}
          trip={this.state.obj}
        />,
      ];
    } else {
      content = [
        <TripView
          key={`tripview${this.state.id}`}
          tripId={this.state.id}
        />,
      <Divider key='divider'/>,
        <StageList
          key={`stagelist1`}
          id='1'
          tripId={this.state.id}
        />
      ];
    }

    return (
      <MoreTravelsMuiThemeProvider>
        <div className="TripPage">
          {content}
        </div>
      </MoreTravelsMuiThemeProvider>
    );
  }
}
