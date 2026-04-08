import React from "react";
import "./DetectionSummary.css";

export default function DetectionSummary() {
  /* In production these counts come from the AI detection engine via WebSocket */
  const counts = [
    { val: 1, label: "POI MATCH",  cls: "ds-red"    },
    { val: 1, label: "SUSPECT",    cls: "ds-orange"  },
    { val: 6, label: "CIVILIAN",   cls: "ds-green"   },
    { val: 1, label: "ANIMAL",     cls: "ds-purple"  },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">DETECTION SUMMARY</span>
        <span className="badge badge-orange">LIVE</span>
      </div>
      <div className="ds-grid">
        {counts.map(({ val, label, cls }) => (
          <div className="ds-card" key={label}>
            <div className={`ds-num ${cls}`}>{val}</div>
            <div className="ds-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
