export interface InformationService {
    data: Item[];
}

export interface Item {
    id:      string;
    name:    string;
    geojson: Geojson;
}

export interface Geojson {
    type:       string;
    geometry:   Geometry;
    properties: Properties;
}

export interface Geometry {
    type:        string;
    coordinates: Array<Array<number[]> | number>;
}

export interface Properties {
    name:        string;
    description: string;
}
