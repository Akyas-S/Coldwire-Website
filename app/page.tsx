import TopBar from "@/components/TopBar";

export default function Dashboard() {
  return (
    <main>
      <TopBar title="Dashboard" />
      <div className="page-content">
        <p style={{ color: "#6b7280" }}>Welcome to the Coldwire dashboard.</p>
      </div>
    </main>
  );
}
