import asyncio
import math
from datetime import datetime, timezone
from models.drone import DroneTelemetry, HealthAlert
from services.broadcaster import telemetry_manager, alert_manager

# Three drones starting positions over Ladakh
DRONES = {
    "UAV-01": {"lat": 34.1526, "lng": 77.5619, "alt": 320, "battery": 78.0, "heading": 45},
    "UAV-02": {"lat": 34.1680, "lng": 77.5800, "alt": 410, "battery": 27.0, "heading": 120},
    "UAV-03": {"lat": 34.1400, "lng": 77.5400, "alt": 280, "battery": 65.0, "heading": 270},
}

async def simulate_drones():
    tick = 0
    while True:
        tick += 1
        for drone_id, state in DRONES.items():

            # Move drone slightly each tick
            state["lat"] += math.sin(tick * 0.1) * 0.0002
            state["lng"] += math.cos(tick * 0.1) * 0.0002

            # Drain battery — faster at high altitude (Ladakh effect)
            altitude_factor = 1.0 + (state["alt"] - 300) / 1000
            drain_rate = 0.05 * altitude_factor
            state["battery"] = max(0, state["battery"] - drain_rate)

            # Calculate estimated flight time remaining
            est_remaining = int(state["battery"] / drain_rate) if drain_rate > 0 else 999

            telemetry = DroneTelemetry(
                drone_id=drone_id,
                timestamp=datetime.now(timezone.utc),
                lat=state["lat"],
                lng=state["lng"],
                altitude_m=state["alt"],
                heading=state["heading"],
                speed_kmh=25.0,
                battery_pct=round(state["battery"], 1),
                battery_drain_rate=round(drain_rate, 3),
                gps_sats=12 if drone_id != "UAV-02" else 7,
                hdop=1.2 if drone_id != "UAV-02" else 2.8,
                link_quality=95.0 if drone_id != "UAV-02" else 55.0,
                flight_mode="AUTO",
                flight_time_s=tick * 2,
                estimated_flight_remaining_s=est_remaining,
            )

            await telemetry_manager.broadcast(telemetry.model_dump(mode='json'))

            # Fire alert when battery critical
            if state["battery"] < 25.0:
                alert = HealthAlert(
                    drone_id=drone_id,
                    timestamp=datetime.now(timezone.utc),
                    alert_type="BATTERY_CRITICAL",
                    severity="CRITICAL",
                    message=f"{drone_id} battery at {state['battery']:.0f}% — recall immediately.",
                    value=round(state["battery"], 1),
                    threshold=25.0
                )
                await alert_manager.broadcast(alert.model_dump(mode='json'))

        await asyncio.sleep(0.5)