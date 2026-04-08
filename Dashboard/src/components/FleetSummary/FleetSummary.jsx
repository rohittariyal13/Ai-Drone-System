import React from "react";
import "./FleetSummary.css";

export default function FleetSummary({ drones }) {
  const op  = drones.filter((d) => d.status === "operational").length;
  const war = drones.filter((d) => d.status === "warning").length;
  const crt = drones.filter((d) => d.status === "critical").length;
  const lst = drones.filter((d) => d.status === "lost").length;

  // POI + suspect counts (hardcoded for prototype — connect to detection engine in production)
  const cards = [
    { val: op,  label: "ACTIVE",    cls: "fn-green"  },
    { val: war, label: "WARNING",   cls: "fn-orange" },
    { val: crt, label: "CRITICAL",  cls: "fn-red"    },
    { val: lst, label: "LOST",      cls: "fn-dim"    },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">FLEET STATUS</span>
        <span className="badge badge-blue">{drones.length} TOTAL</span>
      </div>
      <div className="fleet-grid">
        {cards.map(({ val, label, cls }) => (
          <div className="fleet-card" key={label}>
            <div className={`fleet-num ${cls}`}>{val}</div>
            <div className="fleet-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
