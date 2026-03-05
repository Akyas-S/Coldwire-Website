import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import DriverDashboard from "./DriverDashboard";

// This component just checks the user's role and shows the right dashboard
export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <DriverDashboard />;
}
