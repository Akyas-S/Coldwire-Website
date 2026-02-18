import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coldwire Product Form",
  description: "Halal meat batch registration system",
};

// Define what props this layout component accepts
interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
