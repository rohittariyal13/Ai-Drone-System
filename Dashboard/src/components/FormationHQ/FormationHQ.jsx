import { useMemo } from "react";
import { ALERTS, LOG_ENTRIES, EVENT_LABELS, SEVERITY_MAP } from "../../constants/data";
import FormationHQCharts from "./FormationHQCharts";
import "./FormationHQ.css";

const TYPE_TO_SEVERITY = {
  err: "red",
  warn: "orange",
  ok: "green",
  info: "blue",
};

const FormationHQ = ({ drones }) => {
  const alertHistory = useMemo(() => {
    return [...ALERTS].sort((a, b) => b.time.localeCompare(a.time));
  }, []);

  const logHistory = useMemo(() => {
    return [...LOG_ENTRIES].sort((a, b) => b.time.localeCompare(a.time));
  }, []);

  const detectionTotals = useMemo(() => {
    return {
      poi: ALERTS.filter((a) => a.type === "THREAT").length,
      suspect: ALERTS.filter((a) => a.type === "SUSPECT").length,
      warning: ALERTS.filter((a) => a.severity === "WARNING").length,
      critical: ALERTS.filter((a) => a.severity === "CRITICAL").length,
    };
  }, []);

  const missionZones = [
    { id: "RZ-01", name: "Forward Base Alpha",    status: "CLEAR",  drones: ["UAV-01"] },
    { id: "RZ-02", name: "Sector 7-North",        status: "ACTIVE", drones: ["UAV-03"] },
    { id: "RZ-03", name: "Restricted Zone Delta", status: "BREACH", drones: ["UAV-02"] },
    { id: "RZ-04", name: "Perimeter Watch South", status: "CLEAR",  drones: [] },
  ];

  const zoneColors = {
    CLEAR:  "#22c55e",
    ACTIVE: "#ff9500",
    BREACH: "#ef4444",
  };

  const statusColors = {
    operational: "#22c55e",
    warning:     "#ff9500",
    critical:    "#ef4444",
    lost:        "#6b7aa8",
  };

  return (
    <div className="fhq-container">

      {/* Header */}
      <div className="fhq-header">
        <div className="fhq-header-left">
          <span className="fhq-title">FORMATION HQ</span>
          <span className="fhq-subtitle">BRIGADE LEVEL · LADAKH SECTOR · DISC 14 PS16</span>
        </div>
        <div className="fhq-header-right">
          <span className="fhq-badge green">● SYSTEMS NOMINAL</span>
          <span className="fhq-badge orange">{drones?.length || 3} DRONES ACTIVE</span>
          <span className="fhq-badge red">{detectionTotals.critical} CRITICAL</span>
        </div>
      </div>

      {/* Row 1: Drone Fleet + Detection Summary + Zone Status */}
      <div className="fhq-row">

        {/* Drone Fleet Table */}
        <div className="fhq-panel fhq-fleet">
          <div className="fhq-panel-header">
            <span className="fhq-panel-title">DRONE FLEET — ALL UNITS IN SECTOR</span>
            <span className="fhq-panel-count">{drones?.length || 3} TOTAL</span>
          </div>
          <table className="fhq-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>STATUS</th>
                <th>BATTERY</th>
                <th>ALT</th>
                <th>SPEED</th>
                <th>LINK</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {(drones || []).map((drone) => (
                <tr key={drone.id}>
                  <td className="fhq-drone-id">{drone.id}</td>
                  <td>
                    <span
                      className="fhq-status-badge"
                      style={{ color: statusColors[drone.status] || "#6b7aa8" }}
                    >
                      ● {drone.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="fhq-battery-bar">
                      <div
                        className="fhq-battery-fill"
                        style={{
                          width: `${Math.round(drone.battery)}%`,
                          background:
                            drone.battery > 50
                              ? "#22c55e"
                              : drone.battery > 20
                              ? "#ff9500"
                              : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="fhq-battery-pct">{Math.round(drone.battery)}%</span>
                  </td>
                  <td>{drone.altitude}m</td>
                  <td>{drone.speed}kph</td>
                  <td>{drone.link}%</td>
                  <td>{drone.flightTimeRemaining}min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column — Detection Summary + Zone Status */}
        <div className="fhq-right-col">

          {/* Detection Summary */}
          <div className="fhq-panel fhq-detection">
            <div className="fhq-panel-header">
              <span className="fhq-panel-title">AI DETECTION SUMMARY</span>
              <span className="fhq-live-badge">LIVE</span>
            </div>
            <div className="fhq-detection-grid">
              <div className="fhq-detection-card red">
                <span className="fhq-det-value">{detectionTotals.critical}</span>
                <span className="fhq-det-label">CRITICAL</span>
              </div>
              <div className="fhq-detection-card orange">
                <span className="fhq-det-value">{detectionTotals.warning}</span>
                <span className="fhq-det-label">WARNING</span>
              </div>
              <div className="fhq-detection-card red">
                <span className="fhq-det-value">{detectionTotals.poi}</span>
                <span className="fhq-det-label">POI MATCH</span>
              </div>
              <div className="fhq-detection-card orange">
                <span className="fhq-det-value">{detectionTotals.suspect}</span>
                <span className="fhq-det-label">SUSPECT</span>
              </div>
            </div>
          </div>

          {/* Mission Zone Status */}
          <div className="fhq-panel fhq-zones">
            <div className="fhq-panel-header">
              <span className="fhq-panel-title">MISSION ZONE STATUS</span>
            </div>
            <div className="fhq-zone-list">
              {missionZones.map((zone) => (
                <div key={zone.id} className="fhq-zone-row">
                  <div className="fhq-zone-left">
                    <span
                      className="fhq-zone-status-dot"
                      style={{ color: zoneColors[zone.status] }}
                    >
                      ●
                    </span>
                    <span className="fhq-zone-name">{zone.name}</span>
                  </div>
                  <div className="fhq-zone-right">
                    <span
                      className="fhq-zone-badge"
                      style={{
                        color: zoneColors[zone.status],
                        borderColor: zoneColors[zone.status],
                        background: `${zoneColors[zone.status]}15`,
                      }}
                    >
                      {zone.status}
                    </span>
                    <span className="fhq-zone-drones">
                      {zone.drones.length > 0 ? zone.drones.join(", ") : "UNASSIGNED"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: Alert History + Event Log */}
      <div className="fhq-row">

        {/* Alert History */}
        <div className="fhq-panel fhq-alerts">
          <div className="fhq-panel-header">
            <span className="fhq-panel-title">ALERT HISTORY</span>
            <span className="fhq-panel-count">{alertHistory.length} ALERTS</span>
          </div>
          <div className="fhq-scroll-list">
            {alertHistory.map((alert) => (
              <div
                key={alert.id}
                className="fhq-alert-row"
                style={{
                  borderLeftColor:
                    alert.severity === "CRITICAL" ? "#ef4444" : "#ff9500",
                }}
              >
                <div className="fhq-alert-top">
                  <span
                    className="fhq-alert-severity"
                    style={{
                      color:
                        alert.severity === "CRITICAL" ? "#ef4444" : "#ff9500",
                    }}
                  >
                    {alert.severity}
                  </span>
                  <span className="fhq-alert-time">{alert.time}</span>
                </div>
                <div className="fhq-alert-message">{alert.message}</div>
                <div className="fhq-alert-meta">
                  <span>{alert.drone_id}</span>
                  <span>{alert.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Event Log */}
        <div className="fhq-panel fhq-eventlog">
          <div className="fhq-panel-header">
            <span className="fhq-panel-title">OPERATIONAL EVENTS</span>
            <span className="fhq-panel-count">{logHistory.length} EVENTS</span>
          </div>
          <div className="fhq-scroll-list">
            {logHistory.map((entry) => {
              const sevKey = TYPE_TO_SEVERITY[entry.type] || "blue";
              const sev = SEVERITY_MAP[sevKey];
              return (
                <div
                  key={entry.id}
                  className="fhq-event-row"
                  style={{ borderLeftColor: sev.color }}
                >
                  <div className="fhq-event-top">
                    <span
                      className="fhq-event-type"
                      style={{ color: sev.color }}
                    >
                      {EVENT_LABELS[entry.event_type] || entry.event_type}
                    </span>
                    <span className="fhq-event-time">{entry.time}</span>
                  </div>
                  <div className="fhq-event-message">{entry.event}</div>
                  <div className="fhq-event-meta">
                    <span>{entry.drone_id}</span>
                    <span>{entry.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 3: Analytics Charts */}
      <FormationHQCharts
        drones={drones}
        alerts={ALERTS}
        logEntries={LOG_ENTRIES}
      />

    </div>
  );
};

export default FormationHQ;