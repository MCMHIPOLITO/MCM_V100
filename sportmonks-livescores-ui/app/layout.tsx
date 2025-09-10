import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livescores UI",
  description: "Sportmonks Livescores with sticky table, search, and column toggles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
