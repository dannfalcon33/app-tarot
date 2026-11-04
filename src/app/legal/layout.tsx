import Image from "next/image";
import Link from "next/link";
import { REVERSO_PATH } from "@/data/tarotSpread";
import Footer from "@/components/Footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-purple-500/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-11 rounded-md overflow-hidden border border-purple-300/60 shadow-md shrink-0">
              <Image
                src={REVERSO_PATH}
                alt="Universe Tarot Logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div>
              <span className="text-lg font-bold text-white block leading-tight">
                Universe Tarot
              </span>
              <span className="text-[10px] uppercase tracking-widest text-purple-300/80 block">
                Centro Legal y Transparencia
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-purple-200 hover:text-white bg-purple-950/50 border border-purple-500/35 px-4 py-2 rounded-full transition-colors"
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Pestañas de navegación entre documentos legales */}
        <nav className="flex flex-wrap gap-2 bg-black/50 border border-purple-500/30 p-2 rounded-2xl backdrop-blur-md">
          <Link
            href="/legal/terminos-y-condiciones"
            className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-purple-100 hover:bg-purple-600/40 hover:text-white border border-transparent hover:border-purple-400/40 transition-all"
          >
            Términos y Condiciones
          </Link>
          <Link
            href="/legal/politica-de-privacidad"
            className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-purple-100 hover:bg-purple-600/40 hover:text-white border border-transparent hover:border-purple-400/40 transition-all"
          >
            Políticas de Privacidad
          </Link>
          <Link
            href="/legal/terminos-de-uso"
            className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-purple-100 hover:bg-purple-600/40 hover:text-white border border-transparent hover:border-purple-400/40 transition-all"
          >
            Términos de Uso
          </Link>
        </nav>

        <div className="bg-black/60 border border-purple-500/35 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

