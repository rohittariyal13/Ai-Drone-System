import React from "react";
import TopBar           from "./components/TopBar/TopBar";
import VideoFeeds       from "./components/VideoFeeds/VideoFeeds";
import Map              from "./components/Map/Map";
import HealthMonitor    from "./components/HealthMonitor/HealthMonitor";
import AlertPanel       from "./components/AlertPanel/AlertPanel";
import FleetSummary     from "./components/FleetSummary/FleetSummary";
import DetectionSummary from "./components/DetectionSummary/DetectionSummary";
import OperationalLog   from "./components/OperationalLog/OperationalLog";
import POIDatabase      from "./components/POIDatabase/POIDatabase";
import { useDroneSimulator } from "./hooks/useDroneSimulator";
import "./App.css";

export default function App() {
  const drones = useDroneSimulator();
  const [focusedDroneId, setFocusedDroneId] = React.useState(null);
  const [focusedFeedId, setFocusedFeedId] = React.useState(null);

  return (
    <div className="app">
      {/* — Top Navigation Bar — */}
      <TopBar />

      <div className="dashboard-body">
        {/* Row 1: 3 Live Video Feeds */}
        <VideoFeeds drones={drones} focusedFeedId={focusedFeedId} />

        {/* Row 2: Map + Right Panels */}
        <div className="bottom-row">

          {/* Left column */}
          <div className="left-col">
            <Map drones={drones} focusedDroneId={focusedDroneId} />
            <div className="summary-row">
              <FleetSummary     drones={drones} />
              <DetectionSummary />
            </div>
            <OperationalLog
  onEntryClick={(entry) => {
    setFocusedDroneId(entry.drone_id);
    setFocusedFeedId(entry.drone_id);
  }}
/>
          </div>

          {/* Right column */}
          <div className="right-col">
            <POIDatabase />
            <AlertPanel onAlertClick={(droneId) => { setFocusedDroneId(droneId); setFocusedFeedId(droneId); }} />
            <HealthMonitor drones={drones} />
          </div>

        </div>
      </div>
    </div>
  );
}