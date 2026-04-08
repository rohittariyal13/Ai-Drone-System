import React from "react";
import { POI_DATABASE } from "../../constants/data";
import "./POIDatabase.css";

const STATUS_MAP = {
  DETECTED:  { label: "DETECTED",  cls: "poi-detected"  },
  TRACKING:  { label: "TRACKING",  cls: "poi-tracking"  },
  NOT_SEEN:  { label: "NOT SEEN",  cls: "poi-clear"     },
};

const AVATAR_COLORS = {
  high:   { bg: "rgba(239,68,68,.2)",  border: "rgba(239,68,68,.4)",  text: "#ef4444" },
  medium: { bg: "rgba(255,149,0,.2)",  border: "rgba(255,149,0,.4)",  text: "#ff9500" },
  low:    { bg: "rgba(34,197,94,.15)", border: "rgba(34,197,94,.3)",  text: "#22c55e" },
};

export default function POIDatabase({ profiles = POI_DATABASE }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">POI DATABASE · PRE-OP LOADED</span>
        <span className="badge badge-blue">{profiles.length} PROFILES</span>
      </div>
      <div className="poi-list">
        {profiles.map((p) => {
          const av = AVATAR_COLORS[p.threat] || AVATAR_COLORS.low;
          const st = STATUS_MAP[p.status]    || STATUS_MAP.NOT_SEEN;
          return (
            <div className="poi-row" key={p.id}>
              <div
                className="poi-avatar"
                style={{ background: av.bg, border: `1px solid ${av.border}`, color: av.text }}
              >
                {p.code}
              </div>
              <div className="poi-info">
                <div className="poi-name">{p.id} · {p.label}</div>
                <div className="poi-meta">Age {p.age} · {p.height} · {p.build}</div>
                <div className="poi-match" style={{ color: av.text }}>{p.matchMethod}</div>
              </div>
              <span className={`poi-status ${st.cls}`}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
