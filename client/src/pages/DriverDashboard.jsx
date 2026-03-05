import { useEffect, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import { Clock, CheckCircle, Bell, Thermometer, Droplets, Wind } from "lucide-react";
import styles from "./dashboard.module.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ROUTE_COORDS = [
  [3.1682, 101.6985],
  [3.1720, 101.7050],
  [3.1760, 101.7130],
  [3.1810, 101.7220],
  [3.1860, 101.7300],
  [3.1900, 101.7370],
];

const STATUS_BADGES = {
  "Not Started": "badge badge-orange",
  "In Progress": "badge badge-blue",
  "Complete":    "badge badge-green",
};

const PLACEHOLDER_ALERTS = [
  { id: 1, priority: "High",   message: "Temperature spike detected",  ref: "TRK-A12" },
  { id: 2, priority: "Medium", message: "Humidity above threshold",    ref: "TRK-B07" },
  { id: 3, priority: "Low",    message: "Signal drop",                 ref: "TRK-C03" },
];

const ALERT_BADGE = {
  High:   "badge badge-red",
  Medium: "badge badge-orange",
  Low:    "badge badge-gray",
};

const DUMMY_DELIVERIES = [
  { _id: "d1", CreatedAt: "2025-03-01T08:20:00Z", DelID: "DEL-001", DelRetID: { RetName: "FreshMart Chow Kit" }, Status: "In Progress", DelBatchID: [{ _id: "b1", Category: "Chicken" }] },
  { _id: "d2", CreatedAt: "2025-03-02T09:45:00Z", DelID: "DEL-002", DelRetID: { RetName: "Aeon Wangsa Maju" },   Status: "Not Started", DelBatchID: [{ _id: "b2", Category: "Beef" }] },
  { _id: "d3", CreatedAt: "2025-03-03T11:30:00Z", DelID: "DEL-003", DelRetID: { RetName: "Mydin Selayang" },     Status: "Not Started", DelBatchID: [{ _id: "b3", Category: "Lamb" }] },
];

const thStyle = {
  textAlign: "left",
  padding: "8px 14px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "10px 14px",
  borderBottom: "1px solid #f3f4f6",
  color: "#111827",
  verticalAlign: "middle",
};

function badgeFor(status) {
  return STATUS_BADGES[status] ?? "badge badge-gray";
}

export default function DriverDashboard() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: true }).setView([3.178, 101.718], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    L.polyline(ROUTE_COORDS, { color: "#2563eb", weight: 4, opacity: 0.85 }).addTo(map);
    L.marker(ROUTE_COORDS[0]).addTo(map).bindPopup("<b>Pickup</b><br>Chow Kit, KL");
    L.marker(ROUTE_COORDS[ROUTE_COORDS.length - 1]).addTo(map).bindPopup("<b>Delivery</b><br>FreshMart, Wangsa Maju");
    mapInstanceRef.current = map;
  }, []);

  const counts = {
    "Not Started": DUMMY_DELIVERIES.filter((d) => d.Status === "Not Started").length,
    "In Progress": DUMMY_DELIVERIES.filter((d) => d.Status === "In Progress").length,
    "Complete":    DUMMY_DELIVERIES.filter((d) => d.Status === "Complete").length,
  };

  return (
    <main>
      <TopBar title="Dashboard" />

      <div style={{ padding: "16px 24px" }}>
        {/* All stat cards in one row */}
        <div className={styles.statsGrid} style={{ gridTemplateColumns: "repeat(3, 1fr) 1px repeat(3, 1fr)" }}>
          <div className={`card ${styles.statCard} ${styles.statCardOrange}`}>
            <div className="card-icon orange"><Clock size={16} /></div>
            <div>
              <div className={styles.statNumber}>{counts["Not Started"]}</div>
              <div className={styles.statLabel}>Not Started</div>
            </div>
          </div>

          <div className={`card ${styles.statCard} ${styles.statCardBlue}`}>
            <div className="card-icon blue"><Clock size={16} /></div>
            <div>
              <div className={styles.statNumber}>{counts["In Progress"]}</div>
              <div className={styles.statLabel}>In Progress</div>
            </div>
          </div>

          <div className={`card ${styles.statCard} ${styles.statCardGreen}`}>
            <div className="card-icon green"><CheckCircle size={16} /></div>
            <div>
              <div className={styles.statNumber}>{counts["Complete"]}</div>
              <div className={styles.statLabel}>Complete</div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ background: "#e5e7eb", alignSelf: "stretch", margin: "0 4px" }} />

          <div className={`card ${styles.statCard}`} style={{ borderLeft: "4px solid #2563eb" }}>
            <div className="card-icon blue"><Thermometer size={16} /></div>
            <div>
              <div className={styles.statNumber}>4.2°C</div>
              <div className={styles.statLabel}>Temperature</div>
            </div>
          </div>

          <div className={`card ${styles.statCard}`} style={{ borderLeft: "4px solid #0891b2" }}>
            <div className="card-icon blue"><Droplets size={16} /></div>
            <div>
              <div className={styles.statNumber}>78%</div>
              <div className={styles.statLabel}>Humidity</div>
            </div>
          </div>

          <div className={`card ${styles.statCard}`} style={{ borderLeft: "4px solid #6b7280" }}>
            <div className="card-icon" style={{ background: "#f3f4f6", color: "#6b7280" }}><Wind size={16} /></div>
            <div>
              <div className={styles.statNumber}>12 ppm</div>
              <div className={styles.statLabel}>Gas Level</div>
            </div>
          </div>
        </div>

        {/* Main content: left (table + alerts), right (map) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "16px", alignItems: "start" }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>

            {/* Deliveries table */}
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="card-title">My Deliveries</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Date & Time</th>
                    <th style={thStyle}>Delivery ID</th>
                    <th style={thStyle}>Retailer</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Product</th>
                  </tr>
                </thead>
                <tbody>
                  {DUMMY_DELIVERIES.map((del) => (
                    <>
                      <tr
                        key={del._id}
                        onClick={() => setExpandedId(expandedId === del._id ? null : del._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td style={tdStyle}>{new Date(del.CreatedAt).toLocaleString()}</td>
                        <td style={tdStyle}>{del.DelID}</td>
                        <td style={tdStyle}>{del.DelRetID?.RetName}</td>
                        <td style={tdStyle}>
                          <span className={badgeFor(del.Status)}>{del.Status}</span>
                        </td>
                        <td style={tdStyle}>
                          {del.DelBatchID?.filter((b) => b.Category).map((b) => (
                            <span key={b._id} className="badge badge-blue">{b.Category}</span>
                          ))}
                        </td>
                      </tr>
                      {expandedId === del._id && (
                        <tr key={del._id + "-actions"}>
                          <td colSpan={5} style={{ padding: "8px 14px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button className="btn btn-primary" style={{ fontSize: 14, padding: "8px 0", width: 108 }}>
                                Accept
                              </button>
                              <button className="btn btn-primary" style={{ fontSize: 14, padding: "8px 0", width: 108, background: "#16a34a", borderColor: "#16a34a" }}>
                                Complete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alerts */}
            <div className="card" style={{ marginBottom: 0 }}>
              <h2 className="card-title">
                <div className="card-icon orange"><Bell size={16} /></div>
                Alerts
              </h2>
              {PLACEHOLDER_ALERTS.map((alert) => (
                <div key={alert.id} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span className={ALERT_BADGE[alert.priority]}>{alert.priority}</span>
                    <span style={{ color: "#6b7280" }}>{alert.ref}</span>
                  </div>
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right column: map */}
          <div className="card" style={{ marginBottom: 0, overflow: "hidden", minWidth: 0 }}>
            <h2 className="card-title">Active Route</h2>
            <div ref={mapRef} style={{ height: 480, width: "100%", borderRadius: 6, overflow: "hidden" }} />
          </div>

        </div>
      </div>
    </main>
  );
}
