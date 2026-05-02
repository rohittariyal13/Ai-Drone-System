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
import FormationHQ      from "./components/FormationHQ/FormationHQ";
import { useDroneSimulator } from "./hooks/useDroneSimulator";
import { useAlertSocket }    from "./hooks/useAlertSocket";
import "./App.css";

export default function App() {
  const drones                    = useDroneSimulator();
  const { alerts, connected }     = useAlertSocket();
  const [focusedDroneId, setFocusedDroneId] = React.useState(null);
  const [focusedFeedId,  setFocusedFeedId]  = React.useState(null);
  const [activeView,     setActiveView]      = React.useState("tactical");

  return (
    <div className="app">
      <TopBar
        activeView={activeView}
        onViewChange={setActiveView}
        wsConnected={connected}
      />

      <div className="dashboard-body">
        {activeView === "tactical" ? (
          <>
            <VideoFeeds drones={drones} focusedFeedId={focusedFeedId} />
            <div className="bottom-row">
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
              <div className="right-col">
                <POIDatabase />
                <AlertPanel
                  alerts={alerts}
                  onAlertClick={(droneId) => {
                    setFocusedDroneId(droneId);
                    setFocusedFeedId(droneId);
                  }}
                />
                <HealthMonitor drones={drones} />
              </div>
            </div>
          </>
        ) : (
          <FormationHQ drones={drones} />
        )}
      </div>
    </div>
  );
}