// Basic interfaces used by the frontend. Prefer using GeoJSON types where possible.
export interface InformationService {
  data: Item[];
}

export interface Item {
  id: string;
  name: string;
  geojson: GeoJSONFeature;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: Geometry;
  properties: Properties;
}

export type GeoJSONFeatureCollection = {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
};

export type Geometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'Polygon'; coordinates: number[][][] };

export interface Properties {
  name: string;
  description?: string;
  detection_date?: string | Date;
}
