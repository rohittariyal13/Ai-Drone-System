import React, { useRef, useEffect } from "react";
import "./Map.css";
import "ol/ol.css";
import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Circle, Fill, Stroke, Text } from "ol/style";

const DRONE_COLORS = {
  "UAV-01": "#00ff88",
  "UAV-02": "#ff9500",
  "UAV-03": "#ff3b3b",
};

export default function TacticalMap({ drones }) {
  const mapRef      = useRef(null);
  const olMap       = useRef(null);
  const featuresRef = useRef({});

  useEffect(() => {
    if (!mapRef.current || olMap.current) return;

    const features = drones.map((d) => {
      const coords = fromLonLat([d.gps.lngD || 77.5619, d.gps.latD || 34.1526]);
      const feature = new Feature({ geometry: new Point(coords) });
      feature.setStyle(new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: DRONE_COLORS[d.id] || "#00ff88" }),
          stroke: new Stroke({ color: "#ffffff", width: 2 }),
        }),
        text: new Text({
          text: d.id,
          font: "11px Arial",
          fill: new Fill({ color: "#ffffff" }),
          stroke: new Stroke({ color: "#000000", width: 3 }),
          offsetY: -18,
        }),
      }));
      featuresRef.current[d.id] = feature;
      return feature;
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features }),
    });

    olMap.current = new OLMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: "ESRI World Imagery",
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([77.5619, 34.1526]),
        zoom: 10,
      }),
    });
  }, []);

  // Update marker positions when drone data changes
  useEffect(() => {
    drones.forEach((d) => {
      const feature = featuresRef.current[d.id];
      if (feature && d.gps.latD && d.gps.lngD) {
        feature.getGeometry().setCoordinates(
          fromLonLat([d.gps.lngD, d.gps.latD])
        );
      }
    });
  }, [drones]);

  return (
    <div className="panel map-panel">
      <div className="panel-header">
        <span className="panel-title">TACTICAL MAP · THREAT OVERLAY · LIVE</span>
        <span className="badge badge-red">2 THREATS ACTIVE</span>
      </div>
      <div className="map-body" style={{ position: "relative" }}>

        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        <div className="map-legend" style={{ position: "absolute", bottom: "8px", left: "8px", zIndex: 10 }}>
          {[
            { color: "#00ff88", label: "Operational" },
            { color: "#ff9500", label: "Warning"     },
            { color: "#ff3b3b", label: "Threat / POI" },
          ].map(({ color, label }) => (
            <div className="leg-row" key={label}>
              <div className="leg-dot" style={{ background: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="map-coords" style={{ position: "absolute", bottom: "8px", right: "8px", zIndex: 10 }}>
          34°01'N 77°34'E · LADAKH SECTOR
        </div>
      </div>
    </div>
  );
}