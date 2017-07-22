import React, {Component} from 'react';

import PubSubHandler from './PubSubHandler';
import PubSubPublisher from './PubSubPublisher';

import AppBar from 'material-ui/AppBar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import LinearProgress from 'material-ui/LinearProgress';
import {GridList, GridTile} from 'material-ui/GridList';

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
    this.objectUrls = {};
  }

  componentDidMount() {
    this.handler.subscribe();
    this.publisher.publish('init', this.state);
  }

  componentWillUnmount() {
    this.handler.unsubscribe();
    this.freeObjectUrls();
  }

  freeObjectUrls() {
    for (let prop in this.objectUrls) {
      if (this.objectUrls.hasOwnProperty(prop)) {
        URL.revokeObjectURL(this.objectUrls[prop]);
        delete this.objectUrls[prop];
      }
    }
  }

  update(realm, type, id, action, data) {
    this.setState(data);
  }

  render() {
    if (!this.state.init) {
      return <LinearProgress mode="indeterminate" />;
    }

    this.freeObjectUrls();

    if (this.state.locationstartmap) {
      this.objectUrls['locationstartmap'] = URL.createObjectURL(this.state.locationstartmap) || '';
    } else {
      this.objectUrls['locationstartmap'] = '';
    }

    if (this.state.locationendmap) {
      this.objectUrls['locationendmap'] = URL.createObjectURL(this.state.locationendmap);
    } else {
      this.objectUrls['locationendmap'] = '';
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
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', }}>
        <GridList style={{width: 600, height: 600, overflowY: 'auto',}} cellHeight={300}>
          <GridTile key={'start'} title={this.state.obj.locationstart.title} subtitle={<span>{this.state.timestampstart}</span>}>
            <img alt='' src={this.objectUrls['locationstartmap']}/>
          </GridTile>
          <GridTile key={'end'} title={this.state.obj.locationend.title} subtitle={<span>{this.state.timestampend}</span>}>
            <img alt='' src={this.objectUrls['locationendmap']}/>
          </GridTile>
        </GridList>
      </div>
    </div>;
  }
}
