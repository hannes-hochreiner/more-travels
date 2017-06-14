import React, { Component } from 'react';
import PubSub from 'pubsub-js';

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
      datesEditDialog: false,
      id: props.match.params.tripid
    };
  }

  componentDidMount() {
    PubSub.subscribe(
      `ui.trippage.${this.state.id}`,
      this.handle.bind(this)
    );
    PubSub.publish(
      `ui.trippage.${this.state.id}.didMount`,
      this.state
    );
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.trippage.${this.state.id}`);
  }

  handle(topic, data) {
    let [, , , action] = topic.split('.');

    if (action === 'update') {
      this.setState(data);
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
          tripId={this.state.id}
          onView={PubSub.publish.bind(null,`ui.trippage.${this.state.id}.view`, this.state)}
          onClose={PubSub.publish.bind(null,`ui.trippage.${this.state.id}.close`, this.state)}
        />,
      ];
    } else {
      content = [
        <TripView
          tripId={this.state.id}
          onEdit={PubSub.publish.bind(null,`ui.trippage.${this.state.id}.edit`, this.state)}
          onClose={PubSub.publish.bind(null,`ui.trippage.${this.state.id}.close`, this.state)}
        />,
        <Divider />,
        <StageList id='1' tripId={this.state.id}/>
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
