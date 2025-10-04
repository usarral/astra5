import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export const initDefaultIcon = () => {
  const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Ensure default marker icon is set (suppress TS warning)
  // @ts-ignore
  L.Marker.prototype.options.icon = DefaultIcon;

  return DefaultIcon;
};

export default initDefaultIcon;
