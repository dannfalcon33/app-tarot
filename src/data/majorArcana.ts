"use client";

export interface MajorArcanaCard {
  id: number;
  name: string;
  path: string;
  description: string;
  meaning: string;
}

export const MAJOR_ARCANA: MajorArcanaCard[] = [
  {
    id: 0,
    name: "El Loco",
    path: "/tarot/Arcanos Mayores/0 El Loco.png",
    description:
      "El inicio del viaje, la energía fresca y espontánea que se lanza al vacío con fe.",
    meaning:
      "Nuevos comienzos, tomar riesgos, confiar en el universo incluso si el camino aún no está claro.",
  },
  {
    id: 1,
    name: "El Mago",
    path: "/tarot/Arcanos Mayores/1 El Mago.png",
    description:
      "La canalización consciente de la energía, dominio de recursos y enfoque creativo.",
    meaning:
      "Manifestación, poder personal, utilizar tus talentos y habilidades para crear la realidad que deseas.",
  },
  {
    id: 2,
    name: "La Sacerdotisa",
    path: "/tarot/Arcanos Mayores/2 La Alta Sacerdotiza.png",
    description:
      "La sabiduría interior, el mundo oculto de la intuición y los misterios.",
    meaning:
      "Escuchar tu voz interior, confiar en tus corazonadas y permitir que lo oculto salga a la luz con paciencia.",
  },
  {
    id: 3,
    name: "La Emperatriz",
    path: "/tarot/Arcanos Mayores/3 La Emperatriz.png",
    description:
      "La energía maternal, creativa y abundante que nutre y hace florecer la vida.",
    meaning:
      "Crecimiento, fertilidad en proyectos o relaciones, conexión con la belleza, el cuerpo y el placer.",
  },
  {
    id: 4,
    name: "El Emperador",
    path: "/tarot/Arcanos Mayores/4 El Emperador.png",
    description:
      "La estructura, el liderazgo y la autoridad que da forma al mundo material.",
    meaning:
      "Tomar el control, establecer límites claros, liderar con firmeza pero también con responsabilidad.",
  },
  {
    id: 5,
    name: "El Papa",
    path: "/tarot/Arcanos Mayores/5 El Hierofante.png",
    description:
      "La tradición, la guía espiritual y el conocimiento que se transmite a través del tiempo.",
    meaning:
      "Buscar consejo, conectar con maestros o comunidades espirituales, honrar rituales y valores profundos.",
  },
  {
    id: 6,
    name: "Los Enamorados",
    path: "/tarot/Arcanos Mayores/6 Los Enamorados.png",
    description:
      "La unión, la elección consciente del corazón y la integración de polaridades.",
    meaning:
      "Decisiones importantes en el amor o en la vida, alineación entre lo que sientes y lo que haces.",
  },
  {
    id: 7,
    name: "El Carro",
    path: "/tarot/Arcanos Mayores/7 El Carro.png",
    description:
      "La fuerza de voluntad que impulsa hacia adelante y mantiene el rumbo.",
    meaning:
      "Avance, determinación, éxito a través de la disciplina y la confianza en tu dirección.",
  },
  {
    id: 8,
    name: "La Justicia",
    path: "/tarot/Arcanos Mayores/8 La Justicia.png",
    description:
      "El equilibrio, las consecuencias y la búsqueda de la verdad.",
    meaning:
      "Tomar decisiones justas, asumir responsabilidad, ver las situaciones con claridad y objetividad.",
  },
  {
    id: 9,
    name: "El Ermitaño",
    path: "/tarot/Arcanos Mayores/9 El Ermitano.png",
    description:
      "La introspección, el retiro consciente para encontrar la luz interior.",
    meaning:
      "Necesidad de tiempo a solas, reflexión profunda, búsqueda de sentido y sabiduría personal.",
  },
  {
    id: 10,
    name: "La Rueda de la Fortuna",
    path: "/tarot/Arcanos Mayores/10 La Rueda de la Fortuna.png",
    description:
      "Los ciclos del destino, los cambios inevitables que mueven la vida.",
    meaning:
      "Giros inesperados, oportunidades que aparecen, aceptar que todo cambia y adaptarse al flujo.",
  },
  {
    id: 11,
    name: "La Fuerza",
    path: "/tarot/Arcanos Mayores/11 La Fuerza.png",
    description:
      "La valentía suave, la compasión que doma la bestia interior y exterior.",
    meaning:
      "Control emocional, resiliencia, actuar con calma y amor incluso en situaciones desafiantes.",
  },
  {
    id: 12,
    name: "El Colgado",
    path: "/tarot/Arcanos Mayores/12 El Colgado.png",
    description:
      "La pausa necesaria para ver las cosas desde otra perspectiva.",
    meaning:
      "Soltar el control, rendirse al proceso, sacrificar algo temporalmente para un crecimiento mayor.",
  },
  {
    id: 13,
    name: "La Muerte",
    path: "/tarot/Arcanos Mayores/13 La Muerte.png",
    description:
      "El cierre de ciclos, la transformación profunda que abre espacio a lo nuevo.",
    meaning:
      "Finales necesarios, cambios inevitables, liberarte de lo que ya no tiene vida en tu camino.",
  },
  {
    id: 14,
    name: "La Templanza",
    path: "/tarot/Arcanos Mayores/14 La Templanza.png",
    description:
      "La alquimia interior, el equilibrio delicado entre extremos.",
    meaning:
      "Moderación, armonía, integración de opuestos, sanar a través de la paciencia y la serenidad.",
  },
  {
    id: 15,
    name: "El Diablo",
    path: "/tarot/Arcanos Mayores/15 El Diablo.png",
    description:
      "Las ataduras, los miedos y deseos que pueden encadenar si no se observan con conciencia.",
    meaning:
      "Dependencias, patrones repetitivos, ilusiones de limitación; invitación a reconocer y transformar esas cadenas.",
  },
  {
    id: 16,
    name: "La Torre",
    path: "/tarot/Arcanos Mayores/16 La Torre.png",
    description:
      "La ruptura de estructuras que ya no son auténticas para revelar la verdad.",
    meaning:
      "Cambios bruscos, revelaciones, derrumbe de algo que parecía estable pero estaba construido sobre bases frágiles.",
  },
  {
    id: 17,
    name: "La Estrella",
    path: "/tarot/Arcanos Mayores/17 La Estrella.png",
    description:
      "La esperanza, la sanación y la conexión con tu luz más pura.",
    meaning:
      "Renovación, fe en el futuro, inspiración, sentir que el universo te sostiene y guía.",
  },
  {
    id: 18,
    name: "La Luna",
    path: "/tarot/Arcanos Mayores/18 La Luna.png",
    description:
      "El mundo de los sueños, las emociones profundas y lo inconsciente.",
    meaning:
      "Confusión, intuiciones intensas, necesidad de navegar entre miedos y fantasías para encontrar la verdad.",
  },
  {
    id: 19,
    name: "El Sol",
    path: "/tarot/Arcanos Mayores/19 El Sol.png",
    description:
      "La claridad, la alegría y la vitalidad que iluminan el camino.",
    meaning:
      "Éxito, felicidad, energía positiva, momentos de claridad en los que todo se ve con optimismo.",
  },
  {
    id: 20,
    name: "El Juicio",
    path: "/tarot/Arcanos Mayores/20 El Juicio.png",
    description:
      "El llamado a despertar, reconciliar el pasado y renacer.",
    meaning:
      "Tomar decisiones importantes, perdonar, liberarte del peso del pasado y responder a una nueva vocación interna.",
  },
  {
    id: 21,
    name: "El Mundo",
    path: "/tarot/Arcanos Mayores/21 El Mundo.png",
    description:
      "La culminación del viaje, la sensación de totalidad y logro.",
    meaning:
      "Cierre exitoso de una etapa, integración, expansión y apertura a un nuevo ciclo desde un nivel más elevado.",
  },
];

