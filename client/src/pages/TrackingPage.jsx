import TopBar from "../components/TopBar";

export default function TrackingPage() {
  return (
    <main>
      <TopBar title="Tracking" />

      <div style={{ padding: "16px 24px" }}>
        <div className="card">
          <div className="card-title">Live Delivery Map</div>

          {/* placeholder map — will be replaced with real tracking later */}
          <iframe
            width="100%"
            height="600"
            style={{ border: "none", borderRadius: "6px" }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127417.44608574673!2d101.61656857573604!3d3.1319036820904754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e1b5e96b8c7a1!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2smy!4v1708000000000!5m2!1sen!2smy"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  );
}
