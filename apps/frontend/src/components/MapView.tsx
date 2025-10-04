import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FitBoundsToGeoJSON from './FitBoundsToGeoJSON';

type Props = {
  center: [number, number];
  zoom?: number;
  data: any;
  style?: React.CSSProperties;
  polygonStyle?: any;
  onEachFeature?: (feature: any, layer: any) => void;
};

const MapView = ({
  center,
  zoom = 10,
  data,
  style = { height: '100%', width: '100%' },
  polygonStyle,
  onEachFeature,
}: Props) => {
  return (
    <MapContainer center={center} zoom={zoom} style={style}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

  <GeoJSON data={data} style={polygonStyle} onEachFeature={onEachFeature} />

      <FitBoundsToGeoJSON data={data} />
    </MapContainer>
  );
};

export default MapView;
