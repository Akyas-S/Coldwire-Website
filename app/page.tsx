import TopBar from "@/components/TopBar";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  return (
    <main>
      <TopBar title="Dashboard" />

      <div className={styles.pageWrapper}>

        {/* --- Stat Cards --- */}
        <div className={styles.statsGrid}>

          <div className="card">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>8</div>
              <div className={styles.statLabel}>Batches Today</div>
            </div>
          </div>

          <div className="card">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1,240 kg</div>
              <div className={styles.statLabel}>Total Quantity</div>
            </div>
          </div>

          <div className="card">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statLabel}>Active Deliveries</div>
            </div>
          </div>

          <div className="card">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>2</div>
              <div className={styles.statLabel}>Pending Alerts</div>
            </div>
          </div>

        </div>

        {/*  Main column area  */}
        <div className={styles.mainGrid}>

          {/* LEFT */}
          <div className={styles.leftColumn}>

          
            <div className="card">
              <div className="card-title">Recent Batches</div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Batch ID</th>
                    <th className={styles.th}>Product</th>
                    <th className={styles.th}>Quantity</th>
                    <th className={styles.th}>Abattoir</th>
                    <th className={styles.th}>Date Received</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.td}>CW-20260220-45231</td>
                    <td className={styles.td}>Chicken — Breast</td>
                    <td className={styles.td}>200 kg</td>
                    <td className={styles.td}>Al-Barakah Abattoir</td>
                    <td className={styles.td}>2026-02-20</td>
                    <td className={styles.td}><span className="badge badge-blue">Delivered</span></td>
                  </tr>
                  <tr>
                    <td className={styles.td}>CW-20260220-33812</td>
                    <td className={styles.td}>Beef — Ribeye</td>
                    <td className={styles.td}>150 kg</td>
                    <td className={styles.td}>Halal Prime Sdn Bhd</td>
                    <td className={styles.td}>2026-02-20</td>
                    <td className={styles.td}><span className="badge badge-gray">In Transit</span></td>
                  </tr>
                  <tr>
                    <td className={styles.td}>CW-20260219-72041</td>
                    <td className={styles.td}>Lamb — Leg</td>
                    <td className={styles.td}>80 kg</td>
                    <td className={styles.td}>Greenfield Halal</td>
                    <td className={styles.td}>2026-02-19</td>
                    <td className={styles.td}><span className="badge badge-blue">Delivered</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* map showing the delivery area */}
            <div className="card">
              <div className="card-title">Delivery Map</div>

              <iframe
                className={styles.mapFrame}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127417.44608574673!2d101.61656857573604!3d3.1319036820904754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e1b5e96b8c7a1!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2smy!4v1708000000000!5m2!1sen!2smy"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
          

          {/* RIGHT*/}
          <div className={styles.rightColumn}>

            {/* alerts */}
            <div className="card">
              <div className="card-title">Recent Alerts</div>

              
              <div className={styles.alertItem}>
                <div className={styles.alertDot} style={{ background: "#ef4444" }}></div>
                <div className={styles.alertText}>Temperature exceeded 8°C in Truck #3</div>
                <div className={styles.alertTime}>2 hours ago</div>
              </div>

              
              <div className={styles.alertItem}>
                <div className={styles.alertDot} style={{ background: "#f97316" }}></div>
                <div className={styles.alertText}>Delivery CW-20260219-72041 delayed by 30 min</div>
                <div className={styles.alertTime}>5 hours ago</div>
              </div>

              
              <div className={styles.alertItem}>
                <div className={styles.alertDot} style={{ background: "#eab308" }}></div>
                <div className={styles.alertText}>Sensor offline in Truck 8</div>
                <div className={styles.alertTime}>Yesterday</div>
              </div>
            </div>

            {/* product breakdown bars */}
            <div className="card">
              <div className="card-title">Product Breakdown</div>

              
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
              <div className="card-title">Delivery Status</div>

              <div className={styles.deliveryGrid}>

                
                <div className={styles.deliveryStat}>
                  <div className={styles.deliveryNumber} style={{ color: "#16a34a" }}>12</div>
                  <div className={styles.deliveryLabel}>Delivered</div>
                </div>

                
                <div className={styles.deliveryStat}>
                  <div className={styles.deliveryNumber} style={{ color: "#2563eb" }}>3</div>
                  <div className={styles.deliveryLabel}>In Transit</div>
                </div>

               
                <div className={styles.deliveryStat}>
                  <div className={styles.deliveryNumber} style={{ color: "#6b7280" }}>2</div>
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
