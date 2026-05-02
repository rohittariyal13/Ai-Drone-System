import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const GRID_COLOR  = "#1b2a4a";
const TEXT_COLOR  = "#6b7aa8";
const ORANGE      = "#ff9500";
const RED         = "#ef4444";
const GREEN       = "#22c55e";
const BLUE        = "#4a9eff";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0f1628",
        border: "1px solid #1b2a4a",
        padding: "8px 12px",
        borderRadius: "3px",
        fontSize: "11px",
        color: "#cdd6f4",
        fontFamily: "'Courier New', monospace",
      }}>
        <div style={{ color: ORANGE, marginBottom: "4px", letterSpacing: "1px" }}>
          {label}
        </div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FormationHQCharts = ({ drones, alerts, logEntries }) => {

  // Chart 1 — Detections by Drone
  const detectionsByDrone = (drones || []).map((drone) => ({
    name: drone.id,
    detections: (logEntries || []).filter(
      (e) => e.drone_id === drone.id && e.event_type === "DETECTION_MADE"
    ).length,
    alerts: (alerts || []).filter((a) => a.drone_id === drone.id).length,
  }));

  // Chart 2 — Alerts by Severity
  const alertsBySeverity = [
    {
      name: "CRITICAL",
      count: (alerts || []).filter((a) => a.severity === "CRITICAL").length,
      color: RED,
    },
    {
      name: "WARNING",
      count: (alerts || []).filter((a) => a.severity === "WARNING").length,
      color: ORANGE,
    },
    {
      name: "INFO",
      count: (logEntries || []).filter((e) => e.type === "info").length,
      color: BLUE,
    },
  ];

  // Chart 3 — Battery Levels
  const batteryData = (drones || []).map((drone) => ({
    name: drone.id,
    battery: Math.round(drone.battery),
    color:
      drone.battery > 50 ? GREEN :
      drone.battery > 20 ? ORANGE : RED,
  }));

  return (
    <div className="fhq-charts-container">

      <div className="fhq-panel">
        <div className="fhq-panel-header">
          <span className="fhq-panel-title">ANALYTICS — MISSION OVERVIEW</span>
          <span className="fhq-live-badge">LIVE</span>
        </div>

        <div className="fhq-charts-grid">

          {/* Chart 1 — Detections & Alerts by Drone */}
          <div className="fhq-chart-box">
            <div className="fhq-chart-title">DETECTIONS & ALERTS BY DRONE</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={detectionsByDrone}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: TEXT_COLOR, fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: TEXT_COLOR, fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="detections" name="Detections" fill={BLUE}   radius={[2, 2, 0, 0]} />
                <Bar dataKey="alerts"     name="Alerts"     fill={ORANGE} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2 — Alerts by Severity */}
          <div className="fhq-chart-box">
            <div className="fhq-chart-title">ALERTS BY SEVERITY</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={alertsBySeverity}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: TEXT_COLOR, fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: TEXT_COLOR, fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count" radius={[2, 2, 0, 0]}>
                  {alertsBySeverity.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3 — Battery Levels */}
          <div className="fhq-chart-box">
            <div className="fhq-chart-title">DRONE BATTERY LEVELS (%)</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={batteryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: TEXT_COLOR, fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: TEXT_COLOR, fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="battery" name="Battery %" radius={[2, 2, 0, 0]}>
                  {batteryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FormationHQCharts;