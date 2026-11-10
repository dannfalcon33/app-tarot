# UNIVERSE TAROT

## Plan de ingeniería por fases --- Experiencia frontend interactiva

**Versión:** 1.0\
**Fecha:** 9 de noviembre de 2026\
**Destino:** Antigravity\
**Objetivo:** evolucionar la aplicación existente Universe Tarot hacia
una experiencia web interactiva, visualmente premium y funcional,
centrada en el ritual de una tirada de Cruz Celta y su interpretación
mediante IA.

------------------------------------------------------------------------

## 1. Resumen ejecutivo

Universe Tarot ya cuenta con una aplicación funcional, identidad visual
propia, cartas personalizadas, motor de tiradas, una primera integración
de IA y una interfaz inicial de landing page y sala de lectura.

El alcance de este plan es **mejorar y completar la experiencia
frontend**, no reconstruir la aplicación desde cero ni convertirla
todavía en un producto comercial con pagos y cuentas.

La experiencia final debe permitir que una persona:

1.  Entre en la landing page.
2.  Seleccione el enfoque de su consulta.
3.  Escriba una pregunta.
4.  Inicie una sesión de lectura.
5.  Observe el barajado animado.
6.  Vea cómo diez cartas se distribuyen sobre una mesa virtual con la
    disposición de Cruz Celta.
7.  Revele personalmente cada carta mediante una animación 3D.
8.  Solicite la interpretación a la IA existente.
9.  Lea el resultado en una presentación visual organizada.

La experiencia debe sentirse como un ritual interactivo y continuo, no
como un formulario que muestra diez imágenes.

## 2. Alcance y restricciones

### Incluido

-   Rediseño de la landing page.
-   Mejora de la navegación y jerarquía visual.
-   Mesa virtual de Cruz Celta.
-   Animaciones de barajado, distribución y revelación.
-   Cartas holográficas con efectos de profundidad y parallax.
-   Integración y mejora de la API de IA gratuita ya existente.
-   Biblioteca interactiva de arcanos.
-   Diseño responsive.
-   Preparación para español, inglés y portugués, conservando la
    arquitectura actual cuando sea posible.
-   Persistencia temporal de la sesión en memoria y `sessionStorage`.
-   Optimización y despliegue en Vercel.

### Excluido expresamente

-   PayPal y cualquier pasarela de pago.
-   Monetización, checkout y suscripciones.
-   Registro, inicio de sesión y perfiles.
-   Base de datos, Neon, PostgreSQL y Prisma.
-   Historial permanente de lecturas.
-   Panel administrativo.
-   Cambio obligatorio de proveedor o modelo de IA.
-   Reconstrucción completa de la aplicación sin justificación técnica.

### Restricciones técnicas

-   Mantener Next.js App Router, React, TypeScript y Tailwind CSS
    existentes.
-   Mantener la identidad visual espacial de Universe Tarot: fondos
    oscuros, violetas, magenta, cian, partículas y detalles luminosos.
-   Conservar el arte original de las cartas.
-   Conservar el proveedor, endpoint y configuración de IA actuales,
    salvo que la auditoría identifique un defecto que impida su
    funcionamiento.
-   No exponer claves ni credenciales en el navegador.
-   No introducir dependencias sin justificar su necesidad.
-   Reutilizar componentes funcionales existentes antes de crear
    sustitutos.

------------------------------------------------------------------------

## 3. Diagnóstico visual y dirección de diseño

Las capturas de referencia muestran dos áreas principales:

### 3.1 Landing page actual

La landing ya presenta:

-   Navegación superior.
-   Hero con formulario de consulta.
-   Categorías de consulta.
-   Explicación del ritual.
-   Presentación de la Cruz Celta.
-   Biblioteca de los 78 arcanos.
-   Footer con información general.

Se debe conservar esta estructura conceptual, pero elevar su
presentación.

Mejoras requeridas:

1.  **Hero:** convertirlo en una composición más premium, con cartas
    protagonistas, profundidad visual y una llamada a la acción
    claramente identificable.
2.  **Formulario:** separar visualmente selección de tema, pregunta y
    tipo de tirada.
3.  **Cartas:** mostrar cartas flotantes con movimiento sutil y efectos
    holográficos.
4.  **Funcionamiento:** explicar el ritual en pasos visuales, con
    ejemplos de cartas y posiciones.
5.  **Cruz Celta:** mejorar la legibilidad del esquema y explicar las
    diez posiciones.
6.  **Biblioteca:** aumentar el protagonismo del arte, incorporar
    previsualización y navegación por familias.
7.  **Conversión de navegación:** mantener un CTA visible para comenzar
    la consulta, sin incorporar pagos.
8.  **Footer:** ordenar enlaces, información y navegación.

La landing debe ser visualmente atractiva, pero no saturada de
animaciones. Los efectos ambientales no deben competir con el formulario
ni con el contenido.

### 3.2 Sala de lectura actual

La captura actual ya muestra:

-   Pregunta y categoría.
-   Indicador de cartas reveladas.
-   Mesa de Cruz Celta.
-   Panel de inspección de carta.
-   Botón para solicitar interpretación.
-   Interpretación dividida en secciones.
-   Detalle individual de las diez cartas.

La nueva sala debe convertir estos elementos en una experiencia
progresiva:

-   La mesa será el elemento visual principal.
-   Las cartas tendrán espacio suficiente y serán seleccionables.
-   La revelación se hará mediante interacción directa del usuario.
-   El panel de inspección estará sincronizado con la carta
    seleccionada.
-   La interpretación tendrá jerarquía editorial, capítulos y lectura
    cómoda.
-   El usuario podrá volver a inspeccionar las cartas sin perder la
    interpretación generada.

La interpretación no debe presentarse como un único bloque extenso de
texto.

------------------------------------------------------------------------

## 4. Experiencia objetivo: flujo completo de una consulta

### Etapa 1 --- Preparar la consulta

En la landing, el usuario selecciona un enfoque:

-   Consulta general.
-   Amor y vínculos.
-   Trabajo y abundancia.
-   Crecimiento interior.
-   Familia.

Después escribe una pregunta y selecciona la tirada Cruz Celta.

La configuración debe validarse antes de iniciar la sesión. La pregunta
y el idioma elegido se conservarán durante todo el flujo.

### Etapa 2 --- Entrar al ritual

Al iniciar, se crea un identificador de sesión en el cliente y se navega
a una página independiente de lectura.

La transición debe sentirse cinematográfica, pero no debe retrasar
innecesariamente la interacción.

La mesa muestra el reverso personalizado de las cartas y el ambiente
espacial.

### Etapa 3 --- Barajado

-   Mostrar el mazo.
-   Ejecutar una animación de mezcla con profundidad, rotación y
    desplazamientos.
-   Permitir iniciar el ritual mediante un botón.
-   Mostrar una señal visual de finalización.
-   Preparar la distribución de las cartas.

El barajado visual no debe cambiar repetidamente el resultado lógico. La
tirada se genera una sola vez y queda congelada antes de distribuir las
cartas.

### Etapa 4 --- Distribución

Las diez cartas se desplazan desde el mazo hasta sus posiciones de Cruz
Celta.

Requisitos:

-   Animación independiente y escalonada por carta.
-   Movimiento con aceleración y desaceleración naturales.
-   Cartas boca abajo al llegar.
-   Posicionamiento estable en desktop y móvil.
-   La distribución debe respetar las diez posiciones oficiales ya
    implementadas en el motor existente.

### Etapa 5 --- Revelación

El usuario selecciona cada carta para voltearla.

Cada carta debe:

-   Ejecutar una rotación 3D de aproximadamente 180 grados.
-   Mostrar el arte original en el reverso frontal.
-   Activar un efecto de luz o brillo moderado.
-   Mostrar su nombre y posición.
-   Actualizar el progreso de revelación.

El usuario puede inspeccionar cartas ya reveladas. No debe poder cambiar
la identidad, posición u orientación de una carta mediante la
interacción visual.

La interpretación se habilita únicamente cuando las diez cartas están
reveladas.

### Etapa 6 --- Interpretación IA

Al solicitar la interpretación:

-   Enviar la pregunta original.
-   Enviar el enfoque de consulta.
-   Enviar las diez cartas seleccionadas.
-   Enviar la posición de cada carta.
-   Enviar la orientación normal o invertida.
-   Enviar el idioma de salida.
-   Utilizar el endpoint y proveedor de IA existentes.

Mostrar un estado de generación con feedback visual. Si la solicitud
falla, permitir reintentar con la misma tirada. Nunca generar cartas
nuevas por un error de IA.

### Etapa 7 --- Resultado

Presentar la interpretación con una estructura editorial:

1.  Diagnóstico general.
2.  Energía central de la tirada.
3.  Influencias y bloqueos.
4.  Pasado y evolución.
5.  Situación actual.
6.  Futuro y tendencias.
7.  Relaciones entre las cartas.
8.  Guía práctica y conclusión.

Las secciones deben ser fáciles de recorrer, con títulos, espaciado,
jerarquía tipográfica y componentes desplegables cuando ayuden a reducir
la longitud visual.

El usuario debe poder volver a inspeccionar cualquier carta sin perder
el resultado de IA.

------------------------------------------------------------------------

## 5. Arquitectura objetivo

La estructura siguiente es una referencia. Antigravity debe adaptarla a
la estructura real del repositorio y evitar duplicar componentes
existentes.

``` text
src/
├── app/
│   ├── page.tsx
│   ├── lectura/
│   │   ├── page.tsx
│   │   └── [sessionId]/
│   │       └── page.tsx
│   ├── biblioteca/
│   │   ├── page.tsx
│   │   └── [arcano]/
│   ├── como-funciona/
│   └── api/
│       └── interpretar/
│
├── components/
│   ├── landing/
│   ├── tarot/
│   │   ├── TarotDeck.tsx
│   │   ├── TarotCard.tsx
│   │   ├── TarotCardBack.tsx
│   │   ├── TarotShuffle.tsx
│   │   ├── TarotDeal.tsx
│   │   ├── TarotFlip.tsx
│   │   └── TarotTable.tsx
│   ├── reading/
│   │   ├── ReadingProgress.tsx
│   │   ├── CardInspector.tsx
│   │   ├── ReadingInterpretation.tsx
│   │   └── ReadingChapter.tsx
│   └── ui/
│
├── services/
│   ├── tarot/
│   │   ├── shuffle.ts
│   │   ├── draw.ts
│   │   └── positions.ts
│   └── ai/
│       ├── interpretation.ts
│       └── prompts.ts
│
├── hooks/
│   ├── useTarotSession.ts
│   └── useCardAnimation.ts
│
└── types/
    └── tarot.ts
```

### Rutas sugeridas

  Ruta                     Responsabilidad
  ------------------------ ---------------------------
  `/`                      Landing principal
  `/lectura`               Configuración de consulta
  `/lectura/[sessionId]`   Mesa virtual y ritual
  `/biblioteca`            Biblioteca de arcanos
  `/biblioteca/[arcano]`   Galería por familia
  `/como-funciona`         Explicación del sistema

La ruta dinámica de lectura no implica base de datos. La sesión puede
mantenerse en estado de cliente y `sessionStorage`.

### Estado de sesión sugerido

Definir un modelo tipado que incluya:

-   `sessionId`
-   `question`
-   `category`
-   `locale`
-   `spreadType`
-   `cards`
-   `revealedCardIds`
-   `selectedCardId`
-   `phase`
-   `interpretation`
-   `interpretationStatus`
-   `createdAt`

La fase de la sesión debe ser explícita. Ejemplo:

``` ts
type ReadingPhase =
  | "preparing"
  | "shuffling"
  | "dealing"
  | "revealing"
  | "ready_to_interpret"
  | "interpreting"
  | "completed"
  | "error";
```

La máquina de estados debe impedir acciones fuera de orden. Por ejemplo,
no se puede solicitar interpretación antes de revelar las diez cartas.

------------------------------------------------------------------------

## 6. Fases de implementación

# FASE 0 --- Auditoría técnica y preparación

**Objetivo:** comprender el repositorio real y establecer una base
estable.

### Tareas

1.  Inspeccionar el repositorio completo.
2.  Identificar rutas, componentes, hooks y servicios existentes.
3.  Revisar el motor Fisher-Yates.
4.  Revisar cómo se asignan las diez posiciones de Cruz Celta.
5.  Revisar el endpoint actual de interpretación IA.
6.  Revisar proveedor, configuración y variables de entorno.
7.  Revisar el wrapper de cartas holográficas y la dependencia
    `cards-css`.
8.  Inventariar los PNG, reverso y demás recursos visuales.
9.  Verificar cuántas cartas existen realmente y cuáles faltan.
10. Revisar el comportamiento responsive.
11. Identificar errores de consola y deuda técnica.
12. Ejecutar la aplicación y las pruebas disponibles antes de modificar
    código.

### Entregables

-   Informe de auditoría.
-   Mapa de rutas y componentes.
-   Inventario de recursos.
-   Lista de problemas priorizados.
-   Propuesta de cambios compatible con el código existente.

### Criterios de aceptación

-   La aplicación actual continúa ejecutándose.
-   Se identifican las funcionalidades que deben conservarse.
-   No se inicia una reescritura innecesaria.
-   Las modificaciones propuestas están justificadas por hallazgos del
    repositorio.

------------------------------------------------------------------------

# FASE 1 --- Rediseño de landing page

**Objetivo:** mejorar la presentación y hacer que iniciar una consulta
sea claro e intuitivo.

### Sprint 1.1 --- Hero y navegación

-   Mejorar la navegación superior.
-   Crear un hero con jerarquía visual clara.
-   Dar protagonismo a las cartas personalizadas.
-   Incorporar movimiento ambiental sutil.
-   Mejorar el CTA principal.
-   Mejorar la legibilidad de textos y controles.

### Sprint 1.2 --- Formulario

-   Separar selección de categoría y pregunta.
-   Mejorar los estados seleccionado, hover, focus y error.
-   Validar la pregunta.
-   Mostrar el tipo de tirada seleccionado.
-   Preparar el inicio de sesión de lectura sin pago ni registro.

### Sprint 1.3 --- Secciones informativas

-   Mejorar la explicación del ritual.
-   Rediseñar el esquema de Cruz Celta.
-   Mejorar la biblioteca de arcanos.
-   Añadir previsualización de cartas.
-   Mejorar footer y navegación secundaria.

### Criterios de aceptación

-   El formulario inicia una sesión válida.
-   La landing es responsive.
-   Los CTA funcionan.
-   Los efectos no perjudican la legibilidad ni el rendimiento.

------------------------------------------------------------------------

# FASE 2 --- Sistema de cartas y animaciones

**Objetivo:** convertir los PNG planos en cartas visualmente vivas
mediante efectos de frontend.

### Componente de carta reutilizable

Crear o adaptar un componente común que admita:

-   Imagen frontal.
-   Imagen del reverso.
-   Estado boca arriba o boca abajo.
-   Orientación normal o invertida.
-   Estado de selección.
-   Estado de revelación.
-   Efectos holográficos configurables.
-   Tamaño y variante visual.

### Efectos

1.  Inclinación 3D siguiendo el cursor.
2.  Reflejos dinámicos.
3.  Brillo holográfico.
4.  Efectos de profundidad y parallax.
5.  Rotación 3D para revelar.
6.  Destello al completar el giro.
7.  Respuesta táctil equivalente en móviles.

### Tecnología

-   Priorizar CSS 3D y transformaciones para las cartas.
-   Reutilizar `cards-css` si su integración actual es estable.
-   Reservar Three.js para partículas, ambiente u otros efectos que
    justifiquen su coste.
-   Evitar ejecutar múltiples motores de animación sobre el mismo
    elemento.

### Estados visuales

``` ts
type CardVisualState =
  | "face_down"
  | "flipping"
  | "face_up";
```

### Criterios de aceptación

-   Todas las cartas utilizan el componente reutilizable.
-   Se conserva la proporción del arte original.
-   El reverso personalizado funciona correctamente.
-   La interacción funciona con mouse, teclado y táctil.
-   Las animaciones no bloquean la navegación.

------------------------------------------------------------------------

# FASE 3 --- Motor del ritual y mesa virtual

**Objetivo:** implementar el flujo interactivo completo de Cruz Celta.

### Sprint 3.1 --- Preparación de tirada

-   Recibir pregunta, categoría e idioma.
-   Crear identificador de sesión.
-   Utilizar el motor de barajado existente.
-   Seleccionar diez cartas sin repetición.
-   Asignar las diez posiciones de Cruz Celta.
-   Determinar orientación normal o invertida según las reglas
    existentes.
-   Congelar el resultado de la tirada.

No duplicar el algoritmo de barajado si ya existe uno correcto.

### Sprint 3.2 --- Barajado visual

-   Mostrar el mazo boca abajo.
-   Crear animación de mezcla.
-   Utilizar profundidad y rotaciones.
-   Mostrar estado de preparación.
-   Permitir continuar al finalizar.

### Sprint 3.3 --- Distribución

-   Animar cada carta desde el mazo.
-   Ubicar las diez cartas en el esquema de Cruz Celta.
-   Utilizar animaciones escalonadas.
-   Mantener las cartas boca abajo.
-   Adaptar posiciones a desktop y móvil.

### Sprint 3.4 --- Revelación

-   Permitir seleccionar cartas.
-   Ejecutar flip 3D.
-   Mostrar ilustración, nombre y posición.
-   Actualizar contador de revelación.
-   Sincronizar selección con el inspector lateral.
-   Permitir volver a inspeccionar cartas reveladas.
-   No permitir modificar la tirada.

### Sprint 3.5 --- Finalización

-   Habilitar interpretación al completar 10/10.
-   Mostrar una transición hacia el resultado.
-   Mantener la tirada intacta durante todo el proceso.

### Criterios de aceptación

-   Las diez cartas son únicas.
-   Cada carta conserva su posición.
-   La distribución corresponde al motor de Cruz Celta existente.
-   Las cartas no cambian al revelarse.
-   No se puede solicitar interpretación antes de revelar todas las
    cartas.
-   La interacción es funcional en móvil y desktop.

------------------------------------------------------------------------

# FASE 4 --- Interpretación IA y presentación del resultado

**Objetivo:** mejorar la interpretación conservando la API gratuita
existente.

### Restricciones

-   No sustituir el proveedor actual.
-   No introducir pagos ni nuevos servicios comerciales.
-   No exponer API keys en el navegador.
-   No duplicar el endpoint existente.
-   No generar una nueva tirada al reintentar una interpretación.

### Tareas

1.  Auditar el endpoint existente.
2.  Conservar proveedor y configuración actuales.
3.  Mejorar la construcción del prompt.
4.  Enviar pregunta y categoría.
5.  Enviar las diez cartas y sus posiciones.
6.  Enviar orientación normal o invertida.
7.  Enviar el idioma solicitado.
8.  Solicitar coherencia entre cartas.
9.  Validar la respuesta.
10. Implementar estados de carga y error.
11. Permitir reintentar usando exactamente la misma tirada.
12. Mostrar el resultado por capítulos.

### Estructura de interpretación

-   Diagnóstico general.
-   Energía central.
-   Influencias y bloqueos.
-   Pasado y evolución.
-   Situación actual.
-   Futuro y tendencias.
-   Relaciones entre las cartas.
-   Guía práctica y conclusión.

### Criterios de aceptación

-   La IA recibe exactamente las diez cartas de la sesión.
-   La interpretación corresponde a la pregunta.
-   Se respeta el idioma seleccionado.
-   El resultado se presenta en secciones.
-   Los errores permiten reintentar sin cambiar las cartas.

------------------------------------------------------------------------

# FASE 5 --- Biblioteca interactiva de arcanos

**Objetivo:** mejorar la exploración de la baraja completa.

### Tareas

-   Presentar los 22 Arcanos Mayores.
-   Presentar Bastos, Copas, Espadas y Pentáculos.
-   Crear galerías por familia.
-   Incorporar previsualización de cartas.
-   Aplicar efectos holográficos al interactuar.
-   Mostrar nombre, número y significado.
-   Implementar modal de detalle.
-   Añadir navegación entre cartas.
-   Adaptar los textos a los idiomas disponibles.

### Criterios de aceptación

-   El catálogo utiliza los recursos reales existentes.
-   No se crean imágenes ficticias para completar cartas faltantes.
-   Se puede navegar por todas las familias disponibles.
-   La biblioteca funciona en móvil y desktop.

------------------------------------------------------------------------

# FASE 6 --- Pulido, rendimiento y despliegue

**Objetivo:** preparar la aplicación para producción en Vercel como
experiencia demostrativa funcional.

### Tareas

-   Revisar responsive en desktop, tablet y móvil.
-   Optimizar imágenes y generar WebP/AVIF cuando corresponda.
-   Implementar lazy loading.
-   Optimizar partículas y efectos ambientales.
-   Evitar animaciones costosas en dispositivos débiles.
-   Implementar `prefers-reduced-motion`.
-   Revisar accesibilidad de controles.
-   Revisar errores de consola.
-   Verificar endpoint de IA.
-   Probar varias sesiones consecutivas.
-   Verificar persistencia temporal de sesión.
-   Ejecutar pruebas unitarias y E2E.
-   Revisar tiempos de carga.
-   Verificar build de producción.
-   Validar despliegue en Vercel.

### Criterios de aceptación

La experiencia completa funciona desde el primer acceso hasta la
interpretación final, sin registro ni base de datos.

------------------------------------------------------------------------

## 7. Persistencia temporal y límites del proyecto

Como no se implementará una base de datos:

-   Mantener la sesión en estado de cliente.
-   Guardar una copia serializable en `sessionStorage`.
-   Recuperar la sesión al actualizar la página dentro de la misma
    pestaña.
-   Validar la estructura recuperada antes de utilizarla.
-   Manejar sesiones inexistentes o corruptas con una opción para
    iniciar una nueva consulta.

No prometer historial permanente. Si el usuario cierra la pestaña o
pierde los datos de sesión, no se garantiza su recuperación.

La IA seguirá ejecutándose desde el backend existente. El cliente no
debe llamar directamente a proveedores que requieran secretos.

------------------------------------------------------------------------

## 8. Reglas obligatorias para Antigravity

1.  No reconstruir desde cero la aplicación.
2.  No cambiar el proveedor de IA ni eliminar la integración existente.
3.  No incorporar autenticación, base de datos, Neon, PostgreSQL,
    Prisma, PayPal o suscripciones.
4.  No modificar el arte original de las cartas.
5.  No reemplazar el reverso personalizado por un recurso genérico.
6.  Mantener la identidad visual espacial de Universe Tarot.
7.  Evitar dependencias innecesarias.
8.  No implementar animaciones que bloqueen la interacción.
9.  No generar una nueva tirada al actualizar el estado visual de las
    cartas.
10. No exponer credenciales ni API keys en el navegador.
11. Mantener compatibilidad con Vercel.
12. Ejecutar pruebas después de cada fase.
13. No avanzar si existen errores críticos en la fase actual.
14. No sustituir componentes existentes sin documentar el motivo.
15. No introducir contenido de demostración en el flujo real de lectura.

------------------------------------------------------------------------

## 9. Protocolo de ejecución por fases

Antigravity debe trabajar de manera incremental.

Para cada fase:

1.  Leer el alcance y los criterios de aceptación.
2.  Inspeccionar los componentes relacionados.
3.  Presentar un plan breve de implementación.
4.  Ejecutar únicamente la fase autorizada.
5.  Ejecutar lint, typecheck, build y pruebas disponibles.
6.  Corregir errores introducidos.
7.  Documentar archivos creados, modificados y eliminados.
8.  Informar decisiones técnicas y limitaciones.
9.  Esperar validación antes de comenzar la siguiente fase.

No ejecutar todas las fases en una sola operación.

### Formato obligatorio del informe de cierre

-   Objetivo de la fase.
-   Funcionalidades implementadas.
-   Archivos modificados.
-   Dependencias agregadas o eliminadas.
-   Pruebas ejecutadas y resultados.
-   Errores pendientes.
-   Riesgos o decisiones técnicas.
-   Confirmación de criterios de aceptación.

------------------------------------------------------------------------

## 10. Orden de ejecución

  Orden   Fase     Resultado
  ------- -------- --------------------------------
  1       Fase 0   Auditoría y estabilidad
  2       Fase 1   Landing rediseñada
  3       Fase 2   Cartas holográficas y animadas
  4       Fase 3   Mesa virtual y ritual
  5       Fase 4   Interpretación IA mejorada
  6       Fase 5   Biblioteca interactiva
  7       Fase 6   Optimización y producción

La Fase 2 es especialmente importante: el sistema visual de cartas debe
quedar validado antes de construir todas las animaciones de la mesa.

------------------------------------------------------------------------

## 11. Primer prompt para Antigravity

Una vez incorporado este documento al repositorio, utilizar el siguiente
prompt:

> Lee completamente el documento `UNIVERSE_TAROT_ENGINEERING_PLAN.md`.
>
> Vamos a ejecutar el proyecto por fases. Por ahora, ejecuta
> exclusivamente la FASE 0 --- Auditoría técnica y preparación.
>
> Inspecciona el repositorio real, identifica la arquitectura, rutas,
> componentes, motor de tarot, integración de IA, recursos visuales y
> dependencias.
>
> No implementes todavía el rediseño ni modifiques funcionalidades.
> Primero entrega un informe técnico con:
>
> 1.  Arquitectura actual.
> 2.  Componentes que deben conservarse.
> 3.  Componentes que necesitan mejoras.
> 4.  Estado real del motor de Cruz Celta.
> 5.  Estado de la integración de IA.
> 6.  Inventario de recursos gráficos.
> 7.  Problemas técnicos detectados.
> 8.  Plan concreto para ejecutar la Fase 1.
>
> No incorpores autenticación, base de datos, pagos ni servicios
> comerciales.
>
> Espera mi aprobación antes de realizar cambios de la siguiente fase.

------------------------------------------------------------------------

## 12. Resultado final esperado

Universe Tarot debe convertirse en una experiencia web interactiva donde
el usuario:

-   Descubre la aplicación desde una landing visualmente premium.
-   Formula una pregunta y selecciona un enfoque.
-   Entra en un espacio cósmico de lectura.
-   Observa cómo se barajan las cartas.
-   Ve cómo diez cartas se distribuyen sobre la mesa.
-   Revela personalmente cada carta.
-   Inspecciona sus significados y posiciones.
-   Solicita una interpretación mediante IA.
-   Recibe una lectura profunda organizada y legible.

**Principio rector del proyecto:** cada animación debe reforzar el
ritual, cada interacción debe tener una respuesta clara y cada
componente debe contribuir a una experiencia coherente.

El resultado debe ser una aplicación funcional y convincente para un
portafolio profesional de desarrollo, preparada para evolucionar en el
futuro, pero sin implementar ahora infraestructura comercial que no
forma parte del alcance.
