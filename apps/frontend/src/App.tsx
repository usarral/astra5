import "./App.css";
import MapPopup from "./components/MapPopup";
import MapView from "./components/MapView";
import featureCollection from "./data/featureCollection";
import type { GeoJSONFeature } from "./types/types";
import type { Layer } from "leaflet";
import initDefaultIcon from "./utils/leafletIcon";

// initialize default Leaflet icon for markers
initDefaultIcon();

function App() {
  const center: [number, number] = [42.8125, -1.6458];

  const polygonStyle = {
    fillColor: "#3388ff",
    fillOpacity: 0,
    color: "#2766beff",
    weight: 6,
  };

  const onEachFeature = (feature: GeoJSONFeature, layer: Layer) => {
    console.log("Feature:", feature);
    console.log("Layer:", layer);
    if (feature.properties?.name) {
      layer.bindPopup(MapPopup(feature.properties));
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapView
        center={center}
        zoom={12}
        data={featureCollection}
        polygonStyle={polygonStyle}
        onEachFeature={onEachFeature}
      />
    </div>
  );
}

export default App;
