 import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ALERTS, LOG_ENTRIES, EVENT_LABELS } from "../../constants/data";

const MISSION_START = "2026-05-01T08:00:00Z";
const MISSION_END   = "2026-05-01T14:32:11Z";

const formatTime = (iso) => new Date(iso).toLocaleTimeString("en-IN", {
  hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
});

const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", {
  day: "2-digit", month: "short", year: "numeric",
});

const SORT_FIELDS = ["time", "drone_id", "event_type", "type"];

const FormationHQReport = ({ drones }) => {
  const [sortField, setSortField]   = useState("time");
  const [sortDir,   setSortDir]     = useState("desc");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const allEvents = useMemo(() => {
    return LOG_ENTRIES.map((e) => ({
      ...e,
      source: "LOG",
    }));
  }, []);

  const filteredEvents = useMemo(() => {
    let events = [...allEvents];
    if (typeFilter !== "ALL") {
      events = events.filter((e) => e.event_type === typeFilter);
    }
    events.sort((a, b) => {
      const va = a[sortField] || "";
      const vb = b[sortField] || "";
      return sortDir === "asc"
        ? va.localeCompare(vb)
        : vb.localeCompare(va);
    });
    return events;
  }, [allEvents, sortField, sortDir, typeFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const missionDuration = useMemo(() => {
    const start = new Date(MISSION_START);
    const end   = new Date(MISSION_END);
    const diff  = Math.floor((end - start) / 1000);
    const h     = Math.floor(diff / 3600);
    const m     = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m`;
  }, []);

  const exportPDF = () => {
    const doc      = new jsPDF();
    const dateStr  = new Date().toISOString().slice(0, 10);

    // Header
    doc.setFillColor(10, 14, 26);
    doc.rect(0, 0, 210, 50, "F");
    doc.setTextColor(255, 149, 0);
    doc.setFontSize(14);
    doc.setFont("courier", "bold");
    doc.text("TRISHUL SUDARSHAN NETRA", 14, 14);
    doc.setTextColor(200, 210, 244);
    doc.setFontSize(9);
    doc.setFont("courier", "normal");
    doc.text("Indian Armed Forces · DISC 14 · PS16", 14, 22);
    doc.text("FORMATION HQ — MISSION REPORT", 14, 29);
    doc.text(`Mission Date: ${formatDate(MISSION_START)}`, 14, 36);
    doc.text(`Duration: ${missionDuration}`, 14, 43);
    doc.setTextColor(107, 122, 168);
    doc.setFontSize(8);
    doc.text(`Drones: ${drones?.length || 3}`, 150, 29);
    doc.text(`Total Events: ${allEvents.length}`, 150, 36);
    doc.text(`Total Alerts: ${ALERTS.length}`, 150, 43);

    // Mission Summary Table
    doc.setTextColor(255, 149, 0);
    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text("MISSION SUMMARY", 14, 60);

    autoTable(doc, {
      startY: 64,
      head: [["METRIC", "VALUE"]],
      body: [
        ["Mission Start",        formatTime(MISSION_START)],
        ["Mission End",          formatTime(MISSION_END)],
        ["Duration",             missionDuration],
        ["Drones Deployed",      String(drones?.length || 3)],
        ["Total Events",         String(allEvents.length)],
        ["Total Alerts",         String(ALERTS.length)],
        ["Critical Alerts",      String(ALERTS.filter((a) => a.severity === "CRITICAL").length)],
        ["Warning Alerts",       String(ALERTS.filter((a) => a.severity === "WARNING").length)],
        ["POI Matches",          String(ALERTS.filter((a) => a.type === "THREAT").length)],
        ["Suspects Flagged",     String(ALERTS.filter((a) => a.type === "SUSPECT").length)],
      ],
      styles: {
        fontSize: 8,
        font: "courier",
        textColor: [200, 210, 244],
        fillColor: [13, 18, 37],
        lineColor: [30, 45, 90],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [11, 16, 32],
        textColor: [255, 149, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [10, 14, 26] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 80 },
      },
    });

    // Event Log Table
    const afterSummary = doc.lastAutoTable.finalY + 10;
    doc.setTextColor(255, 149, 0);
    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text("OPERATIONAL EVENT LOG", 14, afterSummary);

    autoTable(doc, {
      startY: afterSummary + 4,
      head: [["Time", "Drone ID", "Event Type", "Event", "Location"]],
      body: filteredEvents.map((e) => [
        e.time,
        e.drone_id,
        EVENT_LABELS[e.event_type] || e.event_type,
        e.event,
        e.location,
      ]),
      styles: {
        fontSize: 7,
        font: "courier",
        textColor: [200, 210, 244],
        fillColor: [13, 18, 37],
        lineColor: [30, 45, 90],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [11, 16, 32],
        textColor: [255, 149, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [10, 14, 26] },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 22 },
        2: { cellWidth: 32 },
        3: { cellWidth: 75 },
        4: { cellWidth: 38 },
      },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(107, 122, 168);
      doc.text(
        "CLASSIFIED · FOR AUTHORIZED PERSONNEL ONLY",
        14,
        doc.internal.pageSize.height - 8
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        180,
        doc.internal.pageSize.height - 8
      );
    }

    doc.save(`TSN_MissionReport_${dateStr}.pdf`);
  };

  const sortArrow = (field) => {
    if (sortField !== field) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="fhq-panel fhq-report">
      <div className="fhq-panel-header">
        <span className="fhq-panel-title">BASIC REPORTING TOOLS</span>
        <button className="fhq-report-export-btn" onClick={exportPDF}>
          ↓ EXPORT MISSION REPORT PDF
        </button>
      </div>

      {/* Mission Summary */}
      <div className="fhq-report-summary">
        <div className="fhq-report-summary-grid">
          <div className="fhq-report-stat">
            <span className="fhq-report-stat-value">{formatDate(MISSION_START)}</span>
            <span className="fhq-report-stat-label">MISSION DATE</span>
          </div>
          <div className="fhq-report-stat">
            <span className="fhq-report-stat-value">{formatTime(MISSION_START)}</span>
            <span className="fhq-report-stat-label">START TIME</span>
          </div>
          <div className="fhq-report-stat">
            <span className="fhq-report-stat-value">{formatTime(MISSION_END)}</span>
            <span className="fhq-report-stat-label">END TIME</span>
          </div>
          <div className="fhq-report-stat">
            <span className="fhq-report-stat-value">{missionDuration}</span>
            <span className="fhq-report-stat-label">DURATION</span>
          </div>
          <div className="fhq-report-stat">
            <span className="fhq-report-stat-value">{drones?.length || 3}</span>
            <span className="fhq-report-stat-label">DRONES DEPLOYED</span>
          </div>
          <div className="fhq-report-stat">
            <span className="fhq-report-stat-value">{allEvents.length}</span>
            <span className="fhq-report-stat-label">TOTAL EVENTS</span>
          </div>
          <div className="fhq-report-stat red">
            <span className="fhq-report-stat-value">
              {ALERTS.filter((a) => a.severity === "CRITICAL").length}
            </span>
            <span className="fhq-report-stat-label">CRITICAL ALERTS</span>
          </div>
          <div className="fhq-report-stat orange">
            <span className="fhq-report-stat-value">
              {ALERTS.filter((a) => a.severity === "WARNING").length}
            </span>
            <span className="fhq-report-stat-label">WARNINGS</span>
          </div>
        </div>
      </div>

      {/* Sortable Event Table */}
      <div className="fhq-report-table-controls">
        <span className="fhq-report-table-label">
          EVENT LOG — {filteredEvents.length} RECORDS
        </span>
        <select
          className="fhq-report-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Event Types</option>
          <option value="LAUNCHED">Drone Launched</option>
          <option value="DETECTION_MADE">Detection Made</option>
          <option value="ALERT_TRIGGERED">Alert Triggered</option>
          <option value="ZONE_BREACH">Zone Breach</option>
          <option value="DRONE_LOST">Drone Lost</option>
        </select>
      </div>

      <div className="fhq-report-table-wrap">
        <table className="fhq-report-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("time")}>
                TIME{sortArrow("time")}
              </th>
              <th onClick={() => handleSort("drone_id")}>
                DRONE{sortArrow("drone_id")}
              </th>
              <th onClick={() => handleSort("event_type")}>
                EVENT TYPE{sortArrow("event_type")}
              </th>
              <th>EVENT</th>
              <th>LOCATION</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((entry) => (
              <tr key={entry.id}>
                <td className="fhq-report-time">{entry.time}</td>
                <td className="fhq-report-drone">{entry.drone_id}</td>
                <td className="fhq-report-type">
                  {EVENT_LABELS[entry.event_type] || entry.event_type}
                </td>
                <td className="fhq-report-event">{entry.event}</td>
                <td className="fhq-report-location">{entry.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormationHQReport;
