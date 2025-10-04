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
      const coords: [number, number][] = [];
      data.features.forEach((f: any) => {
        if (!f.geometry) return;
        if (f.geometry.type === 'Point') {
          const [lon, lat] = f.geometry.coordinates;
          coords.push([lat, lon]);
        } else if (f.geometry.type === 'Polygon') {
          f.geometry.coordinates[0].forEach((c: any) => {
            const [lon, lat] = c;
            coords.push([lat, lon]);
          });
        }
      });

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
