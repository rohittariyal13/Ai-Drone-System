# TRISHUL SUDARSHAN NETRA
### Integrated Drone Surveillance & Threat Detection System
**Indian Armed Forces · DISC 14 · PS16 · Developed by Synqlr Private Limited**

---

## Quick Start

```bash
npm install
npm start
# Opens at http://localhost:3000
```

### If `npm install` fails with EACCES (macOS)

If you see an error mentioning `~/.npm/_cacache` permissions, install using a project-local cache:

```bash
npm install --cache ./.npm-cache
npm start --cache ./.npm-cache
```

---

## Publish to GitHub (so others can run it)

1) Create a new empty repository on GitHub (no README/license needed).

2) From this project folder, run:

```bash
git add -A
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_GIT_URL>
git push -u origin main
```

Then anyone can run:

```bash
git clone <YOUR_GITHUB_REPO_GIT_URL>
cd tsn-dashboard
npm install
npm start
```

---

## Full File Structure

```
tsn-dashboard/
├── public/
│   └── index.html
│
├── src/
│   ├── index.js                          # React entry point
│   ├── App.jsx                           # Root — assembles all panels
│   ├── App.css                           # Main layout grid
│   │
│   ├── styles/
│   │   └── global.css                    # All CSS variables + shared styles
│   │
│   ├── constants/
│   │   └── data.js                       # Drones, POI database, alerts, logs
│   │
│   ├── hooks/
│   │   ├── useClock.js                   # Live HH:MM:SS IST clock
│   │   ├── useDroneSimulator.js          # Live telemetry (replace with WebSocket)
│   │   ├── useCanvasFeed.js              # HTML5 Canvas drone camera renderer
│   │   └── useBoxAnimator.js            # AI detection box tracking jitter
│   │
│   └── components/
│       ├── TopBar/
│       │   ├── TopBar.jsx               # Logo · system name · clock · user
│       │   └── TopBar.css
│       │
│       ├── VideoFeeds/
│       │   ├── VideoFeeds.jsx           # 3-feed top row — defines box configs
│       │   ├── FeedBox.jsx              # Single feed: canvas + AI boxes + HUD
│       │   └── VideoFeeds.css
│       │
│       ├── Map/
│       │   ├── Map.jsx                  # Tactical map · drone markers · trails · threats
│       │   └── Map.css
│       │
│       ├── POIDatabase/
│       │   ├── POIDatabase.jsx          # Pre-op loaded suspect profiles
│       │   └── POIDatabase.css
│       │
│       ├── AlertPanel/
│       │   ├── AlertPanel.jsx           # Active alerts sorted by severity
│       │   └── AlertPanel.css
│       │
│       ├── HealthMonitor/
│       │   ├── HealthMonitor.jsx        # Battery · GPS · signal per drone
│       │   └── HealthMonitor.css
│       │
│       ├── FleetSummary/
│       │   ├── FleetSummary.jsx         # Operational/Warning/Critical/Lost counts
│       │   └── FleetSummary.css
│       │
│       ├── DetectionSummary/
│       │   ├── DetectionSummary.jsx     # POI/Suspect/Civilian/Animal counts
│       │   └── DetectionSummary.css
│       │
│       └── OperationalLog/
│           ├── OperationalLog.jsx       # Immutable timestamped event log
│           └── OperationalLog.css
│
└── package.json
```

---

## Detection Colour Code

| Colour | Type      | Meaning                              |
|--------|-----------|--------------------------------------|
| Red    | POI       | Confirmed match from POI database    |
| Orange | SUSPECT   | Unconfirmed — face covered / unknown |
| Green  | CIVILIAN  | Non-threatening person               |
| Blue   | VEHICLE   | Car / truck / jeep / motorcycle      |
| Purple | ANIMAL    | Animal detected                      |

---

## Connect Real Data (Production)

In `src/hooks/useDroneSimulator.js`, replace the simulation with:

```js
const ws = new WebSocket("wss://your-backend/drone-telemetry");
ws.onmessage = (e) => setDrones(JSON.parse(e.data).drones);
```

In `src/constants/data.js`, replace `POI_DATABASE` with your pre-op loaded
profiles from the mission briefing system.

---

## Face Covered / Beard Detection

The system handles face-covered terrorists using:
- **Gait recognition** — how the person walks
- **Body shape matching** — height, build, shoulder width
- **Thermal fusion** (Phase 3) — heat signatures through clothing
- **Behavioural analysis** — crouching, sudden direction change

These are shown in UAV-03 feed with "GAIT ANALYSIS RUNNING" overlay.

---

**JAI HIND · SYNQLR PRIVATE LIMITED · CHANDIGARH**
