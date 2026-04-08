import React from "react";
import { useClock } from "../../hooks/useClock";
import "./TopBar.css";

export default function TopBar() {
  const time = useClock();
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-logo">TRISHUL SUDARSHAN NETRA</span>
        <span className="topbar-sub">
          POI THREAT DETECTION · INDIAN ARMED FORCES · DISC 14 · PS16
        </span>
      </div>
      <div className="topbar-right">
        <div className="topbar-status">
          <span className="status-dot" />
          <span className="status-text">THREAT DETECTION ACTIVE</span>
        </div>
        <span className="topbar-clock">{time}</span>
        <span className="topbar-user">MOHIT · DASHBOARD LEAD</span>
      </div>
    </header>
  );
}
