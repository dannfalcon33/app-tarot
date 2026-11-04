t# Universe Tarot — Documento de Estado Actual y Especificación Técnica (Input para Astra 6)

> **Propósito de este documento:** Definir de forma exhaustiva la arquitectura actual, módulos implementados, estado de activos gráficos, modelo de negocio (pagos con PayPal) y requerimientos pendientes de **Universe Tarot**, para que **Astra 6** pueda analizar el proyecto y estructurar un **Plan de Desarrollo de Software (Roadmap & Sprint Backlog)** completo hacia producción.

---

## 1. Resumen Ejecutivo del Proyecto

- **Nombre de la Aplicación:** Universe Tarot — Oráculo Cósmico & Cruz Celta
- **Idioma Principal:** Español (`es`)
- **Propiedad:** Propiedad privada e intelectual exclusiva del creador/titular del repositorio (tanto código fuente como el arte digital original de las cartas).
- **Propuesta de Valor:** Plataforma web interactiva de consulta esotérica moderna con estética cósmica inmersiva. Permite realizar lecturas de **Cruz Celta (10 cartas)** guiadas por la pregunta obligatoria del consultante y analizadas en profundidad mediante Inteligencia Artificial, además de ofrecer una biblioteca interactiva 3D/Holográfica de los Arcanos Mayores y Menores.
- **Medio de Pago Oficial Definido:** **PayPal** (establecido en el pie de página y blindado en los documentos legales de Términos y Condiciones, Política de Privacidad y Términos de Uso).

---

## 2. Stack Tecnológico Actual

| Capa | Tecnología / Librería | Versión | Uso en la Aplicación |
| :--- | :--- | :--- | :--- |
| **Framework Core** | Next.js (App Router) | `16.2.6` | Enrutamiento híbrido, SSR/CSR y API Routes (`/api/interpretar`). |
| **Librería UI** | React / React DOM | `19.2.0` | Componentes interactivos, estados de tirada y modales. |
| **Lenguaje** | TypeScript | `^5` | Tipado estático de mazos, cartas, posiciones de tirada y respuestas de IA. |
| **Estilos** | Tailwind CSS | `^4` | Diseño responsivo, glassmorphism cósmico y animaciones personalizadas. |
| **Efectos 3D Fondo** | Three.js | `^0.181.2` | Fondo interactivo espacial (`Starfield.tsx`) en todas las vistas. |
| **Efectos Holográficos** | `@kongyo2/cards-css` | `^1.0.2` | Efecto parallax 3D **"Reverse Leviathan"** (`effect="reverse"`) con zoom y volteo al reverso oficial. |
| **Motor de IA** | Pollinations AI (`openai-fast`) + Fallbacks | REST API | Interpretación narrativa estructurada de la Cruz Celta (soporta llaves opcionales de Google Gemini y Groq). |

---

## 3. Arquitectura de Directorios y Rutas Implementadas

```text
app-tarot/
├── public/
│   └── tarot/
│       ├── reverse-universe.webp        # Reverso oficial de la baraja, Favicon e Icono de marca
│       ├── Arcanos Mayores/             # 20 cartas en formato .webp (0 al 19)
│       ├── Bastos/                      # 14 cartas (1-3 en .png, 4-14 en .webp)
│       ├── Copas/                       # 14 cartas en .webp
│       ├── Espadas/                     # 14 cartas en .webp
│       └── Pentaculos/                  # 14 cartas en .webp
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root Layout, metadatos SEO y configuración de Favicon
│   │   ├── page.tsx                     # Landing Page principal en español
│   │   ├── lectura/
│   │   │   └── page.tsx                 # Sala de Consulta: Tirada de Cruz Celta (10 cartas) + IA
│   │   ├── api/
│   │   │   └── interpretar/
│   │   │       └── route.ts             # Endpoint POST para interpretación profunda con IA
│   │   ├── arcanos-mayores/
│   │   │   └── page.tsx                 # Galería interactiva de Arcanos Mayores con efecto Reverse Leviathan
│   │   ├── arcanos-menores/
│   │   │   └── [palo]/
│   │   │       └── page.tsx             # Galería dinámica por palo (bastos, copas, espadas, pentaculos)
│   │   └── legal/
│   │       ├── layout.tsx               # Layout compartido para páginas legales
│   │       ├── terminos-y-condiciones/
│   │       │   └── page.tsx             # Términos comerciales, propiedad intelectual y pagos PayPal
│   │       ├── politica-de-privacidad/
│   │       │   └── page.tsx             # Privacidad de consultas de IA, cookies y datos en PayPal
│   │       └── terminos-de-uso/
│   │           └── page.tsx             # Descargo de responsabilidad (disclaimer), +18 y buen uso
│   ├── components/
│   │   ├── Starfield.tsx                # Canvas Three.js de campo estelar
│   │   ├── HoloTarotCard.tsx            # Wrapper de @kongyo2/cards-css con zoom modal y volteo al reverso
│   │   └── Footer.tsx                   # Pie de página expandido con enlaces legales y distintivo PayPal
│   └── data/
│       ├── majorArcana.ts               # Datos, significados y rutas de los Arcanos Mayores
│       └── minorArcana.ts               # Datos, significados y rutas de los 56 Arcanos Menores
```

---

## 4. Funcionalidades Completadas (Estado Actual: MVP Funcional)

### 4.1. Identidad Visual, Marca y Landing Page (`/`)
- **Favicon e Icono de Marca:** Configurado globalmente con `/tarot/reverse-universe.webp` tanto en las pestañas del navegador (`metadata.icons`) como en la barra de navegación y pie de página.
- **Landing Page en Español:** Presentación del oráculo, vista previa visual del esquema de Cruz Celta (10 posiciones), explicación del flujo de lectura en 3 pasos y acceso directo al catálogo de Arcanos Mayores y los 4 palos de Arcanos Menores.

### 4.2. Motor de Tirada Cruz Celta (`/lectura`)
- **Barajado Único por Consulta:** Algoritmo Fisher-Yates que mezcla las cartas activas (76 cartas actualmente) junto con su orientación (`al derecho` o `invertida` con 28% de probabilidad de inversión). Se eliminó el re-barajado arbitrario para preservar la seriedad de una única tirada por sesión/pregunta.
- **Prompt Guía Obligatorio:** El usuario debe ingresar obligatoriamente su pregunta, intención o contexto antes de consultar al Oráculo IA.
- **Tablero Interactivo de 10 Posiciones:**
  - *Cruz Central (1–6):* Presente, Desafío/Cruce, Pasado Reciente, Futuro Inmediato, Corona (Consciente), Raíz (Inconsciente).
  - *Bastón del Destino (7–10):* Actitud Interna, Entorno Exterior, Esperanzas/Temores, Desenlace/Síntesis.
- **Revelación Progresiva:** Permite revelar carta por carta haciendo clic sobre el reverso (`reverse-universe.webp`) o revelar las 10 cartas simultáneamente, con panel lateral de inspección detallada.

### 4.3. Motor de Interpretación con IA (`/api/interpretar`)
- **Enfoque de Guía Profunda:** El prompt del sistema instruye al modelo a no limitarse a listar cartas, sino a tejer cómo dialogan y chocan las energías entre sí respecto a la pregunta del usuario.
- **Estructura de Respuesta en 4 Bloques:**
  1. `[VISION_GENERAL]` — Energía central y respuesta directa a la inquietud.
  2. `[CRUZ_CENTRAL]` — Dinámica interna (posiciones 1 a 6).
  3. `[BASTON_DESTINO]` — Evolución y mundo exterior (posiciones 7 a 10).
  4. `[GUIA_Y_CONSEJO]` — Consejo práctico, espiritual y accionable.
- **Alta Disponibilidad:** Usa Pollinations AI (`openai-fast`) sin requerir API Key obligatoria, admite `GEMINI_API_KEY` o `GROQ_API_KEY` mediante variables de entorno, e incluye un motor determinista de respaldo en caso de caída de red.

### 4.4. Galería de Arcanos con Efecto Holográfico (`/arcanos-mayores` y `/arcanos-menores/[palo]`)
- Integración de `@kongyo2/cards-css` mediante `HoloTarotCard.tsx`.
- Efecto parallax **"Reverse Leviathan"** al mover el cursor, modal de zoom al hacer clic y botón para voltear la carta en 3D mostrando el reverso oficial `/tarot/reverse-universe.webp`.

### 4.5. Marco Legal y Transparencia de Pagos (`/legal/*` y `Footer.tsx`)
- Pie de página global con columna dedicada al medio de pago oficial (**PayPal**) y enlaces a:
  - `/legal/terminos-y-condiciones`
  - `/legal/politica-de-privacidad`
  - `/legal/terminos-de-uso`

---

## 5. Estado de Activos Gráficos y Deuda Técnica Menor

1. **Cartas Activas en el Mazo:** **76 de 78 cartas** están operativas y mapeadas.
2. **2 Arcanos Mayores Pendientes de Subir:**
   - `20 - El Juicio` (`/tarot/Arcanos Mayores/20-juicio.webp`)
   - `21 - El Mundo` (`/tarot/Arcanos Mayores/21-mundo.webp`)
   - *Nota técnica:* Sus objetos de datos ya están redactados y comentados al final de `src/data/majorArcana.ts`, listos para descomentarse en cuanto se agreguen los archivos `.webp`.
3. **Estandarización de Formato en Bastos:**
   - Las cartas 1, 2 y 3 de Bastos (`1-as-bastos.png`, `2-dos-bastos.png`, `3-tres-bastos.png`) están funcionando en formato `.png`, mientras que las 73 cartas restantes están optimizadas en `.webp`. Se recomienda convertirlas a `.webp` para uniformidad de peso y caché.

---

## 6. Requerimientos y Módulos Propuestos para el Plan de Desarrollo (Input para Astra 6)

Al analizar este documento, **Astra 6** debe estructurar un plan de ingeniería de software dividido en fases/sprints que aborde los siguientes objetivos evolutivos:

### Fase 1: Cierre de Activos y Pulido Base
- Incorporación de los 2 Arcanos Mayores faltantes (`20-juicio.webp` y `21-mundo.webp`) para completar las 78 cartas.
- Conversión de las 3 primeras cartas de Bastos de `.png` a `.webp`.
- Optimización de carga de imágenes (`next/image` o preload de texturas críticas).

### Fase 2: Integración Real de Pasarela de Pagos con PayPal (Monetización)
- Aunque el marco legal y visual ya declara a **PayPal** como único medio de pago, falta implementar la integración transaccional real:
  - Integración de `@paypal/react-paypal-js` en el frontend y **PayPal Orders API v2** en el backend (`/api/paypal/create-order` y `/api/paypal/capture-order`).
  - Definición del modelo de monetización (ej. *Freemium*: 1 tirada básica gratuita o vista parcial, y pago vía PayPal para desbloquear la lectura profunda de IA, paquetes de créditos de consulta o suscripción mensual).
  - Webhooks de PayPal para validación segura de pagos en servidor.

### Fase 3: Autenticación, Base de Datos y Perfil del Consultante
- Sistema de autenticación (NextAuth / Auth.js o Clerk/Supabase Auth).
- Base de datos (PostgreSQL / Prisma / Supabase / Neon) para almacenar:
  - Usuarios y saldo de créditos / estado de compras de PayPal.
  - **Diario / Historial de Tiradas:** Guardar la fecha, la pregunta realizada, las 10 cartas que salieron (con su orientación) y la lectura completa generada por la IA.

### Fase 4: Funcionalidades de Valor Añadido y Retención
- **Exportación de Lectura:** Descarga de la tirada de Cruz Celta e interpretación en formato **PDF** estilizado o tarjeta de imagen para compartir en redes.
- **Nuevos Tipos de Tiradas:** Tirada de 3 cartas (Pasado, Presente, Futuro), Tirada del Amor/Relaciones, Carta Astral / Carta del Día.
- **Audio y Ambientación:** Efectos de sonido sutiles al barajar/voltear cartas y música ambiental cósmica opcional (con control mute).

### Fase 5: Calidad, Seguridad, SEO y Despliegue (DevOps)
- Rate limiting en `/api/interpretar` para evitar abuso del endpoint de IA.
- Pruebas unitarias (Vitest) para el motor de barajado y pruebas E2E (Playwright) para el flujo de tirada y checkout de PayPal Sandbox.
- Configuración de OpenGraph, `sitemap.xml`, `robots.txt` y despliegue continuo en Vercel con variables de entorno seguras.

