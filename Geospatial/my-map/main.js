import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'ESRI World Imagery'
      })
    })
  ],
  view: new View({
    center: fromLonLat([77.5619, 34.1526]),
    zoom: 10
  })
});

const drones = {
  'UAV-01': { lon: 77.5619, lat: 34.1526, color: '#00ff88', label: 'UAV-01' },
  'UAV-02': { lon: 77.5800, lat: 34.1680, color: '#ff9500', label: 'UAV-02' },
  'UAV-03': { lon: 77.5400, lat: 34.1400, color: '#ff3b3b', label: 'UAV-03' },
};

const droneFeatures = {};

Object.entries(drones).forEach(([id, drone]) => {
  const feature = new Feature({
    geometry: new Point(fromLonLat([drone.lon, drone.lat]))
  });

  feature.setStyle(new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({ color: drone.color }),
      stroke: new Stroke({ color: '#ffffff', width: 2 })
    }),
    text: new Text({
      text: drone.label,
      font: '11px Arial',
      fill: new Fill({ color: '#ffffff' }),
      stroke: new Stroke({ color: '#000000', width: 3 }),
      offsetY: -18
    })
  }));

  droneFeatures[id] = feature;
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: Object.values(droneFeatures)
  })
});

map.addLayer(vectorLayer);

const ws = new WebSocket('ws://localhost:8000/ws/telemetry');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (droneFeatures[data.drone_id]) {
    droneFeatures[data.drone_id].getGeometry().setCoordinates(
      fromLonLat([data.lng, data.lat])
    );
  }
};

ws.onopen = () => console.log('Connected to TSN backend');
ws.onerror = (error) => console.log('WebSocket error:', error);