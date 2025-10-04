import './App.css';
import MapView from './components/MapView';
import exampleGeoJSON from './data/exampleGeoJSON';
import initDefaultIcon from './utils/leafletIcon';

// initialize default Leaflet icon for markers
initDefaultIcon();

function App() {
  const center: [number, number] = [42.8125, -1.6458];

  const polygonStyle = {
    fillColor: '#3388ff',
    fillOpacity: 0.3,
    color: '#3388ff',
    weight: 2,
  };

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties?.name) {
      layer.bindPopup(
        `<strong>${feature.properties.name}</strong><br/>${feature.properties.description || ''}`
      );
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapView
        center={center}
        zoom={12}
        data={exampleGeoJSON}
        polygonStyle={polygonStyle}
        onEachFeature={onEachFeature}
      />
    </div>
  );
}

export default App;
