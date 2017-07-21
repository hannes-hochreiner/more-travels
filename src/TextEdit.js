import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import { oneShot as psos } from './PubSubOneShot';
import uuid from 'uuid';

import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/**
 @usage <TextEdit id='1' onEditEnd={editEnd} title={title} text={text} />
*/
export default class LocationEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleTextChange(evnt, val) {
    this.setState({text: val});
  }

  onEditEnd(evnt, val) {
    if (typeof this.props.onEditEnd === 'function') {
      this.props.onEditEnd(
        this.state.text
      );
    }
  }

  render() {
    return (
      <Dialog
        title='Edit text'
        actions={[<FlatButton
          label="Ok"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.onEditEnd.bind(this)}
        />]}
        modal={false}
        open={true}
        onRequestClose={this.onEditEnd.bind(this)}
      >
        <TextField
          floatingLabelText={this.props.title}
          value={this.state.text}
          onChange={this.handleTextChange.bind(this)}
        />
      </Dialog>
    );
  }
}
