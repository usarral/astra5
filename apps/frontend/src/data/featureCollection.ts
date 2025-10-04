import { BackendService } from "./getBackendData";

const getFeatures = async () => {
 // Call to the backend to get all the features
 const backendService = new BackendService();
 const features = await backendService.getInformation();
let featureArray = features.data.map((item: any) => item.geojson);
 console.log('Fetched features from backend:', featureArray);
 if (featureArray.length === 0) {
   console.warn('No features fetched from backend, using mocked data.');
   featureArray = mockedFeatures;
 }
 return featureArray;
};
const mockedFeatures = [
  {
    type: 'Feature',
    properties: {
      name: 'Tafalla',
      description: 'Ciudad de Tafalla',
    },
    geometry: {
      type: 'Point',
      coordinates: [-1.704656484, 42.51323936],
    },
  },
  {
    type: 'Feature',
    properties: {
      name: 'Olite',
      description: 'Ciudad de Olite',
    },
    geometry: {
      type: 'Point',
      coordinates: [-1.679611308, 42.44574826],
    },
  },
  {
    type: 'Feature',
    properties: {
      name: 'Tudela',
      description: 'Ciudad de Tudela',
    },
    geometry: {
      type: 'Point',
      coordinates: [-1.606666667, 42.06527778],
    },
  },
  {
    type: 'Feature',
    properties: {
      name: 'Área de Pamplona',
      description: 'Pequeño polígono (cuadro) alrededor de Pamplona',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-1.6758, 42.7925],
          [-1.6158, 42.7925],
          [-1.6158, 42.8325],
          [-1.6758, 42.8325],
          [-1.6758, 42.7925],
        ],
      ],
    },
  }
]

const featureCollection = {
  type: 'FeatureCollection',
  features: [...await getFeatures()],
};
export default featureCollection;
