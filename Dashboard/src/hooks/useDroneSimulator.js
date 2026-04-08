/* ================================================================
   useDroneSimulator
   Simulates live telemetry. In production replace setInterval
   with:  const ws = new WebSocket("wss://backend/telemetry")
          ws.onmessage = (e) => setDrones(JSON.parse(e.data).drones)
   ================================================================ */
import { useState, useEffect, useRef } from "react";
import { DRONES } from "../constants/data";

export function useDroneSimulator() {
  const [drones, setDrones] = useState(DRONES);
  const t = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      t.current += 0.022;
      const tick = t.current;

      setDrones((prev) =>
        prev.map((d, i) => {
          const offsets = [
            { x: Math.sin(tick * 0.7) * 8,  y: Math.cos(tick * 0.5) * 7  },
            { x: Math.cos(tick * 0.6) * 9,  y: Math.sin(tick * 0.8) * 7  },
            { x: Math.sin(tick * 0.9) * 6,  y: Math.cos(tick * 0.4) * 6  },
          ];
          const base = [
            { x: 28, y: 42 },
            { x: 54, y: 34 },
            { x: 72, y: 57 },
          ];

          // Drain UAV-02 battery slowly for demo
          const battery = d.id === "UAV-02"
            ? Math.max(4, d.battery - 0.002)
            : d.battery;

          return {
            ...d,
            battery,
            flightTimeRemaining: Math.round(battery * 0.22),
            speed: 28 + Math.round(Math.random() * 14),
            mapPos: {
              x: base[i].x + offsets[i].x,
              y: base[i].y + offsets[i].y,
            },
          };
        })
      );
    }, 120);

    return () => clearInterval(id);
  }, []);

  return drones;
}
