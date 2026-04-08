import React from "react";
import { ALERTS, SEVERITY_MAP } from "../../constants/data";
import "./AlertPanel.css";

export default function AlertPanel({ alerts = ALERTS }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">ALERT PANEL</span>
        <span className="badge badge-red">{alerts.length} ACTIVE</span>
      </div>
      <div className="alert-list">
        {alerts.map((a) => {
          const s = SEVERITY_MAP[a.severity] || SEVERITY_MAP.green;
          return (
            <div className="alert-item" key={a.id}>
              <span className="alert-type" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                {a.type}
              </span>
              <div className="alert-msg">{a.message}</div>
              <span className="alert-time">{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
