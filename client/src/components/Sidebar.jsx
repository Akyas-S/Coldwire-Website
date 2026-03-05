import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  FileText,
  MapPin,
  Truck,
  Activity,
  Camera,
  Settings,
  HelpCircle,
  Mail,
  Menu,
  LogOut,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Get the current user and logout function from auth context
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  function navClass(href) {
    if (pathname === href) {
      return `${styles.navItem} ${styles.active}`;
    }
    return styles.navItem;
  }

  function handleLogout() {
    logout();
    navigate("/login"); // send back to the login page
  }

  return (
    <div
      className={
        isOpen ? styles.sidebar : `${styles.sidebar} ${styles.collapsed}`
      }
    >
      <div className={styles.header}>
        {isOpen && <span className={styles.logo}>Logo</span>}
        <button
          className={styles.toggleButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className={styles.nav}>
        {/* Main navigation */}
        <div className={styles.section}>
          <Link to="/" className={navClass("/")}>
            <span className={styles.icon}>
              <LayoutDashboard size={16} />
            </span>
            {isOpen && "Dashboard"}
          </Link>

          {/* Alerts — admin only */}
          {isAdmin && (
            <a href="#" className={styles.navItem}>
              <span className={styles.icon}>
                <Bell size={16} />
              </span>
              {isOpen && "Alerts"}
            </a>
          )}

          {/* Product Form — admin only */}
          {isAdmin && (
            <Link to="/product-form" className={navClass("/product-form")}>
              <span className={styles.icon}>
                <FileText size={16} />
              </span>
              {isOpen && "Product Form"}
            </Link>
          )}
        </div>

        {/* Logistics section — visible to all roles */}
        <div className={styles.section}>
          {isOpen && <div className={styles.sectionLabel}>Logistics</div>}
          <Link to="/tracking" className={navClass("/tracking")}>
            <span className={styles.icon}>
              <MapPin size={16} />
            </span>
            {isOpen && "Tracking"}
          </Link>
          <Link to="/delivery-logs" className={navClass("/delivery-logs")}>
            <span className={styles.icon}>
              <Truck size={16} />
            </span>
            {isOpen && "Delivery Logs"}
          </Link>
          <Link to="/sensor-logs" className={navClass("/sensor-logs")}>
            <span className={styles.icon}>
              <Activity size={16} />
            </span>
            {isOpen && "Sensor Logs"}
          </Link>
          <a href="#" className={styles.navItem}>
            <span className={styles.icon}>
              <Camera size={16} />
            </span>
            {isOpen && "Camera Feed"}
          </a>
        </div>

        {/* System section */}
        <div className={styles.section}>
          {isOpen && <div className={styles.sectionLabel}>System</div>}

          {/* Settings — admin only */}
          {isAdmin && (
            <a href="#" className={styles.navItem}>
              <span className={styles.icon}>
                <Settings size={16} />
              </span>
              {isOpen && "Settings"}
            </a>
          )}

          <Link to="/help" className={navClass("/help")}>
            <span className={styles.icon}>
              <HelpCircle size={16} />
            </span>
            {isOpen && "Help"}
          </Link>
          <Link to="/contact-us" className={navClass("/contact-us")}>
            <span className={styles.icon}>
              <Mail size={16} />
            </span>
            {isOpen && "Contact Us"}
          </Link>

          {/* Logout button — always visible */}
          <button
            className={styles.navItem}
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span className={styles.icon}>
              <LogOut size={16} />
            </span>
            {isOpen && "Logout"}
          </button>
        </div>
      </nav>
    </div>
  );
}
