# Universe Tarot — Oráculo Cósmico y Tirada de Cruz Celta

Aplicación web interactiva de Tarot construida con **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Three.js** y efectos holográficos 3D.

## Características Principales

- **Baraja Oficial Completa de 78 Cartas (`public/tarot/`):**
  - **22 Arcanos Mayores** (`0 El Loco` a `21 El Universo`).
  - **56 Arcanos Menores** distribuidos en 4 palos elementales de 14 cartas cada uno: **Bastos** (Fuego), **Copas** (Agua), **Espadas** (Aire) y **Pentáculos** (Tierra).
  - Reverso oficial personalizado (`/tarot/reverse-universe.webp`).
- **Sistema de Cartas Holográficas 3D (`TarotCard`, `TarotFlip`, `TarotCardBack`):**
  - Inclinación 3D reactiva al puntero y pantallas táctiles, brillo holográfico *Reverse Leviathan*, giro 3D con destello cósmico al revelar y soporte nativo de orientación **Al Derecho (`upright`)** e **Invertida (`reversed`)**.
- **Motor del Ritual y Mesa Virtual de Cruz Celta (`/lectura` y `/lectura/[sessionId]`):**
  - Máquina de estados completa (`preparing` → `shuffling` → `dealing` → `revealing` → `ready_to_interpret` → `interpreting` → `completed` / `error`).
  - Algoritmo de barajado **Fisher-Yates** sin repetición con congelación de las 10 cartas sorteadas y persistencia temporal en `sessionStorage` resistente a recargas de página (`F5`).
  - Inspector lateral sincronizado y bloqueo estricto de la interpretación hasta revelar las **10/10 cartas**.
- **Oráculo de Inteligencia Artificial en 8 Capítulos (`/api/interpretar`):**
  - Endpoint servidor seguro sin exponer API keys en el navegador.
  - Cascada de proveedores gratuitos: **Google Gemini (`gemini-2.0-flash`)** → **Groq (`llama-3.1-8b-instant`)** → **Pollinations Free (`openai-fast`)** → **Motor narrativo determinista en 8 capítulos (`ES` / `EN` / `PT`)**.
  - Lectura estructurada en 8 capítulos (*I. Diagnóstico General*, *II. Energía Central*, *III. Influencias y Bloqueos*, *IV. Pasado y Evolución*, *V. Situación Actual*, *VI. Futuro y Tendencias*, *VII. Relaciones entre las Cartas*, *VIII. Guía Práctica y Conclusión*) con opción de reintentar usando exactamente la misma tirada.
- **Biblioteca Interactiva de Arcanos (`ArcanaCatalog`):**
  - Exploración de las 78 cartas por familia, buscador instantáneo, altar holográfico 3D, selector de idioma (`ES` / `EN` / `PT`) y modal de detalle con navegación por teclado (`←`, `→`, `Esc`).

## Desarrollo Local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

## Verificación de Calidad y Build de Producción

```bash
npm run lint
npx tsc --noEmit
npm run build
```
