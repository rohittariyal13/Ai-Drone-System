from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model(
    source="D:/Ai-Drone-System/backend/Stream/drone.mp4",
    stream=True,
    save=True,
    conf=0.3
)

for r in results:
    if len(r.boxes) > 0:
        print(f"Frame detected: {r.boxes.cls} confidence: {r.boxes.conf}")