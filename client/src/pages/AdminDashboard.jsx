import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  Bell,
  ClipboardList,
  MapPin,
  PieChart,
  CheckCircle,
  Clock,
} from "lucide-react";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import styles from "./dashboard.module.css";

function statusBadge(status) {
  if (status === "Complete") return <span className="badge badge-green">Delivered</span>;
  if (status === "In Progress") return <span className="badge badge-orange">In Transit</span>;
  return <span className="badge badge-gray">Pending</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="spinner" />;

  const totalCompleted = deliveries.filter((d) => d.Status === "Complete").length;
  const activeDeliveries = deliveries.filter((d) => d.Status === "In Progress").length;
  const inTransit = activeDeliveries;
  const pending = deliveries.filter((d) => d.Status === "Not Started").length;

  const recentDeliveries = [...deliveries]
    .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
    .slice(0, 5);

  return (
    <main>
      <TopBar title="Dashboard" />

      <div className={styles.pageWrapper}>

        {/* --- Stat Cards --- */}
        <div className={styles.statsGrid}>

          <div className={`card ${styles.statCardBlue}`}>
            <div className={styles.statCard}>
              <div className="card-icon blue">
                <Package size={16} />
              </div>
              <div>
                <div className={styles.statNumber}>—</div>
                <div className={styles.statLabel}>Total Batches</div>
              </div>
            </div>
          </div>

          <div className={`card ${styles.statCardGreen}`}>
            <div className={styles.statCard}>
              <div className="card-icon green">
                <CheckCircle size={16} />
              </div>
              <div>
                <div className={styles.statNumber}>{totalCompleted}</div>
                <div className={styles.statLabel}>Total Completed Deliveries</div>
              </div>
            </div>
          </div>

          <div className={`card ${styles.statCardOrange}`}>
            <div className={styles.statCard}>
              <div className="card-icon orange">
                <Truck size={16} />
              </div>
              <div>
                <div className={styles.statNumber}>{activeDeliveries}</div>
                <div className={styles.statLabel}>Active Deliveries</div>
              </div>
            </div>
          </div>

          <div className={`card ${styles.statCardRed}`}>
            <div className={styles.statCard}>
              <div className="card-icon red">
                <Bell size={16} />
              </div>
              <div>
                <div className={styles.statNumber}>—</div>
                <div className={styles.statLabel}>Pending Alerts</div>
              </div>
            </div>
          </div>

        </div>

        {/* Main column area */}
        <div className={styles.mainGrid}>

          {/* LEFT */}
          <div className={styles.leftColumn}>

            <div className="card">
              <div className="card-title">
                <div className="card-icon blue"><ClipboardList size={16} /></div>
                Recent Deliveries
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Delivery ID</th>
                    <th className={styles.th}>Driver</th>
                    <th className={styles.th}>Retailer</th>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeliveries.length === 0 ? (
                    <tr>
                      <td className={styles.td} colSpan={5} style={{ textAlign: "center", color: "#6b7280" }}>
                        No deliveries yet
                      </td>
                    </tr>
                  ) : (
                    recentDeliveries.map((d) => (
                      <tr key={d._id} className={styles.tr}>
                        <td className={styles.td}>{d.DelID}</td>
                        <td className={styles.td}>{d.DelUserID?.UserName ?? "—"}</td>
                        <td className={styles.td}>{d.DelRetID?.RetName ?? "—"}</td>
                        <td className={styles.td}>{formatDate(d.CreatedAt)}</td>
                        <td className={styles.td}>{statusBadge(d.Status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* map showing the delivery area */}
            <div className="card">
              <div className="card-title">
                <div className="card-icon orange"><MapPin size={16} /></div>
                Delivery Map
              </div>

              <iframe
                className={styles.mapFrame}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127417.44608574673!2d101.61656857573604!3d3.1319036820904754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e1b5e96b8c7a1!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2smy!4v1708000000000!5m2!1sen!2smy"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className={styles.rightColumn}>

            {/* alerts */}
            <div className="card">
              <div className="card-title">
                <div className="card-icon red"><Bell size={16} /></div>
                Recent Alerts
              </div>

              <div className={styles.alertItem}>
                <span className={styles.alertHigh}>High</span>
                <div className={styles.alertText}>Temperature exceeded 8°C in Truck #3</div>
                <div className={styles.alertTime}>2h ago</div>
              </div>

              <div className={styles.alertItem}>
                <span className={styles.alertMedium}>Med</span>
                <div className={styles.alertText}>Delivery CW-20260219-72041 delayed by 30 min</div>
                <div className={styles.alertTime}>5h ago</div>
              </div>

              <div className={styles.alertItem}>
                <span className={styles.alertLow}>Low</span>
                <div className={styles.alertText}>Sensor offline in Truck #8</div>
                <div className={styles.alertTime}>Yesterday</div>
              </div>
            </div>

            {/* product breakdown bars */}
            <div className="card">
              <div className="card-title">
                <div className="card-icon purple"><PieChart size={16} /></div>
                Product Breakdown
              </div>

              <div className={styles.productRow}>
                <div className={styles.productName}>Chicken</div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: "45%", background: "#2563eb" }}></div>
                </div>
                <div className={styles.productPercent}>45%</div>
              </div>

              <div className={styles.productRow}>
                <div className={styles.productName}>Beef</div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: "35%", background: "#16a34a" }}></div>
                </div>
                <div className={styles.productPercent}>35%</div>
              </div>

              <div className={styles.productRow}>
                <div className={styles.productName}>Lamb</div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: "20%", background: "#f97316" }}></div>
                </div>
                <div className={styles.productPercent}>20%</div>
              </div>
            </div>

            {/* delivery counts */}
            <div className="card">
              <div className="card-title">
                <div className="card-icon green"><Truck size={16} /></div>
                Delivery Status
              </div>

              <div className={styles.deliveryGrid}>

                <div className={styles.deliveryStat}>
                  <div className={styles.deliveryIcon}>
                    <CheckCircle size={20} color="#16a34a" />
                  </div>
                  <div className={styles.deliveryNumber} style={{ color: "#16a34a" }}>{totalCompleted}</div>
                  <div className={styles.deliveryLabel}>Delivered</div>
                </div>

                <div className={styles.deliveryStat}>
                  <div className={styles.deliveryIcon}>
                    <Truck size={20} color="#2563eb" />
                  </div>
                  <div className={styles.deliveryNumber} style={{ color: "#2563eb" }}>{inTransit}</div>
                  <div className={styles.deliveryLabel}>In Transit</div>
                </div>

                <div className={styles.deliveryStat}>
                  <div className={styles.deliveryIcon}>
                    <Clock size={20} color="#6b7280" />
                  </div>
                  <div className={styles.deliveryNumber} style={{ color: "#6b7280" }}>{pending}</div>
                  <div className={styles.deliveryLabel}>Pending</div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
