import React from "react";
import { useClock } from "../../hooks/useClock";
import "./TopBar.css";

export default function TopBar({ activeView, onViewChange, wsConnected = true }) {
  const time = useClock();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-logo">TRISHUL SUDARSHAN NETRA</span>
        <span className="topbar-sub">
          INDIAN ARMED FORCES · DISC 14 · PS16
        </span>
      </div>

      <div className="topbar-tabs">
        <button
          className={`topbar-tab ${activeView === "tactical" ? "active" : ""}`}
          onClick={() => onViewChange("tactical")}
        >
          TACTICAL VIEW
        </button>
        <button
          className={`topbar-tab ${activeView === "formation" ? "active" : ""}`}
          onClick={() => onViewChange("formation")}
        >
          FORMATION HQ
        </button>
      </div>

      <div className="topbar-right">
        <div className="topbar-status">
          <span className="status-dot" />
          <span className="status-text">ACTIVE</span>
        </div>
        <div className="ws-status">
          <span
            className="ws-dot"
            style={{ background: wsConnected ? "#22c55e" : "#ef4444" }}
          />
          <span
            className="ws-label"
            style={{ color: wsConnected ? "#22c55e" : "#ef4444" }}
          >
            {wsConnected ? "WS LIVE" : "WS OFF"}
          </span>
        </div>
        <span className="topbar-clock">{time}</span>
        <span className="topbar-user">RITWIK · DEV</span>
      </div>
    </header>
  );
}