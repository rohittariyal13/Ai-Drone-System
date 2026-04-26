import React from "react";
import FeedBox from "./FeedBox";

/* — Detection boxes per feed — */
const FEED1_BOXES = [
  { type: "POI",      label: "SALIN-002",            conf: 91, left: 22, top: 18, width: 15, height: 42, dx: 0.25, dy: 0.2  },
  { type: "CIVILIAN", label: "CIVILIAN 88%",                   left: 55, top: 30, width: 12, height: 35, dx: 0.4,  dy: 0.3  },
  { type: "VEHICLE",  label: "TRUCK 93%",                      left: 68, top: 50, width: 20, height: 25, dx: 0.5,  dy: 0.35 },
];

const FEED2_BOXES = [
  { type: "CIVILIAN", label: "PERSON 86%",  left: 18, top: 22, width: 11, height: 36, dx: 0.45, dy: 0.3  },
  { type: "CIVILIAN", label: "PERSON 79%",  left: 35, top: 28, width: 10, height: 32, dx: 0.38, dy: 0.32 },
  { type: "ANIMAL",   label: "ANIMAL 84%",  left: 62, top: 38, width: 18, height: 28, dx: 0.3,  dy: 0.25 },
  { type: "VEHICLE",  label: "JEEP 90%",    left: 52, top: 58, width: 28, height: 22, dx: 0.35, dy: 0.28 },
];

const FEED3_BOXES = [
  { type: "GROUP",   label: "GROUP x4 - 92%",                                         left: 10, top: 20, width: 32, height: 50, dx: 0.2,  dy: 0.15 },
  { type: "SUSPECT", label: "SUSPECT - FACE COVERED", gait: "GAIT ANALYSIS RUNNING...", left: 55, top: 18, width: 13, height: 42, dx: 0.42, dy: 0.3  },
  { type: "VEHICLE", label: "MOTORCYCLE 88%",                                          left: 70, top: 55, width: 22, height: 22, dx: 0.36, dy: 0.27 },
];

export default function VideoFeeds({ drones, focusedFeedId }) {
  const [d1, d2, d3] = drones;
  return (
    <div className="feeds-row">
      <FeedBox
        drone={d1}
        scene={1}
        boxes={FEED1_BOXES}
        headerBadge={{ text: "AI THREAT DETECTION", label: "POI DETECTED", cls: "badge-red" }}
        confirmAlert={true}
        highlighted={focusedFeedId === d1.id}
      />
      <FeedBox
        drone={d2}
        scene={2}
        boxes={FEED2_BOXES}
        headerBadge={{ text: "MULTI-TARGET TRACK", label: "AI ACTIVE", cls: "badge-green" }}
        confirmAlert={false}
        highlighted={focusedFeedId === d2.id}
      />
      <FeedBox
        drone={d3}
        scene={3}
        boxes={FEED3_BOXES}
        headerBadge={{ text: "PERIMETER WATCH", label: "SUSPECT FLAGGED", cls: "badge-orange" }}
        confirmAlert={false}
        highlighted={focusedFeedId === d3.id}
      />
    </div>
  );
}