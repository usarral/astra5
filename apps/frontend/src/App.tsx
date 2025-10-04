import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Ejemplo de datos GeoJSON (zona de Cataluña)
const exampleGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Barcelona",
        description: "Ciudad de Barcelona"
      },
      geometry: {
        type: "Point",
        coordinates: [2.1734, 41.3851]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Girona",
        description: "Ciudad de Girona"
      },
      geometry: {
        type: "Point",
        coordinates: [2.8214, 41.9794]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Lleida",
        description: "Ciudad de Lleida"
      },
      geometry: {
        type: "Point",
        coordinates: [0.6200, 41.6176]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Tarragona",
        description: "Ciudad de Tarragona"
      },
      geometry: {
        type: "Point",
        coordinates: [1.2444, 41.1189]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Área de ejemplo",
        description: "Polígono de ejemplo"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [2.0, 41.3],
          [2.3, 41.3],
          [2.3, 41.5],
          [2.0, 41.5],
          [2.0, 41.3]
        ]]
      }
    }
  ]
};

function App() {
  // Centro del mapa en Cataluña
  const center: [number, number] = [41.5, 1.5];
  const zoom = 8;

  // Estilo para los polígonos
  const polygonStyle = {
    fillColor: '#3388ff',
    fillOpacity: 0.3,
    color: '#3388ff',
    weight: 2
  };

  // Función para cada feature del GeoJSON
  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties?.name) {
      layer.bindPopup(
        `<strong>${feature.properties.name}</strong><br/>${feature.properties.description || ''}`
      );
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Capa de tiles de OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Datos GeoJSON de ejemplo */}
        <GeoJSON 
          data={exampleGeoJSON as any} 
          style={polygonStyle}
          onEachFeature={onEachFeature}
        />

        {/* Marcador adicional de ejemplo */}
        <Marker position={[41.3851, 2.1734]}>
          <Popup>
            <strong>Barcelona</strong><br />
            Ejemplo de marcador personalizado
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
