import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useMap } from 'react-leaflet';
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

// Datos GeoJSON: puntos en Navarra (Tafalla, Olite, Tudela) y un polígono (cuadro) alrededor de Pamplona
const exampleGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Tafalla",
        description: "Ciudad de Tafalla"
      },
      geometry: {
        type: "Point",
        // GeoJSON usa [lon, lat]
        coordinates: [-1.704656484, 42.51323936]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Olite",
        description: "Ciudad de Olite"
      },
      geometry: {
        type: "Point",
        coordinates: [-1.679611308, 42.44574826]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Tudela",
        description: "Ciudad de Tudela"
      },
      geometry: {
        type: "Point",
        coordinates: [-1.606666667, 42.06527778]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Área de Pamplona",
        description: "Pequeño polígono (cuadro) alrededor de Pamplona"
      },
      geometry: {
        type: "Polygon",
        // Pequeña caja cuadrada centrada en Pamplona (42.8125, -1.6458)
        // GeoJSON: [lon, lat]
        coordinates: [[
          [-1.6758, 42.7925],
          [-1.6158, 42.7925],
          [-1.6158, 42.8325],
          [-1.6758, 42.8325],
          [-1.6758, 42.7925]
        ]]
      }
    }
  ]
};

function App() {
  // Centro del mapa en Pamplona
  const center: [number, number] = [42.8125, -1.6458];
  const zoom = 12;

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

  // Componente que ajusta el mapa para mostrar todo el GeoJSON
  const FitBoundsToGeoJSON = ({ data }: { data: any }) => {
    const map = useMap();
    // Extraer todas las coordenadas y construir LatLngBounds
    try {
      const coords: [number, number][] = [];
      data.features.forEach((f: any) => {
        if (f.geometry.type === 'Point') {
          const [lon, lat] = f.geometry.coordinates;
          coords.push([lat, lon]);
        } else if (f.geometry.type === 'Polygon') {
          f.geometry.coordinates[0].forEach((c: any) => {
            const [lon, lat] = c;
            coords.push([lat, lon]);
          });
        }
        // (no manejamos otras geometrías por ahora)
      });

      if (coords.length > 0) {
        // @ts-ignore
        const bounds = (L as any).latLngBounds(coords as any);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch (err) {
      // si algo falla, no romper la app
      console.error('FitBounds error', err);
    }
    return null;
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

        {/* Ajustar el zoom/centro para que quepa todo Navarra */}
        <FitBoundsToGeoJSON data={exampleGeoJSON} />

        {/* Marcadores y polígonos provienen ahora del GeoJSON */}
      </MapContainer>
    </div>
  );
}

export default App;
