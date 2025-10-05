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
          const [lon, lat] = f.geometry.coordinates;
          coords.push([lat, lon]);
        } else if (f.geometry.type === "Polygon") {
          // For Polygons, take the first ring
          const rings = f.geometry.coordinates;
          rings[0]?.forEach((c) => {
            const [lon, lat] = c;
            coords.push([lat, lon]);
          });
        }
      });

      // If we have coordinates, fit bounds. If bounds collapse to a single point
      // (e.g. a Point feature) use a smooth flyTo animation instead of fitBounds
      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const isSinglePoint = ne.equals(sw);

        if (isSinglePoint) {
          const center = bounds.getCenter();
          // Choose a reasonable zoom for points. Prefer current zoom + 2 but
          // don't exceed map maxZoom (if available) or 18.
          const currentZoom = map.getZoom() ?? 13;
          const maxZoom = typeof map.getMaxZoom === "function" ? map.getMaxZoom() ?? 18 : 18;
          const increasedZoom = currentZoom + 8;
          const targetZoom = Math.min(maxZoom, increasedZoom, 18);

          // Use flyTo for a smooth animated transition to the point
          map.flyTo(center, targetZoom, { duration: 0.7 });
        } else {
          // For areas/polygons/multi-point collections use fitBounds so the
          // whole geometry is visible. Enable animation where supported.
          map.fitBounds(bounds, { padding, maxZoom: 18 });
        }
      }
    } catch (err) {
      // don't break the app

      console.error("FitBoundsToGeoJSON error", err);
    }
  }, [data, map, padding]);

  return null;
};

export default FitBoundsToGeoJSON;
