import { useState, useEffect, useRef } from "react";
import { ALERTS } from "../constants/data";

const WS_URL = "ws://localhost:8000/ws/alerts";

const mapAlert = (raw) => ({
  id: `ws-${raw.drone_id}-${Date.now()}`,
  type: raw.alert_type,
  severity: raw.severity,
  drone_id: raw.drone_id,
  location: "LIVE",
  message: raw.message,
  time: new Date(raw.timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
});

export function useAlertSocket() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useRef(() => {});

  connect.current = () => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[useAlertSocket] Connected to ws/alerts");
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          const mapped = mapAlert(raw);
          setAlerts((prev) => {
            const isDuplicate = prev.some(
              (a) =>
                a.drone_id === mapped.drone_id &&
                a.type === mapped.type &&
                Math.abs(Date.now() - parseInt(a.id.split("-")[2] || 0)) < 5000
            );
            if (isDuplicate) return prev;
            return [mapped, ...prev].slice(0, 20);
          });
        } catch (e) {
          console.warn("[useAlertSocket] Parse error:", e);
        }
      };

      ws.onerror = (e) => {
        console.warn("[useAlertSocket] WebSocket error:", e);
      };

      ws.onclose = () => {
        setConnected(false);
        console.log("[useAlertSocket] Disconnected — reconnecting in 3s");
        reconnectTimer.current = setTimeout(() => connect.current(), 3000);
      };
    } catch (e) {
      console.warn("[useAlertSocket] Connection failed:", e);
      reconnectTimer.current = setTimeout(() => connect.current(), 3000);
    }
  };

  useEffect(() => {
    connect.current();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  return { alerts, connected };
}