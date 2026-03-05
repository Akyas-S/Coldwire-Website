import { ShieldCheck, Package, Thermometer, Building2 } from "lucide-react";
import meatImg from "../assets/Screenshot_20260304_131240.png";
import certImg from "../assets/cert.png";

function Row({ label, value }) {
  return (
    <div className="dialog-row">
      <span className="dialog-row-label">{label}</span>
      <span style={{ color: "#111827", fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );
}


export default function CustomerPageDemo() {
  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={20} color="#2563eb" />
          <span style={{ fontWeight: 700, color: "#2563eb", fontSize: 16 }}>ColdWire</span>
          <span style={{ color: "#d1d5db" }}>|</span>
          <span style={{ color: "#6b7280", fontSize: 14 }}>Product Verification</span>
        </div>
      </div>

      <div className="page-content">
        {/* Header card */}
        <div className="card">
          <img
            src={meatImg}
            alt="Product"
            style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8, marginBottom: 16 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Product ID: PROD-0042</p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                Lamb — Shoulder, Bone-in
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Batch: BATCH-2025-114</p>
            </div>
            <span className="badge badge-blue">In Progress</span>
          </div>
        </div>


        {/* Product Info */}
        <div className="card">
          <h2 className="card-title">
            <div className="card-icon blue"><Package size={16} /></div>
            Product Information
          </h2>
          <Row label="Category"         value="Lamb" />
          <Row label="Subcategory"      value="Shoulder, Bone-in" />
          <Row label="Date Slaughtered" value="12 February 2025" />
          <Row label="Date Received"    value="14 February 2025" />
        </div>

        {/* Manufacturer & Supplier */}
        <div className="card">
          <h2 className="card-title">
            <div className="card-icon purple"><Building2 size={16} /></div>
            Manufacturer &amp; Supplier
          </h2>
          <div className="form-row" style={{ marginBottom: 0 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Manufacturer</p>
              <p style={{ fontWeight: 600 }}>Al-Barakah Meat Processing Sdn Bhd</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Lot 14, Jalan Industri 3, Kawasan Perindustrian Batu Caves, 68100 Kuala Lumpur</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Supplier</p>
              <p style={{ fontWeight: 600 }}>Farm Fresh Holdings Sdn Bhd</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>No. 7, Jalan Meru, Taman Meru Indah, 41050 Klang, Selangor</p>
            </div>
          </div>
        </div>

        {/* Halal Certificate */}
        <div className="card">
          <h2 className="card-title">
            <div className="card-icon green"><ShieldCheck size={16} /></div>
            Halal Certificate
            <span className="badge badge-green" style={{ marginLeft: "auto" }}>Valid</span>
          </h2>
          <Row label="Issuing Body" value="JAKIM (Jabatan Kemajuan Islam Malaysia)" />
          <Row label="Issue Date"   value="1 January 2025" />
          <Row label="Expiry Date"  value="31 December 2026" />
          <img
            src={certImg}
            alt="Halal Certificate"
            style={{ width: "50%", marginTop: 16, borderRadius: 8, border: "1px solid #e5e7eb", display: "block", margin: "16px auto 0" }}
          />
        </div>

        {/* Cold Chain Summary */}
        <div className="card">
          <h2 className="card-title">
            <div className="card-icon orange"><Thermometer size={16} /></div>
            Cold Chain Summary
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Avg Temp</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>2.4°C</p>
            </div>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Avg Humidity</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>82%</p>
            </div>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Avg Gas</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>14 ppm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
