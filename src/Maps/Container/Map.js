import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { PointMarker } from '../Components/PointMarker.js'


export class MapContainer extends Component {

  static defaultProps = {
    center: {
      lat: 39.95,
      lng: 0.033
    },
    zoom: 11
  };

  render() {
 
    const {latitude , longitude } = this.props

    return (

      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <PointMarker
            lat={latitude}
            lng={longitude}
          />
        </GoogleMapReact>
      </div>
    );
  }
}