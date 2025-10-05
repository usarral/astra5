import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { GeoJSONFeature } from "../types/types";

type Props = {
  data: { type: "FeatureCollection"; features: GeoJSONFeature[] } | null | undefined;
  padding?: [number, number];
};

const FitBoundsToGeoJSON = ({ data, padding = [20, 20] }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!data?.features) return;
    try {
      // Coordinates array of [lat, lon]
      const coords: [number, number][] = [];
      // For each feature, extract coordinates
      data.features.forEach((f) => {
        // skip if no geometry
        if (!f.geometry) return;
        // Handle Points pushing directly
        if (f.geometry.type === "Point") {
          const [lon, lat] = f.geometry.coordinates as [number, number];
          coords.push([lat, lon]);
        } else if (f.geometry.type === "Polygon") {
          // For Polygons, take the first ring
          const rings = f.geometry.coordinates as number[][][];
          rings[0]?.forEach((c) => {
            const [lon, lat] = c;
            coords.push([lat, lon]);
          });
        }
      });

      // If we have coordinates, fit bounds
      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding });
      }
    } catch (err) {
      // don't break the app

      console.error("FitBoundsToGeoJSON error", err);
    }
  }, [data, map, padding]);

  return null;
};

export default FitBoundsToGeoJSON;
