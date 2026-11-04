export default function PoliticaDePrivacidadPage() {
  return (
    <article className="space-y-6 text-purple-100/90 text-sm sm:text-base leading-relaxed">
      <div className="border-b border-purple-500/25 pb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
          Privacidad y Seguridad
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Políticas de Privacidad y Protección de Datos
        </h1>
        <p className="text-xs text-purple-300/75 mt-2">
          Aplicación: <strong>Universe Tarot</strong> · Última actualización:
          Noviembre 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          1. Compromiso de Privacidad
        </h2>
        <p>
          En <strong>Universe Tarot</strong> respetamos profundamente la
          privacidad y confidencialidad de cada consultante. Esta Política de
          Privacidad describe qué información recopilamos, cómo se procesa
          durante tu lectura de tarot y cómo protegemos tus datos.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          2. Información Recopilada durante las Consultas
        </h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>
            <strong>Preguntas e intenciones de lectura:</strong> La pregunta o
            intención que escribes en el formulario de consulta se utiliza
            únicamente como prompt guía en tiempo real para generar la
            interpretación coherente de las 10 cartas de tu Cruz Celta.
          </li>
          <li>
            <strong>Datos técnicos básicos:</strong> Como cualquier aplicación
            web moderna, el servidor puede registrar datos técnicos anónimos
            (tipo de navegador, resolución de pantalla y tiempos de respuesta)
            con el único fin de garantizar el rendimiento y la seguridad del
            servicio.
          </li>
        </ul>
      </section>

      <section className="bg-purple-950/40 border border-cyan-400/35 rounded-2xl p-5 space-y-2">
        <h2 className="text-lg font-bold text-white">
          3. Privacidad en Pagos procesados por PayPal
        </h2>
        <p>
          Cuando adquieres un servicio o lectura de pago dentro de{" "}
          <strong>Universe Tarot</strong>, la transacción se realiza
          directamente a través de <strong className="text-cyan-200">PayPal</strong>.
        </p>
        <p>
          <strong>Universe Tarot</strong> nunca tiene acceso a los datos
          privados de tu tarjeta de crédito, cuenta bancaria ni contraseña de
          PayPal. Únicamente recibimos por parte de PayPal el identificador de
          confirmación de la transacción y el estado del pago para habilitar tu
          servicio. El tratamiento de tus datos financieros se rige por la
          Política de Privacidad oficial de PayPal.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          4. Procesamiento mediante Inteligencia Artificial
        </h2>
        <p>
          Para generar la interpretación personalizada de la tirada de Cruz
          Celta, la aplicación envía únicamente el tema seleccionado, el texto
          de tu pregunta y los nombres de las 10 cartas obtenidas al motor de
          IA configurado. No se envían nombres reales, correos electrónicos ni
          identificadores personales junto con la consulta del tarot.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          5. Uso de Cookies y Almacenamiento Local
        </h2>
        <p>
          <strong>Universe Tarot</strong> utiliza almacenamiento técnico mínimo
          necesario para mantener el estado de la sesión de lectura y las
          preferencias visuales de la interfaz. No vendemos ni cedemos datos de
          navegación a terceros con fines publicitarios.
        </p>
      </section>
    </article>
  );
}

