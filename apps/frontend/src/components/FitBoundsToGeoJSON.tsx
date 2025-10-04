import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

type Props = {
  data: any;
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
      data.features.forEach((f: any) => {
        // skip if no geometry
        if (!f.geometry) return; 
        //Handle Points pushing directly
        if (f.geometry.type === 'Point') {
          const [lon, lat] = f.geometry.coordinates;
          coords.push([lat, lon]);
        } else if (f.geometry.type === 'Polygon') {
          // For Polygons, take the first ring
          f.geometry.coordinates[0].forEach((c: any) => {
            const [lon, lat] = c;
            coords.push([lat, lon]);
          });
        }
      });

      // If we have coordinates, fit bounds
      if (coords.length > 0) {
        const bounds = (L as any).latLngBounds(coords as any);
        map.fitBounds(bounds, { padding });
      }
    } catch (err) {
      // don't break the app
      // eslint-disable-next-line no-console
      console.error('FitBoundsToGeoJSON error', err);
    }
  }, [data, map, padding]);

  return null;
};

export default FitBoundsToGeoJSON;
