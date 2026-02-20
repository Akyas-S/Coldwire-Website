"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  
  const [isOpen, setIsOpen] = useState(true);

  // usePathname gives the current URL path
  // Next.js App Router hook — it re-renders the component whenever the route changes
  // so the active nav item always reflects the current page.
  const pathname = usePathname();

  // Returns the correct CSS class string for a nav item, adding the `active` modifier
  // when the item's href exactly matches the current path.
  function navClass(href: string) {
    if (pathname === href) {
      return `${styles.navItem} ${styles.active}`;
    }
    return styles.navItem;
  }

  return (
    // Toggle between the full sidebar and the collapsed (icon-only) variant by
    // conditionally appending the `collapsed` CSS module class.
    <div className={isOpen ? styles.sidebar : `${styles.sidebar} ${styles.collapsed}`}>
      <div className={styles.header}>
        {/* Logo text is hidden when collapsed to save horizontal space.
            Only the toggle button remains visible in collapsed mode. */}
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
          <Link href="/" className={navClass("/")}>
            <span className={styles.icon}><LayoutDashboard size={16} /></span>
            {isOpen && "Dashboard"}
          </Link>
    
          <a href="#" className={styles.navItem}>
            <span className={styles.icon}><Bell size={16} /></span>
            {isOpen && "Alerts"}
          </a>
          <Link href="/product-form" className={navClass("/product-form")}>
            <span className={styles.icon}><FileText size={16} /></span>
            {isOpen && "Product Form"}
          </Link>
        </div>

        {/* Logistics section */}
        <div className={styles.section}>
          {/* Section labels are only shown when the sidebar is expanded */}
          {isOpen && <div className={styles.sectionLabel}>Logistics</div>}
          <a href="#" className={styles.navItem}>
            <span className={styles.icon}><MapPin size={16} /></span>
            {isOpen && "Tracking"}
          </a>
          <a href="#" className={styles.navItem}>
            <span className={styles.icon}><Truck size={16} /></span>
            {isOpen && "Delivery Logs"}
          </a>
          <a href="#" className={styles.navItem}>
            <span className={styles.icon}><Activity size={16} /></span>
            {isOpen && "Sensor Logs"}
          </a>
          <a href="#" className={styles.navItem}>
            <span className={styles.icon}><Camera size={16} /></span>
            {isOpen && "Camera Feed"}
          </a>
        </div>

        {/* System section */}
        <div className={styles.section}>
          {isOpen && <div className={styles.sectionLabel}>System</div>}
          <a href="#" className={styles.navItem}>
            <span className={styles.icon}><Settings size={16} /></span>
            {isOpen && "Settings"}
          </a>
          <Link href="/help" className={navClass("/help")}>
            <span className={styles.icon}><HelpCircle size={16} /></span>
            {isOpen && "Help"}
          </Link>
          <Link href="/contact-us" className={navClass("/contact-us")}>
            <span className={styles.icon}><Mail size={16} /></span>
            {isOpen && "Contact Us"}
          </Link>
        </div>
      </nav>
    </div>
  );
}
