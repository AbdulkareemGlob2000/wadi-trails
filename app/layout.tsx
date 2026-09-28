import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wadi Trails",
  description: "A small catalogue of hiking trails in Jordan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="site-nav">
          <Link href="/">Wadi Trails</Link>
          <Link href="/favourites">Favourites</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
