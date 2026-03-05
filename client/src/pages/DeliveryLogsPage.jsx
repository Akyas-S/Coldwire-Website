import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import { Clock, Truck, CheckCircle } from "lucide-react";
import styles from "./dashboard.module.css";

const STATUS_BADGES = {
  "Not Started": "badge badge-orange",
  "In Progress": "badge badge-blue",
  "Complete":    "badge badge-green",
};

const TABS = ["All", "Not Started", "In Progress", "Complete"];


function labelFor(status) {
  return status;
}

function badgeFor(status) {
  return STATUS_BADGES[status] ?? "badge badge-gray";
}

function tabStyle(isActive) {
  return {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 4px",
    fontSize: "13px",
    fontWeight: isActive ? "600" : "400",
    color: isActive ? "#2563eb" : "#6b7280",
    borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
    fontFamily: "inherit",
    marginBottom: "-1px",
  };
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
  verticalAlign: "middle",
};

export default function DeliveryLogsPage() {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetch("/api/deliveries", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDeliveries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const counts = {
    "Not Started": deliveries.filter((d) => d.Status === "Not Started").length,
    "In Progress": deliveries.filter((d) => d.Status === "In Progress").length,
    "Complete":    deliveries.filter((d) => d.Status === "Complete").length,
  };

  const filtered =
    activeTab === "All" ? deliveries : deliveries.filter((d) => d.Status === activeTab);

  return (
    <main>
      <TopBar title="Delivery Logs" />

      <div style={{ padding: "16px 24px" }}>
        {/* Stat cards */}
        <div className={styles.statsGrid}>
          <div className={`card ${styles.statCard} ${styles.statCardOrange}`}>
            <div className="card-icon orange">
              <Clock size={16} />
            </div>
            <div>
              <div className={styles.statNumber}>{loading ? "—" : counts["Not Started"]}</div>
              <div className={styles.statLabel}>Not Started</div>
            </div>
          </div>

          <div className={`card ${styles.statCard} ${styles.statCardBlue}`}>
            <div className="card-icon blue">
              <Truck size={16} />
            </div>
            <div>
              <div className={styles.statNumber}>{loading ? "—" : counts["In Progress"]}</div>
              <div className={styles.statLabel}>In Progress</div>
            </div>
          </div>

          <div className={`card ${styles.statCard} ${styles.statCardGreen}`}>
            <div className="card-icon green">
              <CheckCircle size={16} />
            </div>
            <div>
              <div className={styles.statNumber}>{loading ? "—" : counts["Complete"]}</div>
              <div className={styles.statLabel}>Complete</div>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="card">
          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={tabStyle(tab === activeTab)}
              >
                {tab === "All" ? "All" : labelFor(tab)} (
                {tab === "All" ? deliveries.length : counts[tab]})
              </button>
            ))}
          </div>

          {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}

          {!loading && filtered.length === 0 && (
            <p style={{ color: "#6b7280" }}>No deliveries found.</p>
          )}

          {!loading && filtered.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Date & Time</th>
                  <th style={thStyle}>Delivery ID</th>
                  <th style={thStyle}>Driver</th>
                  <th style={thStyle}>Retailer</th>
                  <th style={thStyle}>Truck ID</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Batch ID</th>
                  <th style={thStyle}>Products</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((del) => (
                  <tr key={del._id}>
                    <td style={tdStyle}>
                      {new Date(del.CreatedAt).toLocaleString()}
                    </td>
                    <td style={tdStyle}>{del.DelID || "—"}</td>
                    <td style={tdStyle}>{del.DelUserID?.UserName || "—"}</td>
                    <td style={tdStyle}>{del.DelRetID?.RetName || "—"}</td>
                    <td style={tdStyle}>{del.DelTruckID?.TruckID || "—"}</td>
                    <td style={tdStyle}>
                      <span className={badgeFor(del.Status)}>
                        {labelFor(del.Status)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {del.DelBatchID?.length > 0
                          ? del.DelBatchID.map((b) => (
                              <span key={b._id} className="badge badge-gray">
                                {b.BatchID}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {del.DelBatchID?.filter((b) => b.Category).length > 0
                          ? del.DelBatchID
                              .filter((b) => b.Category)
                              .map((b) => (
                                <span key={b._id} className="badge badge-blue">
                                  {b.Category}
                                </span>
                              ))
                          : "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
