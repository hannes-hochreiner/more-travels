import React, { Component } from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import List from 'material-ui/List';
import {ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import TextEdit from './TextEdit';

import MoreTravelsMuiThemeProvider from './MoreTravelsMuiThemeProvider';

export default class ConfPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editText: false
    };
    this.psh = new PubSubHandler({
      'update': this.update.bind(this)
    }, `ui.confpage.1`);
    this.psp = new PubSubPublisher(`ui.confpage.1`);
  }

  componentDidMount() {
    this.psh.subscribe();
    this.psp.publish('init', this.state);
  }

  componentWillUnmount() {
    this.psh.unsubscribe();
  }

  update(realm, type, id, action, state) {
    if (action === 'update') {
      this.setState(state);
    }
  }

  editMapBoxAuthKey() {
    this.psp.publish('editMapBoxAuthKey', this.state);
  }

  handleTextEditEnd(text) {
    this.psp.publish('textEditEnd', { state: this.state, text: text });
  }

  render() {
    if (!this.state.init) {
      return (
        <MoreTravelsMuiThemeProvider>
          <div className="ConfPage">
            <AppBar
              title="...loading..."
            />
            <LinearProgress mode="indeterminate" />
          </div>
        </MoreTravelsMuiThemeProvider>
      );
    }

    let editDia;

    if (this.state.editText) {
      editDia = <TextEdit
        onEditEnd={this.handleTextEditEnd.bind(this)}
        title={this.state.editTextTitle}
        text={this.state.editTextText}
      />;
    }

    return (
      <MoreTravelsMuiThemeProvider>
        <div className="ConfPage">
          <AppBar
            title='configuration'
            iconElementLeft={<IconButton><NavigationClose/></IconButton>}
            onLeftIconButtonTouchTap={this.psp.publish.bind(this.psp,'close', this.state)}
          />
          <List>
            <ListItem
              key={'MapBoxAuthKey'}
              primaryText={'MapBox Auth Key'}
              secondaryText={this.state.obj.mapbox.authKey}
              onTouchTap={this.editMapBoxAuthKey.bind(this)}
            />
          </List>
          <Divider key='divider'/>
          {editDia}
        </div>
      </MoreTravelsMuiThemeProvider>
    );
  }
}
