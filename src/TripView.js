import React, {Component} from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import AppBar from 'material-ui/AppBar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { List, ListItem } from 'material-ui/List';
import ActionDateRange from 'material-ui/svg-icons/action/date-range';
import LinearProgress from 'material-ui/LinearProgress';

export default class TripView extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.tripview.${this.props.tripId}`);
    this.publisher = new PubSubPublisher(`ui.tripview.${this.props.tripId}`);
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
    if (!this.state.init) {
      return <LinearProgress mode="indeterminate" />;
    }

    return <div>
      <AppBar
        title={this.state.obj.title}
        iconElementLeft={<IconButton><NavigationClose/></IconButton>}
        iconElementRight={
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="edit" onTouchTap={this.publisher.publish.bind(this.publisher,'edit', {props: this.props, state: this.state})}/>
            <MenuItem primaryText="delete" />
          </IconMenu>
        }
        onLeftIconButtonTouchTap={this.publisher.publish.bind(this.publisher,'close', {props: this.props, state: this.state})}
      />
      <List>
        <ListItem
          disabled={true}
          primaryText={`${this.state.obj.start} - ${this.state.obj.end}`}
          leftIcon={<ActionDateRange />}
        />
      </List>
    </div>;
  }
}
