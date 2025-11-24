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
  title: "Lectura de Tarot - Cartas Aleatorias",
  description:
    "App de lectura de tarot con cartas aleatorias. Baraja y selecciona 12 cartas para tu lectura.",
  icons: {
    icon: "/images/favicon.png",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: "#000",
          minHeight: "100vh",
        }}
      >
        {/* Fondo animado de estrellas con Three.js */}
        <Starfield />
        <div className="relative min-h-screen">
          {/* Overlay oscuro para mejor contraste */}
          <div className="fixed inset-0 bg-black bg-opacity-40 pointer-events-none z-0"></div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
