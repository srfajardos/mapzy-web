import type { Prospecto } from './tipos';

/**
 * Calificador Mapzy. Puntúa 0-100 la afinidad de un proceso de SECOP II con
 * la capacidad real de la firma. Los pesos salen del histórico de negocios
 * cerrados (Neiva PMGRD $120M, PMA DJA-152 $32M, PARI 424 $18.5M, Posse $1.5M)
 * y de la matriz de tarifas por hectárea.
 */

/** Núcleo del negocio: levantamiento, dron y catastro. Máxima afinidad. */
export const TERMINOS_NUCLEO = [
  'TOPOGRAF', 'BATIMETR', 'FOTOGRAMETR', 'LIDAR', 'GEORREFERENCIA',
  'CATASTR', 'LEVANTAMIENTO PREDIAL', 'CUBICACION', 'CUBAJE',
  'PLAN DE TRABAJOS Y OBRAS', 'DRON', 'AEROFOTOGRAF',
];

/** Especialidad del fundador: geología y gestión del riesgo. Alta afinidad. */
export const TERMINOS_ESPECIALIDAD = [
  'GEOLOG', 'GEOTECN', 'HIDROGEOLOG', 'GESTION DEL RIESGO', 'PMGRD',
  'AMENAZA', 'VULNERABILIDAD', 'DESLIZAMIENTO', 'REMOCION EN MASA',
  'ORDENAMIENTO TERRITORIAL', 'SIG', 'SISTEMA DE INFORMACION GEOGRAFICA',
];

/** Adyacencias ambientales: entra, pero compite con muchas firmas. */
export const TERMINOS_ADYACENTES = [
  'AMBIENTAL', 'PLAN DE MANEJO', 'IMPACTO AMBIENTAL', 'CUENCA',
  'MINER', 'INTERVENTORIA', 'CARTOGRAF',
];

const PESOS_TERRITORIO: Record<string, number> = {
  'Tolima': 20,
  'Huila': 18,
  'Cundinamarca': 15,
  'Distrito Capital de Bogotá': 12,
  'Quindío': 11,
  'Caldas': 10,
  'Risaralda': 10,
  'Valle del Cauca': 8,
  'Meta': 8,
  'Boyacá': 8,
};

const PESOS_MODALIDAD: Record<string, number> = {
  'Mínima cuantía': 10,
  'Contratación directa': 9,
  'Concurso de méritos abierto': 8,
  'Selección abreviada menor cuantía': 7,
  'Selección abreviada subasta inversa': 5,
  'Licitación pública': 4,
};

/**
 * Compila una raiz a regex anclada al inicio de palabra. Sin este ancla,
 * "LIDAR" coincide dentro de "soLIDARio", "SIG" dentro de "aSIGnacion" y
 * "DRON" dentro de "paDRON": falsos positivos que envenenan el nivel A.
 * El sufijo queda libre para que TOPOGRAF cubra topografia y topografico.
 */
function aRegex(raiz: string): RegExp {
  // Las raices solo contienen letras y espacios, no requieren escape.
  return new RegExp('\\b' + raiz);
}

const RE_NUCLEO = TERMINOS_NUCLEO.map(aRegex);
const RE_ESPECIALIDAD = TERMINOS_ESPECIALIDAD.map(aRegex);
const RE_ADYACENTES = TERMINOS_ADYACENTES.map(aRegex);

function coincide(texto: string, patrones: RegExp[]): boolean {
  return patrones.some((re) => re.test(texto));
}

function normaliza(texto: string): string {
  return texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // quita tildes para comparar
}

/** Afinidad temática: hasta 40 puntos. */
function puntuaTema(objeto: string): { puntos: number; razon: string | null; servicio: string } {
  const t = normaliza(objeto);

  if (coincide(t, RE_NUCLEO)) {
    return {
      puntos: 40,
      razon: 'Objeto en el núcleo del negocio (levantamiento / dron / catastro)',
      servicio: 'Topografía y Geomática',
    };
  }
  if (coincide(t, RE_ESPECIALIDAD)) {
    return {
      puntos: 28,
      razon: 'Coincide con la especialidad del fundador (geología / gestión del riesgo)',
      servicio: 'Geología y Gestión del Riesgo',
    };
  }
  if (coincide(t, RE_ADYACENTES)) {
    return {
      puntos: 15,
      razon: 'Adyacente al portafolio; mayor competencia esperada',
      servicio: 'Consultoría Ambiental',
    };
  }
  return { puntos: 0, razon: null, servicio: 'Sin clasificar' };
}

/** Tamaño de ticket: hasta 25 puntos. Penaliza lo diminuto y lo inalcanzable. */
function puntuaTicket(precio: number): { puntos: number; razon: string } {
  if (precio <= 0) return { puntos: 0, razon: 'Sin presupuesto publicado' };
  if (precio < 3_000_000) return { puntos: 5, razon: 'Ticket muy pequeño: no cubre movilización' };
  if (precio < 8_000_000) return { puntos: 15, razon: 'Ticket pequeño pero viable' };
  if (precio <= 60_000_000) return { puntos: 25, razon: 'Ticket en el rango ideal de Mapzy' };
  if (precio <= 150_000_000) return { puntos: 18, razon: 'Ticket grande: exige respaldo financiero' };
  return { puntos: 8, razon: 'Ticket muy grande: probablemente requiere consorcio' };
}

/** Cercanía territorial: hasta 20 puntos. */
function puntuaTerritorio(departamento: string): { puntos: number; razon: string } {
  const puntos = PESOS_TERRITORIO[departamento] ?? 4;
  if (puntos >= 18) return { puntos, razon: `${departamento}: territorio base, viáticos mínimos` };
  if (puntos >= 10) return { puntos, razon: `${departamento}: alcance operativo razonable` };
  return { puntos, razon: `${departamento}: fuera del radio habitual, viáticos altos` };
}

/** Modalidad de contratación: hasta 10 puntos. */
function puntuaModalidad(modalidad: string): { puntos: number; razon: string } {
  const puntos = PESOS_MODALIDAD[modalidad] ?? 6;
  if (puntos >= 9) return { puntos, razon: `${modalidad}: trámite ágil, poca competencia` };
  if (puntos <= 4) return { puntos, razon: `${modalidad}: proceso largo y muy competido` };
  return { puntos, razon: modalidad };
}

/** Frescura de la publicación: hasta 5 puntos. */
function puntuaFrescura(fechaISO: string): { puntos: number; razon: string; dias: number } {
  const publicada = new Date(fechaISO).getTime();
  if (Number.isNaN(publicada)) return { puntos: 0, razon: 'Fecha no legible', dias: -1 };
  const dias = Math.floor((Date.now() - publicada) / 86_400_000);
  if (dias <= 7) return { puntos: 5, razon: `Publicado hace ${dias} día(s): ventana abierta`, dias };
  if (dias <= 15) return { puntos: 4, razon: `Publicado hace ${dias} días`, dias };
  if (dias <= 30) return { puntos: 3, razon: `Publicado hace ${dias} días`, dias };
  if (dias <= 60) return { puntos: 1, razon: `Publicado hace ${dias} días: probablemente cerrado`, dias };
  return { puntos: 0, razon: `Publicado hace ${dias} días: fuera de ventana`, dias };
}

/**
 * Formas contractuales que en la práctica son vinculación de una persona
 * natural, no consultoría contratable por una S.A.S. Puntúan alto por tema y
 * territorio, así que sin este castigo inundan el nivel A.
 */
const SENALES_NOMINA = [
  'PRESTACION DE SERVICIOS',
  'PRESTACION DE LOS SERVICIOS',
  'PRESTAR SERVICIOS',
  'PRESTAR LOS SERVICIOS',
  'PRESTAR SUS SERVICIOS',
  'APOYO A LA GESTION',
  'POR SUS PROPIOS MEDIOS Y CON PLENA AUTONOMIA',
  'SERVICIOS PERSONALES',
  'CONTRATO DE APOYO',
];

/** Señales de contrato-proyecto: la figura que Mapzy realmente puede ganar. */
const SENALES_PROYECTO = [
  'CONSULTORIA', 'ESTUDIOS Y DISENOS', 'INTERVENTORIA', 'ELABORACION DE',
  'LEVANTAMIENTO TOPOGRAFICO', 'ACTUALIZACION CATASTRAL', 'FORMULACION DEL',
  'ESTUDIO DE', 'DISENO DE',
];

const RE_NOMINA = SENALES_NOMINA.map(aRegex);
const RE_PROYECTO = SENALES_PROYECTO.map(aRegex);

/** Naturaleza del contrato: penaliza hasta -30 si es nómina disfrazada. */
function puntuaNaturaleza(objeto: string): { puntos: number; razon: string } {
  const t = normaliza(objeto);
  // La forma de contratacion manda sobre la actividad mencionada: un contrato
  // que dice "prestar los servicios profesionales" sigue siendo vinculacion de
  // personal aunque el objeto nombre una actualizacion catastral.
  if (coincide(t, RE_NOMINA)) {
    return { puntos: -30, razon: 'Parece vinculacion de personal, no consultoria: prioridad baja para la firma' };
  }
  if (coincide(t, RE_PROYECTO)) {
    return { puntos: 0, razon: 'Contrato de proyecto o consultoria: encaja con la figura de Mapzy S.A.S.' };
  }
  return { puntos: 0, razon: '' };
}

export function nivelDesdePuntaje(puntaje: number): 'A' | 'B' | 'C' {
  if (puntaje >= 70) return 'A';
  if (puntaje >= 50) return 'B';
  return 'C';
}

/** Aplica el calificador completo sobre el objeto contractual y sus metadatos. */
export function califica(datos: {
  objeto: string;
  precioBase: number;
  departamento: string;
  modalidad: string;
  fechaPublicacion: string;
}): Pick<Prospecto, 'puntaje' | 'nivel' | 'razones' | 'servicioSugerido'> {
  const tema = puntuaTema(datos.objeto);
  const ticket = puntuaTicket(datos.precioBase);
  const territorio = puntuaTerritorio(datos.departamento);
  const modalidad = puntuaModalidad(datos.modalidad);
  const frescura = puntuaFrescura(datos.fechaPublicacion);
  const naturaleza = puntuaNaturaleza(datos.objeto);

  const bruto =
    tema.puntos + ticket.puntos + territorio.puntos +
    modalidad.puntos + frescura.puntos + naturaleza.puntos;
  const puntaje = Math.max(0, Math.min(100, bruto));

  const razones = [
    tema.razon, naturaleza.razon, ticket.razon,
    territorio.razon, modalidad.razon, frescura.razon,
  ].filter((r): r is string => Boolean(r));

  return {
    puntaje,
    nivel: nivelDesdePuntaje(puntaje),
    razones,
    servicioSugerido: tema.servicio,
  };
}
