from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.telemetry import router as telemetry_router

app = FastAPI(
    title="TSN Backend",
    description="Synqlr TSN — Trishul Sudarshan Netra — Drone Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry_router)

@app.get("/")
async def root():
    return {
        "status": "ok",
        "system": "TSN",
        "version": "1.0.0"
    }