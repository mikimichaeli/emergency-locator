import React from 'react';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';
Leaflet.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';


export default class CreatePhoneCall extends React.Component {
    render() {
        let { location } = this.props;
        if (Object.keys(location).length === 0 && location.constructor === Object)
            return null;

        const position = [location.latitude, location.longitude];

        return <Map center={position} zoom={13}>
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    Location of the caller
                </Popup>
            </Marker>
        </Map>
    }
}

