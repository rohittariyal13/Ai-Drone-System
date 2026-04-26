import React, { useRef } from "react";
import { useCanvasFeed } from "../../hooks/useCanvasFeed";
import { useBoxAnimator } from "../../hooks/useBoxAnimator";
import { useClock } from "../../hooks/useClock";
import "./VideoFeeds.css";

/* AI detection box colours per target type */
const BOX_STYLES = {
  POI:       { border: "#ef4444", label: "#ef4444", labelText: "#fff" },
  SUSPECT:   { border: "#ff9500", label: "#ff9500", labelText: "#000" },
  CIVILIAN:  { border: "#22c55e", label: "#22c55e", labelText: "#000" },
  GROUP:     { border: "#22c55e", label: "#22c55e", labelText: "#000" },
  VEHICLE:   { border: "#4a9eff", label: "#4a9eff", labelText: "#000" },
  ANIMAL:    { border: "#a78bfa", label: "#a78bfa", labelText: "#1e1040" },
  THREAT:    { border: "#ef4444", label: "#ef4444", labelText: "#fff" },
};

function AIBox({ box }) {
  const style = BOX_STYLES[box.type] || BOX_STYLES.CIVILIAN;
  const isPOI     = box.type === "POI";
  const isSuspect = box.type === "SUSPECT";

  return (
    <div
      className={`ai-box ${isPOI ? "ai-box-poi" : isSuspect ? "ai-box-suspect" : ""}`}
      style={{
        left:   `${box.left}%`,
        top:    `${box.top}%`,
        width:  `${box.width}%`,
        height: `${box.height}%`,
        borderColor: style.border,
      }}
    >
      {isPOI ? (
        <>
          <div className="ai-label-poi-top" style={{ background: style.label, color: style.labelText }}>
            !! POI MATCH · {box.label}
          </div>
          <div className="ai-label-poi-bot" style={{ background: "rgba(239,68,68,.85)", color: "#fff" }}>
            CONF: {box.conf}% · WANTED
          </div>
        </>
      ) : (
        <div className="ai-label" style={{ background: style.label, color: style.labelText }}>
          {box.label}
        </div>
      )}

      {isSuspect && box.gait && (
        <div className="gait-note">{box.gait}</div>
      )}
    </div>
  );
}

export default function FeedBox({ drone, scene, boxes: initialBoxes, headerBadge, confirmAlert, highlighted }) {
  const canvasRef = useRef(null);
  useCanvasFeed(canvasRef, scene);
  const boxes = useBoxAnimator(initialBoxes);
  const time  = useClock();

  return (
    <div className="feed-wrap" style={{ border: highlighted ? "2px solid #FF3B3B" : "2px solid transparent", transition: "border 0.3s" }}>
      <div className="feed-header">
        <span className="feed-title">{drone.id} · LIVE · {headerBadge.text}</span>
        <div className="feed-meta">
          <span className={`badge ${headerBadge.cls}`}>{headerBadge.label}</span>
          <span className="badge badge-red feed-rec">● REC</span>
        </div>
      </div>

      <div className="feed-box">
        <canvas ref={canvasRef} className="feed-canvas" />

        <div className="scanline" />

        <div className="rec-badge">
          <span className="rec-dot" />REC
        </div>

        <div className="hud-tl">
          <span className="hud-pill">ALT: {drone.altitude}m</span>
          <span className={`hud-pill ${drone.battery < 30 ? "hud-red" : "hud-green"}`}>
            {drone.battery < 30 ? `BATT: ${Math.round(drone.battery)}% !` : `GPS: ${drone.gps.sats} SAT`}
          </span>
        </div>

        <svg className="crosshair" width="28" height="28" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,149,0,0.45)" strokeWidth="0.8" />
          <line x1="14" y1="0"  x2="14" y2="7"  stroke="rgba(255,149,0,0.45)" strokeWidth="0.8" />
          <line x1="14" y1="21" x2="14" y2="28" stroke="rgba(255,149,0,0.45)" strokeWidth="0.8" />
          <line x1="0"  y1="14" x2="7"  y2="14" stroke="rgba(255,149,0,0.45)" strokeWidth="0.8" />
          <line x1="21" y1="14" x2="28" y2="14" stroke="rgba(255,149,0,0.45)" strokeWidth="0.8" />
          <circle cx="14" cy="14" r="1.5" fill="rgba(255,149,0,0.6)" />
        </svg>

        {boxes.map((box, i) => <AIBox key={i} box={box} />)}

        {confirmAlert && (
          <div className="confirm-overlay">
            <div className="confirm-banner">THREAT CONFIRMED · ALERTING</div>
          </div>
        )}

        <div className="hud-bottom">
          <span>{drone.gps.lat} {drone.gps.lng}</span>
          <span>{time}</span>
          <span>HDG: {drone.heading}°</span>
          <span>{Math.round(drone.battery)}% BATT</span>
        </div>
      </div>
    </div>
  );
}