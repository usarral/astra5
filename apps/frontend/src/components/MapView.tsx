import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FitBoundsToGeoJSON from './FitBoundsToGeoJSON';

// Props for MapView component
type Props = {
  center: [number, number];
  zoom?: number;
  data: any;
  style?: React.CSSProperties;
  polygonStyle?: any;
  onEachFeature?: (feature: any, layer: any) => void;
};

// MapView component
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
      {/* Google Maps Tile */}
      <TileLayer
        attribution='&copy; Google Maps Tiles'
        url="http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
      />

      {/* GeoJSONs */}
      <GeoJSON data={data} style={polygonStyle} onEachFeature={onEachFeature} />


      {/* Fit map bounds to GeoJSON data */}
      <FitBoundsToGeoJSON data={data} />
    </MapContainer>
  );
};

export default MapView;
