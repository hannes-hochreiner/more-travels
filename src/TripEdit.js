import React, {Component} from 'react';
import PubSub from 'pubsub-js';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import { List, ListItem } from 'material-ui/List';
import ActionDateRange from 'material-ui/svg-icons/action/date-range';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';

export default class TripEdit extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  componentDidMount() {
    PubSub.subscribe(`ui.tripedit.${this.props.tripId}`, this.handle.bind(this));
    PubSub.publish(`ui.tripedit.${this.props.tripId}.init`, this.state);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(`ui.tripedit.${this.props.tripId}`);
  }

  handle(topic, data) {
    let [,,,action] = topic.split('.');

    if (action === 'update') {
      this.setState(data);
    }
  }

  changeHandler(picker, event, data) {
    if (picker === 'start') {
      this.setState({dateStart: data});
    } else if (picker === 'end') {
      this.setState({dateEnd: data});
    }
  }

  editTitleStart() {
    PubSub.publish(`ui.tripedit.${this.props.tripId}.editTitleStart`, this.state);
  }

  editTitleEnd() {
    PubSub.publish(`ui.tripedit.${this.props.tripId}.editTitleEnd`, this.state);
  }

  editDatesStart() {
    PubSub.publish(`ui.tripedit.${this.props.tripId}.editDatesStart`, this.state);
  }

  editDatesEnd() {
    PubSub.publish(`ui.tripedit.${this.props.tripId}.editDatesEnd`, this.state);
  }

  render() {
    if (!this.state.init) {
      return <LinearProgress mode="indeterminate" />;
    }

    return (
      <div>
        <AppBar
          iconElementLeft={<IconButton><NavigationClose/></IconButton>}
          iconElementRight={<FlatButton label='save' onTouchTap={PubSub.publish.bind(null, `ui.trippage.${this.state.id}.save`, this.state)}/>}
          onLeftIconButtonTouchTap={PubSub.publish.bind(null, `ui.trippage.${this.props.tripId}.close`, this.state)}
        />
        <List>
          <ListItem
            primaryText={this.state.obj.title}
            insetChildren={true}
            onTouchTap={this.editTitleStart.bind(this)}
          />
          <ListItem
            primaryText={`${this.state.obj.start} - ${this.state.obj.end}`}
            leftIcon={<ActionDateRange />}
            onTouchTap={this.editDatesStart.bind(this)}
          />
        </List>
        <Dialog
          title="Trip dates"
          actions={[<FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.editDatesEnd.bind(this)}
          />]}
          modal={false}
          open={this.state.editDates}
          onRequestClose={this.editDatesEnd.bind(this)}
        >
          <DatePicker onChange={this.changeHandler.bind(this, 'start')} hintText="start date" autoOk={true} value={this.state.dateStart}/>
          <DatePicker onChange={this.changeHandler.bind(this, 'end')} hintText="end date" autoOk={true} value={this.state.dateEnd}/>
        </Dialog>
        <Dialog
          title="Title"
          actions={[<FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.editTitleEnd.bind(this)}
          />]}
          modal={false}
          open={this.state.editTitle}
          onRequestClose={this.editTitleEnd.bind(this)}
        >
          <TextField onChange={(event, data) => this.setState({title: data})} value={this.state.title}/>
        </Dialog>
      </div>
    );
  }
}
