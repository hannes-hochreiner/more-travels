import React, {Component} from 'react';

import { oneShot as psos } from './PubSubOneShot';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import './mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

/**
 @usage <LocationEdit id='1' onEditEnd={editEnd} title={title} latitude={latitude} longitude={longitude} zoom={zoom} />
 @usage <LocationEdit id='1' onEditEnd={editEnd} title={'test'} zoom={20} latitude={48.2} longitude={16.366667}/>
*/
export default class LocationEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      zoom: this.props.zoom
    };
  }

  componentDidMount() {
    psos(
      `service.configuration.getMapboxAuthToken`,
      {}
    ).then(res => {
      if (!res.mapboxAuthToken || res.mapboxAuthToken === '') {
        return;
      }

      mapboxgl.accessToken = res.mapboxAuthToken;
      let mapboxOptions = {
        container: this.mapDiv,
        style: 'mapbox://styles/mapbox/streets-v9'
      };

      if (this.state.longitude && this.state.latitude) {
        mapboxOptions.center = [this.state.longitude, this.state.latitude];
      }

      if (this.state.zoom) {
        mapboxOptions.zoom = this.state.zoom;
      }

      this.map = new mapboxgl.Map(mapboxOptions);
    });
  }

  componentWillUnmount() {
  }

  handleTitleChange(evnt, val) {
    this.setState({title: val});
  }

  onEditEnd(evnt, val) {
    if (typeof this.props.onEditEnd === 'function') {
      let longitude = this.props.longitude;
      let latitude = this.props.latitude;
      let zoom = this.props.zoom;

      if (this.map) {
        longitude = this.map.getCenter().lng;
        latitude = this.map.getCenter().lat;
        zoom = this.map.getZoom();
      }

      this.props.onEditEnd(
        this.state.title,
        longitude,
        latitude,
        zoom,
      );
    }
  }

  render() {
    return (
      <Dialog
        title="Location"
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
          floatingLabelText="title"
          value={this.state.title}
          onChange={this.handleTitleChange.bind(this)}
        />
        <div style={{height: 300}} ref={(div) => {this.mapDiv = div;}}/>
      </Dialog>
    );
  }
}
