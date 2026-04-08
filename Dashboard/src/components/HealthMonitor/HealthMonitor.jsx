import React from "react";
import "./HealthMonitor.css";

function SignalBars({ strength }) {
  const active = Math.round((strength / 100) * 4);
  return (
    <div className="sig-bars">
      {[5, 8, 12, 16].map((h, i) => (
        <div key={i} className={`sig-bar ${i < active ? "sig-on" : ""}`} style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

function BattBar({ pct }) {
  const cls = pct > 50 ? "batt-high" : pct > 25 ? "batt-mid" : "batt-low";
  return (
    <div>
      <div className="batt-track">
        <div className={`batt-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <div className={`batt-text ${cls}`}>
        {Math.round(pct)}% · {Math.round(pct * 0.22)}min{pct < 30 ? " !" : ""}
      </div>
    </div>
  );
}

export default function HealthMonitor({ drones }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">DRONE HEALTH MONITOR</span>
        <span className="badge badge-green">LIVE</span>
      </div>
      <div className="health-col-labels">
        <span>ID</span><span>BATTERY</span><span>LINK</span>
      </div>
      <div className="health-rows">
        {drones.map((d) => (
          <div className="health-row" key={d.id}>
            <span className="drone-id" style={{ color: d.status === "warning" ? "var(--orange)" : "var(--blue)" }}>
              {d.id}
            </span>
            <BattBar pct={d.battery} />
            <SignalBars strength={d.link} />
          </div>
        ))}
      </div>
    </div>
  );
}
