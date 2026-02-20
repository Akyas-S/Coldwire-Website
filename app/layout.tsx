import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Coldwire Product Form",
  description: "Halal meat batch registration system",
};

interface LayoutProps {
  children: React.ReactNode;
}

// RootLayout wraps every page in the app with the shared chrome (Sidebar + global CSS).
// children is whatever the matched page is.
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        {/* app-container uses CSS flexbox (row direction) so Sidebar sits
            to the left and main-content fills the remaining width. */}
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
