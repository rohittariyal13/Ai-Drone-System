from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid

class DroneTelemetry(BaseModel):
    drone_id: str
    timestamp: datetime
    lat: float
    lng: float
    altitude_m: float
    heading: float
    speed_kmh: float
    battery_pct: float
    battery_drain_rate: float
    gps_sats: int
    hdop: float
    link_quality: float
    flight_mode: str
    flight_time_s: int
    estimated_flight_remaining_s: int

class AIDetection(BaseModel):
    detection_id: str = str(uuid.uuid4())
    drone_id: str
    timestamp: datetime
    class_name: str
    confidence: float
    lat: float
    lng: float
    bbox_x: float
    bbox_y: float
    bbox_w: float
    bbox_h: float
    stationary_duration_s: int = 0
    alert_triggered: bool = False

class HealthAlert(BaseModel):
    alert_id: str = str(uuid.uuid4())
    drone_id: str
    timestamp: datetime
    alert_type: str
    severity: str
    message: str
    value: float
    threshold: float
    acknowledged: bool = False
    