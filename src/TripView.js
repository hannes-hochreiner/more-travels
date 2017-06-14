import React, {Component} from 'react';
import PubSub from 'pubsub-js';

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
  }

  componentDidMount() {
    PubSub.subscribe(`ui.tripview.${this.props.tripId}`, this.handle.bind(this));
    PubSub.publish(`ui.tripview.${this.props.tripId}.init`, this.state);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.tripview.${this.props.tripId}`);
  }

  handle(topic, data) {
    let [,,,action] = topic.split('.');

    if (action === 'update') {
      this.setState(data);
    }
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
            <MenuItem primaryText="edit" onTouchTap={() => {this.props.onEdit && this.props.onEdit()}}/>
            <MenuItem primaryText="delete" />
          </IconMenu>
        }
        onLeftIconButtonTouchTap={PubSub.publish.bind(null, `ui.tripview.${this.props.tripId}.close`, this.state)}
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
