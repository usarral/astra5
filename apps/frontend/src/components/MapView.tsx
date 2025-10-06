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
  // Toggle for showing SAR image overlay
  const [showSAR, setShowSAR] = useState(true);
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

        {/* Use ImageOverlay instead of TileLayer for static image (conditionally rendered) */}
        {showSAR && (
          <ImageOverlay
            bounds={[
              [39.292975, -0.407625],
              [39.375418, -0.305073],
            ]}
            url="/S1_2024-10-01_band1.png"
            opacity={1}
          />
        )}

        {/* Fit map bounds to filtered GeoJSON data */}
        <FitBoundsToGeoJSON data={filteredData} />
      </MapContainer>

      {/* Controls overlay */}
      <div className="map-controls" style={{ position: "absolute", top: 10, right: 10 }}>
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
            SAR image
          </div>
          <label style={{ display: "block" }} htmlFor="toggle-sar">
            <input
              id="toggle-sar"
              type="checkbox"
              checked={showSAR}
              onChange={() => setShowSAR((s) => !s)}
            />{' '}
            Show SAR overlay
          </label>
        </div>
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

      {/* GitHub attribution / repo button (bottom-right) */}
      <div style={{ position: "absolute", right: 10, bottom: 10, zIndex: 1000 }}>
        <a
          href="https://github.com/usarral/astra5"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apertura del repositorio GitHub en una nueva pestaña"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 6,
            textDecoration: "none",
            fontSize: 13,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default MapView;
