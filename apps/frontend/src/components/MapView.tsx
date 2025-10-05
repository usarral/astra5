import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON , ImageOverlay } from "react-leaflet";
import type { Layer } from "leaflet";
import type { GeoJSONFeature } from "../types/types";
import "leaflet/dist/leaflet.css";
import FitBoundsToGeoJSON from "./FitBoundsToGeoJSON";
import baseLayers from "../data/XYZTiles.ts";
import MapSeparator from "./MapSeparator.tsx";

// Props for MapView component
type Props = {
  center: [number, number];
  zoom?: number;
  // GeoJSON FeatureCollection-like object
  data: { type: "FeatureCollection"; features: GeoJSONFeature[] };
  style?: React.CSSProperties;
  polygonStyle?: ((feature: GeoJSONFeature) => L.PathOptions) | L.PathOptions;
  onEachFeature?: (feature: GeoJSONFeature, layer: Layer) => void;
};

// MapView component
const MapView = ({
  center,
  zoom = 10,
  data,
  style = { height: "100%", width: "100%" },
  polygonStyle,
  onEachFeature,
}: Props) => {
  const [selectedBase, setSelectedBase] =
    useState<keyof typeof baseLayers>("Google");
  const [geometryFilters, setGeometryFilters] = useState({
    Point: true,
    Polygon: true,
  });
  const [nameFilter, setNameFilter] = useState("");

  // Filtered GeoJSON data derived from incoming `data` prop
  const filteredData = useMemo(() => {
    // If no features, return as is
    if (!data?.features) return data;
    const features = data.features.filter((f) => {
      // geometry type filter
      const geomType = f.geometry?.type as string | undefined;
      if (geomType && geomType !== "Point" && geomType !== "Polygon") return false;
      if (geomType && !geometryFilters[geomType as keyof typeof geometryFilters])
        return false;

      // name/text filter (case-insensitive substring match)
      if (nameFilter && f.properties?.name) {
        return f.properties.name
          .toLowerCase()
          .includes(nameFilter.toLowerCase());
      }
      return true;
    });

    return { ...data, features };
  }, [data, geometryFilters, nameFilter]);

  // Toggle geometry filter helper
  const toggleGeometry = (type: keyof typeof geometryFilters) => {
    setGeometryFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer center={center} zoom={zoom} style={style}>
        {/* Selected base layer */}
        <TileLayer
          attribution={baseLayers[selectedBase].attribution}
          url={baseLayers[selectedBase].url}
        />

        <GeoJSON data={filteredData as any} style={polygonStyle as any} onEachFeature={onEachFeature as any} />

        {/* Use ImageOverlay instead of TileLayer for static image */}
        <ImageOverlay
          bounds={[
            [39.292975, -0.407625],
            [39.375418, -0.305073],
          ]}
          url="/src/assets/S1_2024-10-01_band1.png"
          opacity={0.7}
        />

        {/* Fit map bounds to filtered GeoJSON data */}
        <FitBoundsToGeoJSON data={filteredData} />
      </MapContainer>

      {/* Controls overlay */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(255,255,255,0.95)",
          padding: 10,
          borderRadius: 6,
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          zIndex: 1000,
          minWidth: 200,
          fontSize: 14,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <label
            htmlFor="base-layer-select"
            style={{ display: "block", fontWeight: 600, marginBottom: 4 }}
          >
            Base layer
          </label>
          <select
            id="base-layer-select"
            value={selectedBase}
            onChange={(e) => setSelectedBase(e.target.value as any)}
            style={{ width: "100%" }}
          >
            {Object.keys(baseLayers).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <MapSeparator />
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
            Detection types
          </div>
          <div>
            <label style={{ display: "block" }} htmlFor="geom-point">
              <input
                id="geom-point"
                type="checkbox"
                checked={geometryFilters.Point}
                onChange={() => toggleGeometry("Point")}
              />{" "}
              Points
            </label>
            <label style={{ display: "block" }} htmlFor="geom-polygon">
              <input
                id="geom-polygon"
                type="checkbox"
                checked={geometryFilters.Polygon}
                onChange={() => toggleGeometry("Polygon")}
              />{" "}
              Zones
            </label>
          </div>
        </div>
        <MapSeparator />
        <div style={{ marginBottom: 8 }}>
          <label
            htmlFor="name-filter"
            style={{ display: "block", fontWeight: 600, marginBottom: 4 }}
          >
            Filter by name
          </label>
          <input
            id="name-filter"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search name..."
            style={{ width: "100%" }}
          />
        </div>
        <MapSeparator />
        <div style={{ fontSize: 12, color: "#555" }}>
          <strong>{filteredData.features.length}</strong> detected areas
        </div>
      </div>
    </div>
  );
};

export default MapView;
