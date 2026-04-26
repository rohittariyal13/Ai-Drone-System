import React, { useState } from "react";
import { ALERTS } from "../../constants/data";
import "./AlertPanel.css";

const SEVERITY_ORDER = { CRITICAL: 0, WARNING: 1, INFO: 2 };

export default function AlertPanel({ alerts = ALERTS }) {
  const [acknowledged, setAcknowledged] = useState({});

  const sorted = [...alerts].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 9) -
      (SEVERITY_ORDER[b.severity] ?? 9)
  );

  const criticalCount = alerts.filter(
    (a) => a.severity === "CRITICAL" && !acknowledged[a.id]
  ).length;

  const handleAck = (id) => {
    setAcknowledged((prev) => ({ ...prev, [id]: true }));
  };

  const getColor = (severity) => {
    if (severity === "CRITICAL") return "#FF3B3B";
    if (severity === "WARNING") return "#FF9500";
    return "#00FF88";
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">ALERT PANEL</span>
        {criticalCount > 0 && (
          <span className="badge badge-red">{criticalCount} CRITICAL</span>
        )}
      </div>

      <div className="alert-list">
        {sorted.map((a) => (
          <div
            className={`alert-item ${acknowledged[a.id] ? "acked" : ""}`}
            key={a.id}
            style={{ borderLeftColor: getColor(a.severity) }}
          >
            <div className="alert-top-row">
              <span className="alert-sev" style={{ color: getColor(a.severity) }}>
                ● {a.severity}
              </span>
              <span className="alert-type-badge">{a.type}</span>
            </div>

            <div className="alert-msg">{a.message}</div>

            <div className="alert-meta">
              <span>UAV · {a.drone_id}</span>
              <span>📍 {a.location}</span>
            </div>

            <div className="alert-footer-row">
              <span className="alert-time">{a.time}</span>
              {!acknowledged[a.id] ? (
                <button className="ack-btn" onClick={() => handleAck(a.id)}>
                  ACK
                </button>
              ) : (
                <span className="ack-label">ACKNOWLEDGED</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}