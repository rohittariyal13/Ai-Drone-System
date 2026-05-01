import { useMemo, useState } from "react";
import {
  LOG_ENTRIES,
  EVENT_TYPES,
  EVENT_LABELS,
  SEVERITY_MAP,
} from "../../constants/data";
import "./OperationalLog.css";

const TYPE_TO_SEVERITY = {
  err: "red",
  warn: "orange",
  ok: "green",
  info: "blue",
};

const OperationalLog = ({ entries = LOG_ENTRIES, onEntryClick }) => {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const ta = a.timestamp || a.time;
      const tb = b.timestamp || b.time;
      return tb.localeCompare(ta);
    });
  }, [entries]);

  const visibleEntries = useMemo(() => {
    return sortedEntries.filter((entry) => {
      if (filter !== "ALL" && entry.event_type !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          (entry.drone_id || "").toLowerCase().includes(q) ||
          (entry.event || "").toLowerCase().includes(q) ||
          (entry.location || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sortedEntries, filter, search]);

  const handleClick = (entry) => {
    if (onEntryClick) onEntryClick(entry);
  };

  const exportCSV = () => {
    const headers = ["Time", "Drone ID", "Event Type", "Event", "Location"];
    const rows = sortedEntries.map((entry) => [
      entry.time,
      entry.drone_id,
      EVENT_LABELS[entry.event_type] || entry.event_type,
      `"${(entry.event || "").replace(/"/g, '""')}"`,
      `"${(entry.location || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TSN_OperationalLog_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="op-log-panel">
      <div className="op-log-header">
        <div className="op-log-title-row">
          <h2 className="op-log-title">OPERATIONAL LOG</h2>
          <span
            className="op-log-immutable-badge"
            title="Append-only · entries cannot be edited or deleted"
          >
            ● IMMUTABLE
          </span>
        </div>
        <div className="op-log-meta-row">
          <span className="op-log-meta">
            {visibleEntries.length} of {sortedEntries.length} events
          </span>
          <button className="op-log-export-btn" onClick={exportCSV}>
            ↓ EXPORT CSV
          </button>
        </div>
      </div>

      <div className="op-log-controls">
        <input
          type="text"
          className="op-log-search"
          placeholder="Search drone, location, event…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="op-log-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Events</option>
          {Object.values(EVENT_TYPES).map((t) => (
            <option key={t} value={t}>
              {EVENT_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="op-log-list">
        {visibleEntries.length === 0 ? (
          <div className="op-log-empty">
            No events match the current filter.
          </div>
        ) : (
          visibleEntries.map((entry) => {
            const sevKey = TYPE_TO_SEVERITY[entry.type] || "blue";
            const sev = SEVERITY_MAP[sevKey];
            return (
              <div
                key={entry.id}
                className="op-log-entry"
                style={{ borderLeftColor: sev.color }}
                onClick={() => handleClick(entry)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleClick(entry);
                }}
              >
                <div className="op-log-entry-top">
                  <span
                    className="op-log-event-type"
                    style={{ color: sev.color }}
                  >
                    {EVENT_LABELS[entry.event_type] || entry.event_type}
                  </span>
                  <span className="op-log-time">{entry.time}</span>
                </div>
                <div className="op-log-entry-message">{entry.event}</div>
                <div className="op-log-entry-bottom">
                  <span className="op-log-drone-id">{entry.drone_id}</span>
                  <span className="op-log-location">{entry.location}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OperationalLog;