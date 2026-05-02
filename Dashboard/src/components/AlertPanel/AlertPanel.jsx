import React, { useState, useEffect, useRef } from "react";
import { ALERTS } from "../../constants/data";
import "./AlertPanel.css";

const SEVERITY_ORDER = { CRITICAL: 0, WARNING: 1, INFO: 2 };

const playAlertBeep = (severity = "CRITICAL") => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const config = {
      CRITICAL: { beeps: 6, freq: 1100, duration: 0.15, gap: 0.12, gain: 0.4 },
      WARNING:  { beeps: 3, freq: 880,  duration: 0.12, gap: 0.15, gain: 0.3 },
      INFO:     { beeps: 1, freq: 660,  duration: 0.10, gap: 0.20, gain: 0.2 },
    };

    const { beeps, freq, duration, gap, gain } = config[severity] || config.CRITICAL;

    for (let i = 0; i < beeps; i++) {
      const startTime = ctx.currentTime + i * (duration + gap);
      const osc       = ctx.createOscillator();
      const gainNode  = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.frequency.value = freq;
      osc.type = "square";

      gainNode.gain.setValueAtTime(gain, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    }
  } catch (e) {
    console.warn("Audio playback failed:", e);
  }
};

export default function AlertPanel({ alerts = ALERTS, onAlertClick }) {
  const [acknowledged, setAcknowledged] = useState({});
  const [muted, setMuted]               = useState(false);

  const prevCriticalCount = useRef(0);
  const prevWarningCount  = useRef(0);

  const sorted = [...alerts].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 9) -
      (SEVERITY_ORDER[b.severity] ?? 9)
  );

  const criticalCount = alerts.filter(
    (a) => a.severity === "CRITICAL" && !acknowledged[a.id]
  ).length;

  const warningCount = alerts.filter(
    (a) => a.severity === "WARNING" && !acknowledged[a.id]
  ).length;

  // Beep on new CRITICAL alerts
  useEffect(() => {
    if (!muted && criticalCount > prevCriticalCount.current) {
      playAlertBeep("CRITICAL");
    }
    prevCriticalCount.current = criticalCount;
  }, [criticalCount, muted]);

  // Beep on new WARNING alerts
  useEffect(() => {
    if (!muted && warningCount > prevWarningCount.current) {
      playAlertBeep("WARNING");
    }
    prevWarningCount.current = warningCount;
  }, [warningCount, muted]);

  const handleAck = (id) => {
    setAcknowledged((prev) => ({ ...prev, [id]: true }));
  };

  const getColor = (severity) => {
    if (severity === "CRITICAL") return "#FF3B3B";
    if (severity === "WARNING")  return "#FF9500";
    return "#00FF88";
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">ALERT PANEL</span>
        <div className="alert-header-right">
          {criticalCount > 0 && (
            <span className="badge badge-red">{criticalCount} CRITICAL</span>
          )}
          <button
            className={`mute-btn ${muted ? "muted" : ""}`}
            onClick={() => setMuted((m) => !m)}
            title={muted ? "Unmute alerts" : "Mute alerts"}
          >
            {muted ? "🔇 MUTED" : "🔔 SOUND"}
          </button>
        </div>
      </div>

      <div className="alert-list">
        {sorted.map((a) => (
          <div
            className={`alert-item ${acknowledged[a.id] ? "acked" : ""}`}
            key={a.id}
            style={{ borderLeftColor: getColor(a.severity) }}
            onClick={() => onAlertClick && onAlertClick(a.drone_id)}
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
                <button
                  className="ack-btn"
                  onClick={(e) => { e.stopPropagation(); handleAck(a.id); }}
                >
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