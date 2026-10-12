import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Varela_Round } from "next/font/google";
import "./globals.css";

// Display face for IATA codes and headlines (airport signage feel)
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
// Rounded face close to the Touchdown logo wordmark
const wordmark = Varela_Round({ subsets: ["latin"], weight: "400", variable: "--font-wordmark" });

export const metadata: Metadata = {
  title: "Touchdown",
  description: "Nightstop-Tipps von Kolleg:innen: Restaurants, Ausflüge und mehr für jede Destination",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a2148",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${display.variable} ${wordmark.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
