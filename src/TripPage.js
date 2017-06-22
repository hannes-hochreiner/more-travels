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
    this.props = props;
    this.state = {
      editMode: false,
      id: props.match.params.tripid
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.trippage.${props.match.params.tripid}`);
    this.publisher = new PubSubPublisher(`ui.trippage.${props.match.params.tripid}`);
  }

  componentDidMount() {
    this.handler.subscribe();
    this.publisher.publish('init', {props: this.props, state: this.state});
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
    if (!this.state.obj) {
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
          onView={this.publisher.publish.bind(this.publisher, 'view', {props: this.props, state: this.state})}
          onClose={this.publisher.publish.bind(this.publisher, 'close', {props: this.props, state: this.state})}
        />,
      ];
    } else {
      content = [
        <TripView
          key={`tripview${this.state.id}`}
          tripId={this.state.id}
          onEdit={this.publisher.publish.bind(this.publisher, 'edit', {props: this.props, state: this.state})}
          onClose={this.publisher.publish.bind(this.publisher, 'close', {props: this.props, state: this.state})}
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
