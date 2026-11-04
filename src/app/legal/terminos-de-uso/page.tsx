export default function TerminosDeUsoPage() {
  return (
    <article className="space-y-6 text-purple-100/90 text-sm sm:text-base leading-relaxed">
      <div className="border-b border-purple-500/25 pb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
          Normas de la Plataforma
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Términos de Uso y Descargo de Responsabilidad
        </h1>
        <p className="text-xs text-purple-300/75 mt-2">
          Aplicación: <strong>Universe Tarot</strong> · Última actualización:
          Noviembre 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          1. Aceptación de las Condiciones de Uso
        </h2>
        <p>
          El uso de la aplicación <strong>Universe Tarot</strong> implica la
          aceptación plena de los presentes Términos de Uso. Si no estás de
          acuerdo con alguna de estas condiciones, te recomendamos abstenerte de
          utilizar la plataforma.
        </p>
      </section>

      <section className="bg-purple-950/40 border border-amber-400/35 rounded-2xl p-5 space-y-2">
        <h2 className="text-lg font-bold text-white">
          2. Naturaleza Orientativa del Tarot (Descargo de Responsabilidad)
        </h2>
        <p>
          Las tiradas de cartas y las interpretaciones generadas en{" "}
          <strong>Universe Tarot</strong> tienen un propósito estrictamente de{" "}
          <strong>
            reflexión personal, orientación espiritual, autoconocimiento y
            entretenimiento
          </strong>
          .
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-purple-100/85 pt-1">
          <li>
            <strong>No sustituye asesoramiento profesional:</strong> Ninguna
            lectura de esta aplicación constituye ni reemplaza el diagnóstico o
            consejo médico, psicológico, legal, financiero o contable de un
            profesional cualificado.
          </li>
          <li>
            <strong>Libre albedrío y responsabilidad:</strong> Las decisiones y
            acciones que el usuario tome a partir de la interpretación de su
            tirada son de su exclusiva responsabilidad personal.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">3. Mayoría de Edad</h2>
        <p>
          El uso de los servicios de consulta y en especial la contratación de
          servicios pagados a través de <strong>PayPal</strong> dentro de{" "}
          <strong>Universe Tarot</strong> están dirigidos a personas mayores de
          18 años o que cuenten con la capacidad legal necesaria en su país de
          residencia.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">
          4. Uso Adecuado de la Plataforma
        </h2>
        <p>El usuario se compromete a hacer un uso lícito y respetuoso de la aplicación, quedando prohibido:</p>
        <ul className="list-disc list-inside space-y-1.5">
          <li>
            Utilizar bots, scripts automatizados o ataques de denegación de
            servicio contra el endpoint de interpretación de IA.
          </li>
          <li>
            Introducir en el formulario de consulta contenidos ilícitos,
            amenazantes o que vulneren derechos de terceros.
          </li>
          <li>
            Copiar, redistribuir o comercializar las ilustraciones de la baraja
            o el código de la aplicación sin permiso del propietario.
          </li>
        </ul>
      </section>
    </article>
  );
}

