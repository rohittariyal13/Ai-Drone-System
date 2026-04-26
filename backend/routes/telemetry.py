import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.broadcaster import telemetry_manager, alert_manager
from services.simulator import simulate_drones

router = APIRouter()
simulator_started = False

@router.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    global simulator_started
    await telemetry_manager.connect(websocket)

    # Start simulator only once on first connection
    if not simulator_started:
        asyncio.create_task(simulate_drones())
        simulator_started = True
        print("Drone simulator started")

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        telemetry_manager.disconnect(websocket)

@router.websocket("/ws/alerts")
async def alerts_websocket(websocket: WebSocket):
    await alert_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        alert_manager.disconnect(websocket)