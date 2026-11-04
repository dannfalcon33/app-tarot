export default function TerminosYCondicionesPage() {
  return (
    <article className="space-y-6 text-purple-100/90 text-sm sm:text-base leading-relaxed">
      <div className="border-b border-purple-500/25 pb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
          Documento Legal Oficial
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Términos y Condiciones Generales
        </h1>
        <p className="text-xs text-purple-300/75 mt-2">
          Aplicación: <strong>Universe Tarot</strong> · Última actualización:
          Noviembre 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          1. Titularidad y Objeto del Servicio
        </h2>
        <p>
          Bienvenido a <strong>Universe Tarot</strong>. El presente documento
          regula los términos y condiciones aplicables al acceso, navegación y
          contratación de servicios digitales ofrecidos a través de esta
          aplicación web. La plataforma, su código fuente, su motor de lectura
          en Cruz Celta y las ilustraciones personalizadas de la baraja son de
          titularidad exclusiva de la administración de{" "}
          <strong>Universe Tarot</strong>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          2. Descripción del Servicio
        </h2>
        <p>
          <strong>Universe Tarot</strong> proporciona una plataforma interactiva
          para realizar tiradas de tarot basadas en la estructura tradicional de
          la Cruz Celta (10 cartas), acompañadas de una biblioteca de consulta
          de los Arcanos Mayores y Menores, así como lecturas e interpretaciones
          generadas con apoyo de modelos de Inteligencia Artificial a partir de
          la pregunta o intención formulada por el usuario.
        </p>
      </section>

      <section className="bg-purple-950/40 border border-cyan-400/35 rounded-2xl p-5 space-y-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-cyan-300">✦</span>
          <span>3. Medios de Pago y Facturación (Exclusivo vía PayPal)</span>
        </h2>
        <p>
          Todos los pagos correspondientes a lecturas extendidas, consultas
          especiales, suscripciones o funciones premium dentro de{" "}
          <strong>Universe Tarot</strong> se gestionan y procesan de forma
          exclusiva a través de la pasarela oficial de{" "}
          <strong className="text-cyan-200">PayPal</strong>.
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-purple-100/85 pt-1">
          <li>
            <strong>Seguridad en las transacciones:</strong> El procesamiento
            del pago se realiza íntegramente en el entorno cifrado y seguro de
            PayPal (ya sea mediante saldo de cuenta PayPal o tarjetas de débito
            y crédito admitidas por dicha plataforma).
          </li>
          <li>
            <strong>Sin almacenamiento de datos bancarios:</strong>{" "}
            <strong>Universe Tarot</strong> no solicita, procesa ni almacena en
            sus servidores números de tarjetas de crédito, códigos CVV ni
            credenciales financieras del usuario.
          </li>
          <li>
            <strong>Confirmación inmediata:</strong> Una vez confirmado el pago
            por parte de PayPal, el acceso a la lectura o funcionalidad digital
            adquirida se habilita de forma inmediata en la sesión del usuario.
          </li>
          <li>
            <strong>Política de servicios digitales:</strong> Dado que las
            tiradas e interpretaciones personalizadas son productos digitales de
            entrega y consumo inmediato, una vez generada y entregada la lectura
            completa no procede el reembolso salvo fallo técnico verificable del
            sistema que haya impedido la visualización del resultado.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          4. Propiedad Intelectual
        </h2>
        <p>
          Todas las imágenes de los Arcanos Mayores, Arcanos Menores (Bastos,
          Copas, Espadas y Pentáculos), el diseño del reverso oficial (
          <code>reverse-universe.webp</code>), logotipos, textos descriptivos e
          interfaces visuales pertenecen a <strong>Universe Tarot</strong>.
          Queda prohibida su reproducción, distribución comercial o extracción
          no autorizada sin el consentimiento expreso del titular.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          5. Modificaciones de los Términos
        </h2>
        <p>
          <strong>Universe Tarot</strong> se reserva el derecho de actualizar o
          modificar los presentes Términos y Condiciones en cualquier momento
          para adaptarlos a nuevas funcionalidades, mejoras del servicio o
          cambios normativos. Las modificaciones entrarán en vigor desde su
          publicación en esta página.
        </p>
      </section>
    </article>
  );
}

