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
  title: "Universe Tarot — Oráculo Cósmico y Tirada de Cruz Celta con IA",
  description:
    "Universe Tarot: experiencia interactiva de Tarot con tirada de Cruz Celta de 10 cartas, baraja oficial completa de 78 arcanos holográficos 3D e interpretación profunda en 8 capítulos con Inteligencia Artificial.",
  keywords: [
    "Universe Tarot",
    "Cruz Celta",
    "Tarot IA",
    "78 Arcanos",
    "Arcanos Mayores",
    "Arcanos Menores",
    "Tarot Holográfico 3D",
  ],
  icons: {
    icon: [
      {
        url: "/tarot/reverse-universe.webp",
        type: "image/webp",
      },
    ],
    shortcut: "/tarot/reverse-universe.webp",
    apple: "/tarot/reverse-universe.webp",
  },
  openGraph: {
    title: "Universe Tarot — Oráculo Cósmico y Tirada de Cruz Celta",
    description:
      "Conecta tu intención con las 78 cartas oficiales de Universe Tarot y descubre tu lectura en 8 capítulos con el Oráculo IA.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04020a",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-purple-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:border focus:border-fuchsia-400"
        >
          Saltar al contenido principal
        </a>
        {/* Fondo animado de estrellas con Three.js (optimizado con pausa en segundo plano y reduced-motion) */}
        <Starfield />
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Nebulosa cósmica ambiental */}
          <div className="fixed inset-0 bg-gradient-to-b from-purple-950/20 via-black/45 to-indigo-950/30 pointer-events-none z-0" />
          <div id="main-content" className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
