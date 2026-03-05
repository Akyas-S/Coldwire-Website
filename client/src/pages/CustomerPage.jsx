import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, Package, Thermometer, Building2, AlertCircle } from "lucide-react";

const STATUS_BADGE = {
  "Not Started": "badge badge-orange",
  "In Progress": "badge badge-blue",
  "Complete":    "badge badge-green",
};

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
}

function Row({ label, value }) {
  return (
    <div className="dialog-row">
      <span className="dialog-row-label">{label}</span>
      <span style={{ color: "#111827", fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );
}

export default function CustomerPage() {
  const { productId } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found.");
        return res.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [productId]);

  const certValid = data?.certificate?.ExpiryDate
    ? new Date(data.certificate.ExpiryDate) > new Date()
    : null;

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
        {/* Loading */}
        {loading && (
          <div className="card" style={{ textAlign: "center", color: "#6b7280", padding: "48px 24px" }}>
            <span className="spinner" style={{ borderColor: "#2563eb", borderTopColor: "transparent" }} />
            <p style={{ marginTop: 12 }}>Loading product information...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div className="card-icon red"><AlertCircle size={18} /></div>
            </div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Product not found</p>
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              The product ID <strong>{productId}</strong> does not exist in our system.
            </p>
          </div>
        )}

        {data && (
          <>
            {/* Header card */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Product ID: {data.product?.ProductID}</p>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                    {data.batch?.Category || "Unknown"}
                    {data.batch?.Subcategory ? ` — ${data.batch.Subcategory}` : ""}
                  </h1>
                  {data.batch?.BatchID && (
                    <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Batch: {data.batch.BatchID}</p>
                  )}
                </div>
                <span className={STATUS_BADGE[data.delivery?.Status] ?? "badge badge-gray"}>
                  {data.delivery?.Status || "Unknown"}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="card">
              <h2 className="card-title">
                <div className="card-icon blue"><Package size={16} /></div>
                Product Information
              </h2>
              <Row label="Category"        value={data.batch?.Category} />
              <Row label="Subcategory"     value={data.batch?.Subcategory} />
              <Row label="Date Slaughtered" value={fmt(data.batch?.DateSlaughtered)} />
              <Row label="Date Received"   value={fmt(data.batch?.DateReceived)} />
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
                  <p style={{ fontWeight: 600 }}>{data.manufacturer?.ManuName || "—"}</p>
                  <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{data.manufacturer?.ManuAddress || ""}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Supplier</p>
                  <p style={{ fontWeight: 600 }}>{data.supplier?.SuppName || "—"}</p>
                  <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{data.supplier?.SuppAddress || ""}</p>
                </div>
              </div>
            </div>

            {/* Halal Certificate */}
            <div className="card">
              <h2 className="card-title">
                <div className="card-icon green"><ShieldCheck size={16} /></div>
                Halal Certificate
                {certValid === true  && <span className="badge badge-green" style={{ marginLeft: "auto" }}>Valid</span>}
                {certValid === false && <span className="badge badge-red"   style={{ marginLeft: "auto" }}>Expired</span>}
                {certValid === null  && <span className="badge badge-gray"  style={{ marginLeft: "auto" }}>No Certificate</span>}
              </h2>

              {data.certificate ? (
                <>
                  <Row label="Issuing Body" value={data.certificate.Issuer} />
                  <Row label="Issue Date"   value={fmt(data.certificate.IssueDate)} />
                  <Row label="Expiry Date"  value={fmt(data.certificate.ExpiryDate)} />
                  {data.certificate.CertURL && (
                    <div style={{ marginTop: 16 }}>
                      <a
                        href={data.certificate.CertURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ width: "auto", display: "inline-flex" }}
                      >
                        View Certificate PDF
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: "#6b7280", fontSize: 14 }}>No halal certificate is linked to this batch.</p>
              )}
            </div>

            {/* Cold Chain Summary */}
            <div className="card">
              <h2 className="card-title">
                <div className="card-icon orange"><Thermometer size={16} /></div>
                Cold Chain Summary
              </h2>

              {data.sensorSummary && (data.sensorSummary.temperature || data.sensorSummary.humidity || data.sensorSummary.gas) ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Avg Temp</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                      {data.sensorSummary.temperature != null ? `${data.sensorSummary.temperature}°C` : "—"}
                    </p>
                  </div>
                  <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Avg Humidity</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                      {data.sensorSummary.humidity != null ? `${data.sensorSummary.humidity}%` : "—"}
                    </p>
                  </div>
                  <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Avg Gas</p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                      {data.sensorSummary.gas != null ? `${data.sensorSummary.gas} ppm` : "—"}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ color: "#6b7280", fontSize: 14 }}>No sensor data was recorded for this delivery.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
