import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProductFormPage from "./pages/ProductFormPage";
import HelpPage from "./pages/HelpPage";
import ContactUsPage from "./pages/ContactUsPage";
import LoginPage from "./pages/LoginPage";
import TrackingPage from "./pages/TrackingPage";
import CustomerPage from "./pages/CustomerPage";
import DeliveryLogsPage from "./pages/DeliveryLogsPage";
import SensorLogsPage from "./pages/SensorLogsPage";
import CustomerPageDemo from "./pages/CustomerPageDemo";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages —  */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/track/:productId" element={<CustomerPage />} />
          <Route path="/customer" element={<CustomerPageDemo />} />

          {/* ProtectedRoute will chek for a valid token first */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Routes>
                      {/* Both admins and drivers — Dashboard picks the right view */}
                      <Route path="/" element={<Dashboard />} />

                      {/* Admin  */}
                      <Route
                        path="/product-form"
                        element={
                          <ProtectedRoute allowedRoles={["admin"]}>
                            <ProductFormPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* all logged-in users */}
                      <Route path="/tracking" element={<TrackingPage />} />
                      <Route
                        path="/delivery-logs"
                        element={<DeliveryLogsPage />}
                      />
                      <Route path="/sensor-logs" element={<SensorLogsPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/contact-us" element={<ContactUsPage />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
