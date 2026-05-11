import React from "react";
import FeedBox from "./FeedBox";

/* ── Video URLs from backend ── */
const VIDEO_URLS = {
  "UAV-01": "http://localhost:8000/video/drone.mp4",
  "UAV-02": "http://localhost:8000/video/drone1.mp4",
  "UAV-03": "http://localhost:8000/video/drone2.mp4",
};

/* ── Convert real YOLOv8 detections to FeedBox box format ── */
function convertDetections(detections) {
  if (!detections || detections.length === 0) return [];
  return detections.map((d) => ({
    type: d.class_name === "person" ? "CIVILIAN"
        : d.class_name === "car" || d.class_name === "truck" || d.class_name === "bus" ? "VEHICLE"
        : d.class_name === "motorcycle" ? "VEHICLE"
        : "ANIMAL",
    label: `${d.class_name.toUpperCase()} ${d.confidence}%`,
    conf: d.confidence,
    left: d.x,
    top: d.y,
    width: d.width,
    height: d.height,
    dx: 0,
    dy: 0,
  }));
}

export default function VideoFeeds({ drones, detections }) {
  const [d1, d2, d3] = drones;

  const boxes1 = convertDetections(detections?.["UAV-01"]);
  const boxes2 = convertDetections(detections?.["UAV-02"]);
  const boxes3 = convertDetections(detections?.["UAV-03"]);

  return (
    <div className="feeds-row">
      <FeedBox
        drone={d1}
        scene={{ videoUrl: VIDEO_URLS["UAV-01"] }}
        boxes={boxes1}
        headerBadge={{ text: "AI THREAT DETECTION", label: boxes1.length > 0 ? "DETECTION ACTIVE" : "SCANNING", cls: boxes1.length > 0 ? "badge-red" : "badge-green" }}
        confirmAlert={false}
      />
      <FeedBox
        drone={d2}
        scene={{ videoUrl: VIDEO_URLS["UAV-02"] }}
        boxes={boxes2}
        headerBadge={{ text: "MULTI-TARGET TRACK", label: boxes2.length > 0 ? "DETECTION ACTIVE" : "SCANNING", cls: boxes2.length > 0 ? "badge-red" : "badge-green" }}
        confirmAlert={false}
      />
      <FeedBox
        drone={d3}
        scene={{ videoUrl: VIDEO_URLS["UAV-03"] }}
        boxes={boxes3}
        headerBadge={{ text: "PERIMETER WATCH", label: boxes3.length > 0 ? "DETECTION ACTIVE" : "SCANNING", cls: boxes3.length > 0 ? "badge-red" : "badge-green" }}
        confirmAlert={false}
      />
    </div>
  );
}