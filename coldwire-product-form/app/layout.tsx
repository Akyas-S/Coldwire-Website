import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coldwire Product Form",
  description: "Halal meat batch registration system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
