import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vita Vina ERP - Quản lý vận hành du học",
  description: "Phần mềm quản lý du học & du học nghề Vita Vina",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
