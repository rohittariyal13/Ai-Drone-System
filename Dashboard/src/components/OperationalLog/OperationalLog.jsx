import React from "react";
import { LOG_ENTRIES } from "../../constants/data";
import "./OperationalLog.css";

export default function OperationalLog({ entries = LOG_ENTRIES }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">OPERATIONAL LOG</span>
        <span className="badge badge-green">IMMUTABLE</span>
      </div>
      <div className="log-list">
        {entries.map((e, i) => (
          <div className="log-row" key={i}>
            <span className="log-time">{e.time}</span>
            <span className={`log-event log-${e.type}`}>{e.event}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
