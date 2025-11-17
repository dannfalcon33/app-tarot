"use client";

import { useRouter } from "next/navigation";

interface ArcanaNavButtonProps {
  label: string;
  href: string;
}

export function ArcanaNavButton({ label, href }: ArcanaNavButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="bg-black/40 border border-purple-500/60 hover:border-purple-300 text-purple-100 hover:text-white font-semibold py-3 px-6 rounded-full text-sm sm:text-base shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {label}
    </button>
  );
}

export default function MajorArcanaButton() {
  return (
    <ArcanaNavButton
      label="Ver todos los Arcanos Mayores"
      href="/arcanos-mayores"
    />
  );
}

