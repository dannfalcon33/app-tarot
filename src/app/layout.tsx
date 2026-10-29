import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Starfield from "@/components/Starfield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universe Tarot — Oráculo Cósmico y Tirada de Cruz Celta",
  description:
    "Universe Tarot: conecta tu intención con el cosmos. Realiza tu consulta general con la tirada tradicional de Cruz Celta de 10 cartas y explora los 78 Arcanos.",
  icons: {
    icon: "/images/favicon.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-100 selection:bg-purple-500/40 selection:text-purple-100`}
        style={{
          backgroundColor: "#04020a",
          minHeight: "100vh",
        }}
      >
        {/* Fondo animado de estrellas con Three.js */}
        <Starfield />
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Nebulosa cósmica ambiental */}
          <div className="fixed inset-0 bg-gradient-to-b from-purple-950/20 via-black/45 to-indigo-950/30 pointer-events-none z-0"></div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
