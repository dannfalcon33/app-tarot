"use client";

export interface MinorArcanaCard {
  id: number;
  name: string;
  path: string;
  suit: "Bastos" | "Copas" | "Espadas" | "Pentáculos";
  description: string;
  meaning: string;
}

export const MINOR_ARCANA_BASTOS: MinorArcanaCard[] = [
  {
    id: 1,
    name: "As de Bastos",
    path: "/tarot/Bastos/As de Bastos.png",
    suit: "Bastos",
    description:
      "Una chispa inicial de energía, creatividad e impulso para empezar algo nuevo.",
    meaning:
      "Inicio de proyectos, entusiasmo renovado, motivación para actuar y seguir tu pasión.",
  },
  {
    id: 2,
    name: "Dos de Bastos",
    path: "/tarot/Bastos/Dos de Bastos.png",
    suit: "Bastos",
    description:
      "La planificación y la visión de futuro antes de dar un gran paso.",
    meaning:
      "Tomar decisiones sobre el rumbo de tu vida, evaluar opciones y elegir con confianza.",
  },
  {
    id: 3,
    name: "Tres de Bastos",
    path: "/tarot/Bastos/Tres de Bastos.png",
    suit: "Bastos",
    description:
      "Esperar resultados tras haber dado un paso valiente hacia lo nuevo.",
    meaning:
      "Expansión, oportunidades que se abren, frutos que comienzan a verse tras tus esfuerzos.",
  },
  {
    id: 4,
    name: "Cuatro de Bastos",
    path: "/tarot/Bastos/Cuatro de Bastos.png",
    suit: "Bastos",
    description:
      "Celebración, estabilidad y momentos de alegría compartida con otros.",
    meaning:
      "Éxitos que se festejan, hogar armonioso, logros importantes que merecen reconocimiento.",
  },
  {
    id: 5,
    name: "Cinco de Bastos",
    path: "/tarot/Bastos/Cinco de Bastos.png",
    suit: "Bastos",
    description:
      "Tensiones, competencia y choques de opiniones que pueden ser caóticos.",
    meaning:
      "Conflictos menores, rivalidad, necesidad de aprender a cooperar o a defender tu postura.",
  },
  {
    id: 6,
    name: "Seis de Bastos",
    path: "/tarot/Bastos/Seis de Bastos.png",
    suit: "Bastos",
    description:
      "Reconocimiento público y la sensación de victoria tras un esfuerzo.",
    meaning:
      "Triunfo, elogios, sensación de orgullo por lo conseguido y confianza en ti mismo.",
  },
  {
    id: 7,
    name: "Siete de Bastos",
    path: "/tarot/Bastos/Siete de Bastos.png",
    suit: "Bastos",
    description:
      "Defender tu posición frente a desafíos y presiones externas.",
    meaning:
      "Mantenerte firme, poner límites, no ceder ante la oposición cuando sabes que tienes razón.",
  },
  {
    id: 8,
    name: "Ocho de Bastos",
    path: "/tarot/Bastos/Ocho de Bastos.png",
    suit: "Bastos",
    description:
      "Movimiento rápido, noticias que llegan y avances que se aceleran.",
    meaning:
      "Viajes, comunicaciones importantes, progreso veloz hacia una meta o situación que se desbloquea.",
  },
  {
    id: 9,
    name: "Nueve de Bastos",
    path: "/tarot/Bastos/Nueve de Bastos.png",
    suit: "Bastos",
    description:
      "Persistencia y resistencia a pesar del cansancio y las heridas del pasado.",
    meaning:
      "No rendirse, proteger lo que has logrado, cuidar tu energía pero seguir adelante.",
  },
  {
    id: 10,
    name: "Diez de Bastos",
    path: "/tarot/Bastos/Diez de Bastos.png",
    suit: "Bastos",
    description:
      "La carga pesada de responsabilidades que puede volverse abrumadora.",
    meaning:
      "Sobrecarga, estrés, necesidad de delegar o soltar peso que ya no te corresponde.",
  },
  {
    id: 11,
    name: "Sota de Bastos",
    path: "/tarot/Bastos/Sota de Bastos.png",
    suit: "Bastos",
    description:
      "Energía juvenil y curiosa que quiere explorar nuevas ideas y caminos.",
    meaning:
      "Mensajes, noticias emocionantes, ganas de aprender y dar los primeros pasos con valentía.",
  },
  {
    id: 12,
    name: "Caballero de Bastos",
    path: "/tarot/Bastos/Caballero de Bastos.png",
    suit: "Bastos",
    description:
      "Impulso apasionado, a veces impulsivo, que busca aventura y acción.",
    meaning:
      "Movimiento rápido, cambios súbitos, seguir tu instinto con valentía pero evitando la imprudencia.",
  },
  {
    id: 13,
    name: "Reina de Bastos",
    path: "/tarot/Bastos/Reina de Bastos.png",
    suit: "Bastos",
    description:
      "Confianza, magnetismo personal y la capacidad de inspirar a otros.",
    meaning:
      "Carisma, liderazgo cálido, creatividad expresada con seguridad y autenticidad.",
  },
  {
    id: 14,
    name: "Rey de Bastos",
    path: "/tarot/Bastos/Rey de Bastos.png",
    suit: "Bastos",
    description:
      "Visión, liderazgo y dominio sobre la energía creativa y emprendedora.",
    meaning:
      "Tomar el mando, dirigir proyectos, ser ejemplo de pasión, iniciativa y madurez en la acción.",
  },
];

export const MINOR_ARCANA_COPAS: MinorArcanaCard[] = [
  {
    id: 1,
    name: "As de Copas",
    path: "/tarot/Copas/As de Copas.png",
    suit: "Copas",
    description:
      "Un desborde de emociones, apertura del corazón y nuevas conexiones afectivas.",
    meaning:
      "Inicio de relaciones, sanación emocional, expresión sincera de lo que sientes.",
  },
  {
    id: 2,
    name: "Dos de Copas",
    path: "/tarot/Copas/Dos de Copas.png",
    suit: "Copas",
    description:
      "Encuentro armonioso entre dos energías que se reconocen y se apoyan.",
    meaning:
      "Alianzas, romance, acuerdos justos y relaciones basadas en reciprocidad.",
  },
  {
    id: 3,
    name: "Tres de Copas",
    path: "/tarot/Copas/Tres de Copas.png",
    suit: "Copas",
    description:
      "Celebración, amistades y momentos de alegría compartida en comunidad.",
    meaning:
      "Reuniones felices, apoyo de amigos, disfrutar y agradecer los buenos momentos.",
  },
  {
    id: 4,
    name: "Cuatro de Copas",
    path: "/tarot/Copas/Cuatro de Copas.png",
    suit: "Copas",
    description:
      "Un estado de apatía o desconexión emocional frente a lo que la vida ofrece.",
    meaning:
      "Insatisfacción, necesidad de mirar con nuevos ojos y valorar oportunidades que ya están presentes.",
  },
  {
    id: 5,
    name: "Cinco de Copas",
    path: "/tarot/Copas/Cinco de Copas.png",
    suit: "Copas",
    description:
      "Dolor emocional y enfoque en lo perdido más que en lo que permanece.",
    meaning:
      "Duelo, decepción, pero también posibilidad de sanar al reconocer lo que aún queda en pie.",
  },
  {
    id: 6,
    name: "Seis de Copas",
    path: "/tarot/Copas/Seis de Copas.png",
    suit: "Copas",
    description:
      "Recuerdos, nostalgia y el retorno a experiencias del pasado con ternura.",
    meaning:
      "Reencuentros, energía infantil, sanar el niño interior y disfrutar de lo sencillo.",
  },
  {
    id: 7,
    name: "Siete de Copas",
    path: "/tarot/Copas/Siete de Copas.png",
    suit: "Copas",
    description:
      "Muchas opciones y fantasías que pueden confundir o distraer.",
    meaning:
      "Necesidad de claridad, evitar ilusiones, elegir con el corazón pero con los pies en la tierra.",
  },
  {
    id: 8,
    name: "Ocho de Copas",
    path: "/tarot/Copas/Ocho de Copas.png",
    suit: "Copas",
    description:
      "Partir de algo conocido en búsqueda de una verdad o plenitud más profunda.",
    meaning:
      "Dejar atrás situaciones que ya no llenan, seguir un llamado interno hacia algo más auténtico.",
  },
  {
    id: 9,
    name: "Nueve de Copas",
    path: "/tarot/Copas/Nueve de Copas.png",
    suit: "Copas",
    description:
      "Satisfacción emocional y sensación de haber recibido un deseo cumplido.",
    meaning:
      "Placer, abundancia emocional, disfrutar de lo logrado y agradecer lo que tienes.",
  },
  {
    id: 10,
    name: "Diez de Copas",
    path: "/tarot/Copas/Diez de Copas.png",
    suit: "Copas",
    description:
      "Armonía familiar y plenitud afectiva que se comparte con otros.",
    meaning:
      "Felicidad en el hogar, relaciones plenas, sensación de paz y unión duradera.",
  },
  {
    id: 11,
    name: "Sota de Copas",
    path: "/tarot/Copas/Sota de Copas.png",
    suit: "Copas",
    description:
      "Sensibilidad, intuición y apertura a mensajes emocionales o creativos.",
    meaning:
      "Noticias amorosas, inspiración artística, escuchar tus sentimientos con curiosidad y ternura.",
  },
  {
    id: 12,
    name: "Caballero de Copas",
    path: "/tarot/Copas/Caballero de Copas.png",
    suit: "Copas",
    description:
      "Romanticismo en movimiento, búsqueda de experiencias intensas del corazón.",
    meaning:
      "Declaraciones amorosas, propuestas, seguir un ideal romántico o espiritual con entrega.",
  },
  {
    id: 13,
    name: "Reina de Copas",
    path: "/tarot/Copas/Reina de Copas.png",
    suit: "Copas",
    description:
      "Profunda empatía, intuición y capacidad de contener emocionalmente a otros.",
    meaning:
      "Escucha amorosa, comprensión, conexión con tu mundo interno y tu sensibilidad.",
  },
  {
    id: 14,
    name: "Rey de Copas",
    path: "/tarot/Copas/Rey de Copas.png",
    suit: "Copas",
    description:
      "Madurez emocional y capacidad de manejar sentimientos intensos con equilibrio.",
    meaning:
      "Compasión, liderazgo emocional, tomar decisiones desde el corazón pero con estabilidad.",
  },
];

export const MINOR_ARCANA_ESPADAS: MinorArcanaCard[] = [
  {
    id: 1,
    name: "As de Espadas",
    path: "/tarot/Espadas/1 As de Espadas.png",
    suit: "Espadas",
    description:
      "Una nueva idea, claridad mental y la fuerza de la verdad.",
    meaning:
      "Inicio de un nuevo entendimiento, decisiones claras, comunicación honesta y directa.",
  },
  {
    id: 2,
    name: "Dos de Espadas",
    path: "/tarot/Espadas/2 Dos de Espadas.png",
    suit: "Espadas",
    description:
      "Dilema y bloqueo mental, con dificultad para ver o elegir.",
    meaning:
      "Necesidad de tomar una decisión, levantar la venda y enfrentar la verdad con calma.",
  },
  {
    id: 3,
    name: "Tres de Espadas",
    path: "/tarot/Espadas/3 Tres de Espadas.png",
    suit: "Espadas",
    description:
      "Dolor, ruptura o palabras que han herido profundamente.",
    meaning:
      "Tristeza, separación, necesidad de procesar el dolor para poder sanar y seguir adelante.",
  },
  {
    id: 4,
    name: "Cuatro de Espadas",
    path: "/tarot/Espadas/4 Cuatro de Espadas.png",
    suit: "Espadas",
    description:
      "Pausa mental para descansar, integrar y recuperar energía.",
    meaning:
      "Retiro, descanso, meditación, tomar distancia para recuperar claridad y fuerza.",
  },
  {
    id: 5,
    name: "Cinco de Espadas",
    path: "/tarot/Espadas/5 Cinco de Espadas.png",
    suit: "Espadas",
    description:
      "Conflictos donde alguien gana a costa de otros, dejando tensión.",
    meaning:
      "Discusiones, victorias vacías, necesidad de revisar si vale la pena tener la razón a cualquier precio.",
  },
  {
    id: 6,
    name: "Seis de Espadas",
    path: "/tarot/Espadas/6 Seis de Espada.png",
    suit: "Espadas",
    description:
      "Transición hacia aguas más tranquilas después de un periodo difícil.",
    meaning:
      "Viajes, cambios graduales, dejar atrás situaciones complicadas para encontrar calma mental.",
  },
  {
    id: 7,
    name: "Siete de Espadas",
    path: "/tarot/Espadas/7 Siete de Espadas.png",
    suit: "Espadas",
    description:
      "Estrategias ocultas, evasión o acciones que no son del todo transparentes.",
    meaning:
      "Cuidado con engaños, actuar a escondidas o autoengaños; necesidad de ser honesto contigo y con otros.",
  },
  {
    id: 8,
    name: "Ocho de Espadas",
    path: "/tarot/Espadas/8 Ocho de Espadas.png",
    suit: "Espadas",
    description:
      "Sensación de estar atrapado por tus propios pensamientos y miedos.",
    meaning:
      "Limitaciones mentales, creencias que te atan; puedes liberarte si cambias la forma en que ves la situación.",
  },
  {
    id: 9,
    name: "Nueve de Espadas",
    path: "/tarot/Espadas/9 Nueve de Espadas.png",
    suit: "Espadas",
    description:
      "Preocupaciones, ansiedad y pensamientos que no te dejan descansar.",
    meaning:
      "Insomnio, culpa, darle demasiadas vueltas a algo; invita a pedir ayuda y a cuidar tu salud mental.",
  },
  {
    id: 10,
    name: "Diez de Espadas",
    path: "/tarot/Espadas/10 Diez de Espadas.png",
    suit: "Espadas",
    description:
      "Fin drástico de una situación, momento en el que ya no se puede caer más bajo.",
    meaning:
      "Cierre doloroso, traición o punto final; a partir de aquí solo queda levantarse y renacer.",
  },
  {
    id: 11,
    name: "Sota de Espadas",
    path: "/tarot/Espadas/Sota de Espadas.png",
    suit: "Espadas",
    description:
      "Curiosidad mental, ganas de aprender y observar con atención.",
    meaning:
      "Mensajes, estudios, necesidad de investigar más antes de actuar y comunicar con claridad.",
  },
  {
    id: 12,
    name: "Caballero de Espadas",
    path: "/tarot/Espadas/Caballero de Espadas.png",
    suit: "Espadas",
    description:
      "Acción rápida motivada por ideas fuertes y convicciones intensas.",
    meaning:
      "Impulso mental, discusiones, avanzar con decisión; cuidar la impulsividad en palabras y decisiones.",
  },
  {
    id: 13,
    name: "Reina de Espadas",
    path: "/tarot/Espadas/Reina de Espadas.png",
    suit: "Espadas",
    description:
      "Claridad, independencia y capacidad de decir la verdad sin adornos.",
    meaning:
      "Pensamiento crítico, honestidad, poner límites desde la razón y la experiencia.",
  },
  {
    id: 14,
    name: "Rey de Espadas",
    path: "/tarot/Espadas/Rey de Espadas.png",
    suit: "Espadas",
    description:
      "Dominio mental, justicia y capacidad de tomar decisiones objetivas.",
    meaning:
      "Autoridad intelectual, análisis, liderazgo basado en la verdad y la lógica.",
  },
];

export const MINOR_ARCANA_PENTACULOS: MinorArcanaCard[] = [
  {
    id: 1,
    name: "As de Pentáculos",
    path: "/tarot/Pentaculos/As de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Semilla de abundancia material, oportunidad concreta que empieza a manifestarse.",
    meaning:
      "Nuevas oportunidades laborales o económicas, inicio de proyectos sólidos en el mundo material.",
  },
  {
    id: 2,
    name: "Dos de Pentáculos",
    path: "/tarot/Pentaculos/Dos de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Equilibrio dinámico entre varias responsabilidades y recursos.",
    meaning:
      "Organización, priorizar, adaptarte con flexibilidad a cambios financieros o de tiempo.",
  },
  {
    id: 3,
    name: "Tres de Pentáculos",
    path: "/tarot/Pentaculos/Tres de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Trabajo en equipo, maestría en desarrollo y reconocimiento profesional.",
    meaning:
      "Colaboración, proyectos compartidos, construir algo sólido con ayuda de otros.",
  },
  {
    id: 4,
    name: "Cuatro de Pentáculos",
    path: "/tarot/Pentaculos/Cuatro de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Apego y necesidad de controlar o retener recursos por miedo a perderlos.",
    meaning:
      "Ahorro, rigidez, revisar tu relación con el dinero y el miedo a la escasez.",
  },
  {
    id: 5,
    name: "Cinco de Pentáculos",
    path: "/tarot/Pentaculos/Cinco de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Sensación de carencia, exclusión o dificultad material que pesa.",
    meaning:
      "Retos económicos o físicos, pedir apoyo, recordar que hay ayuda disponible aunque cueste verla.",
  },
  {
    id: 6,
    name: "Seis de Pentáculos",
    path: "/tarot/Pentaculos/Seis de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Dar y recibir en equilibrio, generosidad y reparto justo de recursos.",
    meaning:
      "Ayudar a otros o recibir ayuda, equilibrio entre compartir y cuidar tus propias necesidades.",
  },
  {
    id: 7,
    name: "Siete de Pentáculos",
    path: "/tarot/Pentaculos/Siete de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Pausa para evaluar el crecimiento de lo que has sembrado con paciencia.",
    meaning:
      "Esperar resultados, revisar estrategias, ajustar tu inversión de tiempo y energía.",
  },
  {
    id: 8,
    name: "Ocho de Pentáculos",
    path: "/tarot/Pentaculos/Ocho de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Trabajo constante, aprendizaje y perfeccionamiento de una habilidad.",
    meaning:
      "Disciplina, práctica, mejorar tu oficio o habilidades para construir estabilidad a largo plazo.",
  },
  {
    id: 9,
    name: "Nueve de Pentáculos",
    path: "/tarot/Pentaculos/Nueve de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Autonomía, disfrute de lo logrado y sensación de seguridad personal.",
    meaning:
      "Independencia financiera, bienestar material, orgullo por lo que has construido por ti mismo.",
  },
  {
    id: 10,
    name: "Diez de Pentáculos",
    path: "/tarot/Pentaculos/Diez de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Abundancia compartida, legado familiar y estabilidad a largo plazo.",
    meaning:
      "Patrimonio, hogar sólido, proyectos que trascienden generaciones y construyen seguridad duradera.",
  },
  {
    id: 11,
    name: "Sota de Pentáculos",
    path: "/tarot/Pentaculos/Sota de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Aprendizaje práctico, enfoque en estudios, trabajo o proyectos concretos.",
    meaning:
      "Nuevas oportunidades de estudio o trabajo, ganas de aprender y desarrollarte en lo material.",
  },
  {
    id: 12,
    name: "Caballero de Pentáculos",
    path: "/tarot/Pentaculos/Caballero de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Constancia, responsabilidad y avanzar con pasos seguros aunque lentos.",
    meaning:
      "Esfuerzo sostenido, disciplina, construir resultados estables a través de la perseverancia.",
  },
  {
    id: 13,
    name: "Reina de Pentáculos",
    path: "/tarot/Pentaculos/Reina de Pentaculos.png",
    suit: "Pentáculos",
    description:
      "Energía nutritiva y práctica que cuida tanto el bienestar como lo material.",
    meaning:
      "Generosidad, cuidado del hogar y del cuerpo, disfrutar de la abundancia con sentido práctico.",
  },
  {
    id: 14,
    name: "Rey de Pentáculos",
    path: "/tarot/Pentaculos/Rey de Pentáculos.png",
    suit: "Pentáculos",
    description:
      "Dominio del mundo material, éxito y solidez construidos con paciencia.",
    meaning:
      "Estabilidad económica, liderazgo responsable, disfrutar de lo logrado y compartirlo de forma sabia.",
  },
];

