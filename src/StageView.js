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

export default class StageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripid: props.tripid,
      stageid: props.stageid,
      obj: props.stage,
    };
    this.handler = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.stageview.${this.state.stageid}`);
    this.publisher = new PubSubPublisher(`ui.stageview.${this.state.stageid}`);
  }

  componentDidMount() {
    this.handler.subscribe();
    this.publisher.publish('init', this.state);
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
            <MenuItem primaryText="edit" onTouchTap={this.publisher.publish.bind(this.publisher,'edit', this.state)}/>
            <MenuItem primaryText="delete" />
          </IconMenu>
        }
        onLeftIconButtonTouchTap={this.publisher.publish.bind(this.publisher,'close', this.state)}
      />
      <List>
        <ListItem
          disabled={true}
          primaryText={`${this.state.timestampstart} - ${this.state.timestampend}`}
          leftIcon={<ActionDateRange />}
        />
      </List>
    </div>;
  }
}
