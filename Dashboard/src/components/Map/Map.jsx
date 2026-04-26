import React, { useRef, useEffect, useState } from "react";
import "./Map.css";

function DroneMarker({ drone }) {
  const cls = drone.status === "warning" ? "dk-amber" : "dk-green";
  return (
    <div className="drone-marker" style={{ left: `${drone.mapPos.x}%`, top: `${drone.mapPos.y}%` }}>
      <div className={`drone-icon ${cls}`}>
        <div className="drone-pulse" />+
      </div>
      <div className="drone-label">{drone.id}</div>
    </div>
  );
}

function ThreatMarker({ pos }) {
  return (
    <div className="threat-marker" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
  );
}

export default function Map({ drones, focusedDroneId }) { 
  const mapRef  = useRef(null);
  const trlRef  = useRef([[], [], []]);
  const [trails, setTrails] = useState([[], [], []]);

  const trailColors = ["#22c55e", "#ff9500", "#4a9eff"];

  useEffect(() => {
    if (!mapRef.current) return;
    const { offsetWidth: mw, offsetHeight: mh } = mapRef.current;
    if (!mw || !mh) return;

    const newTrails = drones.map((d, i) => {
      const arr = [...trlRef.current[i]];
      arr.push(`${((d.mapPos.x / 100) * mw).toFixed(0)},${((d.mapPos.y / 100) * mh).toFixed(0)}`);
      if (arr.length > 16) arr.shift();
      trlRef.current[i] = arr;
      return arr;
    });
    setTrails(newTrails);
  }, [drones]);

  // Threat positions relative to UAV-01 and UAV-03
  const threatPositions = [
    { x: drones[0].mapPos.x + 8,  y: drones[0].mapPos.y + 3 },
    { x: drones[2].mapPos.x - 11, y: drones[2].mapPos.y - 9 },
  ];

  return (
    <div className="panel map-panel">
      <div className="panel-header">
        <span className="panel-title">TACTICAL MAP · THREAT OVERLAY · LIVE</span>
        <span className="badge badge-red">2 THREATS ACTIVE</span>
      </div>
      <div className="map-body" ref={mapRef}>
        <div className="map-grid" />{/* Alert zoom highlight */}
{focusedDroneId && drones.map(d => {
  if (d.id !== focusedDroneId) return null;
  return (
    <div
      key="focus"
      className="alert-focus-ring"
      style={{
        left: `${d.mapPos.x}%`,
        top: `${d.mapPos.y}%`,
      }}
    />
  );
})}

        {/* Restricted zone */}
        <div className="zone-box" style={{ left: "50%", top: "16%", width: "26%", height: "34%" }} />

        {/* Flight path trails */}
        <svg className="path-svg">
          {trails.map((pts, i) => (
            <polyline
              key={i}
              points={pts.join(" ")}
              fill="none"
              stroke={trailColors[i]}
              strokeWidth="1.2"
              strokeOpacity="0.35"
              strokeDasharray="4,4"
            />
          ))}
        </svg>

        {/* Threat markers */}
        {threatPositions.map((pos, i) => <ThreatMarker key={i} pos={pos} />)}

        {/* Drone markers */}
        {drones.map((d) => <DroneMarker key={d.id} drone={d} />)}

        {/* Legend */}
        <div className="map-legend">
          {[
            { color: "#22c55e",              label: "Operational" },
            { color: "#ff9500",              label: "Warning"     },
            { color: "#ef4444",              label: "Threat / POI" },
            { color: "rgba(239,68,68,.3)",   label: "Restricted",  dashed: true },
          ].map(({ color, label, dashed }) => (
            <div className="leg-row" key={label}>
              <div className="leg-dot" style={{ background: color, border: dashed ? "1px dashed #ef4444" : "none" }} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="map-coords">34°01'N 77°34'E · LADAKH SECTOR</div>
      </div>
    </div>
  );
}
