/* ================================================================
   TRISHUL SUDARSHAN NETRA — Static Data & Configuration
   Replace simulation values with real WebSocket data in production
   ================================================================ */

export const DRONES = [
  {
    id: "UAV-01",
    status: "operational",
    battery: 78,
    altitude: 320,
    speed: 34,
    heading: 247,
    gps: { lat: "34°01'22\"N", lng: "77°34'18\"E", sats: 12 },
    link: 100,
    flightTimeRemaining: 42,
    mapPos: { x: 28, y: 42 },
  },
  {
    id: "UAV-02",
    status: "warning",
    battery: 28,
    altitude: 410,
    speed: 38,
    heading: 312,
    gps: { lat: "34°01'18\"N", lng: "77°34'02\"E", sats: 9 },
    link: 60,
    flightTimeRemaining: 6,
    mapPos: { x: 54, y: 34 },
  },
  {
    id: "UAV-03",
    status: "operational",
    battery: 65,
    altitude: 280,
    speed: 41,
    heading: 178,
    gps: { lat: "34°01'30\"N", lng: "77°34'44\"E", sats: 11 },
    link: 80,
    flightTimeRemaining: 28,
    mapPos: { x: 72, y: 57 },
  },
];

export const POI_DATABASE = [
  {
    id: "SALIM-002",
    code: "S02",
    label: "HIGH VALUE TARGET",
    age: "~35",
    height: "5'8\"",
    build: "Heavy build · Known beard",
    status: "DETECTED",          // DETECTED | TRACKING | NOT_SEEN
    confidence: 91,
    detectedBy: "UAV-01",
    matchMethod: "GAIT MATCH + BODY SHAPE · CONF 91%",
    threat: "high",
  },
  {
    id: "UNKNOWN-X01",
    code: "X01",
    label: "FACE COVERED",
    age: "~28-35",
    height: "5'6\"",
    build: "Medium build",
    status: "TRACKING",
    confidence: null,
    detectedBy: "UAV-03",
    matchMethod: "GAIT ANALYSIS RUNNING · UAV-03",
    threat: "medium",
  },
  {
    id: "RAZA-003",
    code: "R03",
    label: "ASSOCIATE",
    age: "~42",
    height: "5'10\"",
    build: "Thin build",
    status: "NOT_SEEN",
    confidence: null,
    detectedBy: null,
    matchMethod: "NOT DETECTED IN CURRENT FEEDS",
    threat: "low",
  },
];

export const ALERTS = [
  {
    id: 1,
    type: "THREAT",
    severity: "CRITICAL",
    drone_id: "UAV-01",
    location: "34°01'22\"N 77°34'18\"E",
    message: "POI MATCH · SALIM-002 detected · Conf 91% · Gait+body match",
    time: "14:32",
  },
  {
    id: 2,
    type: "SUSPECT",
    severity: "CRITICAL",
    drone_id: "UAV-03",
    location: "34°01'30\"N 77°34'44\"E",
    message: "Face-covered individual · Gait analysis · Movement anomaly detected",
    time: "14:31",
  },
  {
    id: 3,
    type: "BATTERY",
    severity: "WARNING",
    drone_id: "UAV-02",
    location: "34°01'18\"N 77°34'02\"E",
    message: "Battery 28% · ~6 min flight time · Recall recommended",
    time: "14:30",
  },
  {
    id: 4,
    type: "ZONE",
    severity: "WARNING",
    drone_id: "UAV-01",
    location: "34°01'22\"N 77°34'18\"E",
    message: "Unidentified vehicle (truck) approaching restricted zone",
    time: "14:28",
  },
];

export const LOG_ENTRIES = [
  { time: "14:32:11", event: "UAV-01 · POI MATCH · SALIM-002 · conf 91%",     type: "err"  },
  { time: "14:31:44", event: "UAV-03 · Face-covered suspect flagged",           type: "warn" },
  { time: "14:30:55", event: "UAV-02 · Battery critical alert fired",           type: "warn" },
  { time: "14:28:44", event: "UAV-01 · Vehicle (truck) detected · conf 93%",   type: "ok"   },
  { time: "14:26:10", event: "UAV-02 · Group of 4 persons detected",            type: "ok"   },
  { time: "14:22:05", event: "UAV-03 · Animal detected · conf 84%",             type: "info" },
  { time: "14:10:00", event: "All systems · Flight ops commenced",              type: "ok"   },
];

export const SEVERITY_MAP = {
  red:    { color: "#ef4444", bg: "rgba(239,68,68,.15)",  border: "rgba(239,68,68,.35)"  },
  orange: { color: "#ff9500", bg: "rgba(255,149,0,.15)",  border: "rgba(255,149,0,.35)"  },
  green:  { color: "#22c55e", bg: "rgba(34,197,94,.15)",  border: "rgba(34,197,94,.35)"  },
  blue:   { color: "#4a9eff", bg: "rgba(74,158,255,.15)", border: "rgba(74,158,255,.35)" },
};
