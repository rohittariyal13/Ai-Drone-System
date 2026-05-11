import { useState, useEffect } from "react";
import { DRONES } from "../constants/data";

export function useDroneSimulator() {
  const [drones, setDrones] = useState(DRONES);
  const [detections, setDetections] = useState({ "UAV-01": [], "UAV-02": [], "UAV-03": [] });

  useEffect(() => {
    // Telemetry WebSocket
    const ws = new WebSocket("ws://localhost:8000/ws/telemetry");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDrones((prev) =>
        prev.map((d) => {
          if (d.id !== data.drone_id) return d;
          return {
            ...d,
            battery: data.battery_pct,
            altitude: data.altitude_m,
            speed: data.speed_kmh,
            heading: data.heading,
            flightTimeRemaining: Math.round(data.estimated_flight_remaining_s / 60),
            gps: {
              ...d.gps,
              latD: data.lat,
              lngD: data.lng,
            },
          };
        })
      );
    };

    // Detections WebSocket
    const detWs = new WebSocket("ws://localhost:8000/ws/detections");
    detWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetections((prev) => ({
        ...prev,
        [data.drone_id]: data.detections,
      }));
    };

    ws.onerror = (e) => console.log("Telemetry WebSocket error:", e);
    detWs.onerror = (e) => console.log("Detection WebSocket error:", e);

    return () => {
      ws.close();
      detWs.close();
    };
  }, []);

  return { drones, detections };
}