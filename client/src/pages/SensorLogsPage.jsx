import { useState } from "react";
import TopBar from "../components/TopBar";
import { Thermometer, Droplets, FlaskConical, Truck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./dashboard.module.css";

const DUMMY_TRUCKS = [
  { id: "del-001", truckId: "TRK-001" },
  { id: "del-002", truckId: "TRK-002" },
  { id: "del-003", truckId: "TRK-003" },
];

const DUMMY_DELIVERY_INFO = {
  "del-001": { delId: "DEL-001", driver: "Ahmad Fariz",    retailer: "FreshMart KL",  status: "In Progress" },
  "del-002": { delId: "DEL-002", driver: "Hafiz Rahman",   retailer: "HalalHub PJ",   status: "In Progress" },
  "del-003": { delId: "DEL-003", driver: "Zulkifli Azman", retailer: "MyMeat Cheras", status: "In Progress" },
};

const DUMMY_SENSOR_DATA = {
  "del-001": [
    { time: "08:00", Temperature: 3.2, Humidity: 78, NH3: 8,  H2S: 0.4 },
    { time: "08:15", Temperature: 3.5, Humidity: 77, NH3: 9,  H2S: 0.5 },
    { time: "08:30", Temperature: 3.1, Humidity: 79, NH3: 11, H2S: 0.4 },
    { time: "08:45", Temperature: 3.8, Humidity: 76, NH3: 10, H2S: 0.6 },
    { time: "09:00", Temperature: 4.0, Humidity: 75, NH3: 13, H2S: 0.7 },
    { time: "09:15", Temperature: 3.7, Humidity: 77, NH3: 12, H2S: 0.6 },
  ],
  "del-002": [
    { time: "07:30", Temperature: 2.8, Humidity: 82, NH3: 22, H2S: 0.9 },
    { time: "07:45", Temperature: 3.0, Humidity: 81, NH3: 24, H2S: 1.1 },
    { time: "08:00", Temperature: 2.9, Humidity: 83, NH3: 26, H2S: 1.3 },
    { time: "08:15", Temperature: 3.2, Humidity: 80, NH3: 28, H2S: 1.5 },
    { time: "08:30", Temperature: 3.4, Humidity: 79, NH3: 27, H2S: 1.4 },
  ],
  "del-003": [
    { time: "09:00", Temperature: 4.5, Humidity: 72, NH3: 38, H2S: 2.8 },
    { time: "09:15", Temperature: 4.3, Humidity: 74, NH3: 41, H2S: 3.1 },
    { time: "09:30", Temperature: 4.1, Humidity: 75, NH3: 43, H2S: 3.4 },
    { time: "09:45", Temperature: 4.6, Humidity: 73, NH3: 45, H2S: 3.6 },
  ],
};

function nh3Badge(val) {
  if (val < 25)  return <span className="badge badge-green">Normal</span>;
  if (val <= 40) return <span className="badge badge-orange">Elevated</span>;
  return <span className="badge badge-red">High</span>;
}

function h2sBadge(val) {
  if (val < 1)  return <span className="badge badge-green">Normal</span>;
  if (val <= 3) return <span className="badge badge-orange">Elevated</span>;
  return <span className="badge badge-red">High</span>;
}

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
  fontSize: "13px",
};

export default function SensorLogsPage() {
  const [selected, setSelected] = useState(null);

  const logs = selected ? DUMMY_SENSOR_DATA[selected.id] : [];
  const latest = logs[logs.length - 1] ?? null;
  const delivery = selected ? DUMMY_DELIVERY_INFO[selected.id] : null;

  return (
    <main>
      <TopBar title="Sensor Logs" />

      <div style={{ padding: "16px 24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Left: Truck list */}
        <div style={{ width: "240px", flexShrink: 0 }}>
          <div className="card" style={{ padding: "12px" }}>
            <div className="card-title" style={{ marginBottom: "10px" }}>Active Trucks</div>
            {DUMMY_TRUCKS.map((truck) => {
              const isSelected = selected?.id === truck.id;
              return (
                <button
                  key={truck.id}
                  onClick={() => setSelected(truck)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "10px 12px",
                    marginBottom: "6px",
                    border: isSelected ? "1.5px solid #2563eb" : "1.5px solid #e5e7eb",
                    borderRadius: "8px",
                    background: isSelected ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: isSelected ? "600" : "400",
                    color: isSelected ? "#2563eb" : "#111827",
                    fontFamily: "inherit",
                  }}
                >
                  <Truck size={14} />
                  {truck.truckId}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sensor panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selected && (
            <div className="card" style={{ color: "#6b7280", fontSize: "14px" }}>
              Select a truck to view sensor data.
            </div>
          )}

          {selected && (
            <>
              {/* Delivery info panel */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: "12px" }}>Delivery Info</div>
                <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "3px" }}>Delivery ID</div>
                    <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>{delivery.delId}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "3px" }}>Driver</div>
                    <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>{delivery.driver}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "3px" }}>Retailer</div>
                    <div style={{ fontSize: "14px", color: "#111827", fontWeight: "500" }}>{delivery.retailer}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "3px" }}>Status</div>
                    <span className="badge badge-blue">{delivery.status}</span>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className={styles.statsGrid} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div className={`card ${styles.statCard} ${styles.statCardOrange}`}>
                  <div className="card-icon orange">
                    <Thermometer size={16} />
                  </div>
                  <div>
                    <div className={styles.statNumber}>{latest ? `${latest.Temperature}°C` : "—"}</div>
                    <div className={styles.statLabel}>Temperature</div>
                  </div>
                </div>

                <div className={`card ${styles.statCard} ${styles.statCardBlue}`}>
                  <div className="card-icon blue">
                    <Droplets size={16} />
                  </div>
                  <div>
                    <div className={styles.statNumber}>{latest ? `${latest.Humidity}%` : "—"}</div>
                    <div className={styles.statLabel}>Humidity</div>
                  </div>
                </div>

                {/* Gas levels card */}
                <div className={`card ${styles.statCard}`} style={{ borderLeft: "4px solid #7c3aed", alignItems: "flex-start", gap: "10px" }}>
                  <div className="card-icon purple" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <FlaskConical size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.statLabel} style={{ marginBottom: "8px", fontWeight: "600", color: "#374151" }}>Gas Levels</div>
                    {latest ? (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>Ammonia &nbsp;<strong style={{ color: "#111827" }}>{latest.NH3} ppm</strong></span>
                          {nh3Badge(latest.NH3)}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>Hydrogen Sulfide &nbsp;<strong style={{ color: "#111827" }}>{latest.H2S} ppm</strong></span>
                          {h2sBadge(latest.H2S)}
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: "13px", color: "#6b7280" }}>—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: "16px" }}>
                  Sensor History — {selected.truckId}
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={logs} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Temperature" stroke="#f97316" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="Humidity"    stroke="#2563eb" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Raw readings table */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: "12px" }}>Reading History</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Time</th>
                      <th style={thStyle}>Temperature</th>
                      <th style={thStyle}>Humidity</th>
                      <th style={thStyle}>Ammonia (ppm)</th>
                      <th style={thStyle}>Hydrogen Sulfide (ppm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...logs].reverse().map((row, i) => (
                      <tr key={i}>
                        <td style={tdStyle}>{row.time}</td>
                        <td style={tdStyle}>{row.Temperature}°C</td>
                        <td style={tdStyle}>{row.Humidity}%</td>
                        <td style={tdStyle}>{row.NH3}</td>
                        <td style={tdStyle}>{row.H2S}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
