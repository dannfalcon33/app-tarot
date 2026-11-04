"use client";

import Image from "next/image";
import Link from "next/link";
import { REVERSO_PATH } from "@/data/tarotSpread";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-purple-500/25 bg-black/75 backdrop-blur-xl text-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-purple-500/20">
          {/* Columna 1: Identidad de Marca con el Reverso Oficial */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-10 h-14 rounded-lg overflow-hidden border border-purple-300/60 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src={REVERSO_PATH}
                  alt="Universe Tarot Icono"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-white via-purple-200 to-fuchsia-300 bg-clip-text text-transparent block">
                  Universe Tarot
                </span>
                <span className="text-[11px] uppercase tracking-widest text-purple-300/80 block">
                  Oráculo de Cruz Celta con IA
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed max-w-sm">
              Plataforma interactiva de consulta de tarot mediante la tirada
              tradicional de la Cruz Celta (10 cartas) e interpretación guiada
              por Inteligencia Artificial.
            </p>

            {/* Bloque informativo de Medios de Pago por PayPal */}
            <div className="bg-purple-950/35 border border-purple-400/30 rounded-2xl p-4 space-y-2 max-w-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
                  <span className="text-cyan-300">✦</span>
                  <span>Medios de Pago Oficiales</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#003087]/80 border border-[#0079C1]/60 text-[11px] font-extrabold tracking-wide text-white shadow">
                  PayPal
                </span>
              </div>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Todos los pagos por servicios, lecturas extendidas o funciones
                premium en <strong className="text-white">Universe Tarot</strong>{" "}
                se procesan de forma exclusiva y segura a través de{" "}
                <strong className="text-cyan-200">PayPal</strong>. No
                almacenamos datos de tarjetas bancarias en nuestros servidores.
              </p>
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-fuchsia-300">
              Experiencias
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-purple-200/85">
              <li>
                <Link
                  href="/#consulta"
                  className="hover:text-white transition-colors"
                >
                  Nueva Consulta General
                </Link>
              </li>
              <li>
                <Link
                  href="/lectura"
                  className="hover:text-white transition-colors"
                >
                  Sala de Lectura (10 Cartas)
                </Link>
              </li>
              <li>
                <Link
                  href="/#como-funciona"
                  className="hover:text-white transition-colors"
                >
                  ¿Cómo Funciona?
                </Link>
              </li>
              <li>
                <Link
                  href="/#cruz-celta"
                  className="hover:text-white transition-colors"
                >
                  Mapa de la Cruz Celta
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Biblioteca de Arcanos */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-fuchsia-300">
              Biblioteca del Mazo
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-purple-200/85">
              <li>
                <Link
                  href="/arcanos-mayores"
                  className="hover:text-white transition-colors"
                >
                  Arcanos Mayores (El Viaje Cósmico)
                </Link>
              </li>
              <li>
                <Link
                  href="/arcanos-menores/bastos"
                  className="hover:text-white transition-colors"
                >
                  Arcanos Menores de Bastos (Fuego)
                </Link>
              </li>
              <li>
                <Link
                  href="/arcanos-menores/copas"
                  className="hover:text-white transition-colors"
                >
                  Arcanos Menores de Copas (Agua)
                </Link>
              </li>
              <li>
                <Link
                  href="/arcanos-menores/espadas"
                  className="hover:text-white transition-colors"
                >
                  Arcanos Menores de Espadas (Aire)
                </Link>
              </li>
              <li>
                <Link
                  href="/arcanos-menores/pentaculos"
                  className="hover:text-white transition-colors"
                >
                  Arcanos Menores de Pentáculos (Tierra)
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Marco Legal y Condiciones */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-fuchsia-300">
              Legal y Transparencia
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-purple-200/85">
              <li>
                <Link
                  href="/legal/terminos-y-condiciones"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>Términos y Condiciones</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/politica-de-privacidad"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>Políticas de Privacidad</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terminos-de-uso"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>→</span>
                  <span>Términos de Uso</span>
                </Link>
              </li>
            </ul>

            <p className="text-[11px] text-purple-300/65 pt-2 leading-relaxed">
              Las lecturas tienen un propósito de orientación espiritual,
              introspección personal y entretenimiento.
            </p>
          </div>
        </div>

        {/* Barra Inferior de Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/70">
          <p>
            © {currentYear} <strong className="text-white">Universe Tarot</strong>.
            Todos los derechos reservados. Aplicación y arte de baraja de
            propiedad exclusiva.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/legal/terminos-y-condiciones"
              className="hover:text-white underline"
            >
              Términos y Condiciones
            </Link>
            <span>·</span>
            <Link
              href="/legal/politica-de-privacidad"
              className="hover:text-white underline"
            >
              Privacidad
            </Link>
            <span>·</span>
            <Link
              href="/legal/terminos-de-uso"
              className="hover:text-white underline"
            >
              Condiciones de Uso
            </Link>
            <span>·</span>
            <span className="text-cyan-300 font-medium">
              Pagos vía PayPal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

