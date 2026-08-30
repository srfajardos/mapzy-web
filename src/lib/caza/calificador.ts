import { FAMILIAS, PESO_TERMINO_PROPIO, buscaFamilia } from './tematica';
import { buscaDepartamento, distanciaKm } from './territorio';
import type { IntensidadCercania, Prospecto } from './tipos';

/**
 * Calificador Mapzy. Puntúa 0-100 la afinidad de un proceso de SECOP II con
 * la capacidad real de la firma. Los pesos salen del histórico de negocios
 * cerrados (Neiva PMGRD $120M, PMA DJA-152 $32M, PARI 424 $18.5M, Posse $1.5M)
 * y de la matriz de tarifas por hectárea.
 *
 * Reparto máximo: tema 40, ticket 25, cercanía 20, modalidad 10, frescura 5.
 * La naturaleza del contrato resta hasta 30.
 */

/**
 * Valores reales de `modalidad_de_contratacion` en el dataset. La grafía debe
 * coincidir con la de SECOP: una clave inventada nunca puntúa.
 */
const PESOS_MODALIDAD: Record<string, number> = {
  'Mínima cuantía': 10,
  'Contratación directa': 9,
  'Contratación Directa (con ofertas)': 9,
  'Concurso de méritos abierto': 8,
  'Concurso de méritos con precalificación': 8,
  'Selección Abreviada de Menor Cuantía': 7,
  'Seleccion Abreviada Menor Cuantia Sin Manifestacion Interes': 7,
  'Contratación régimen especial': 6,
  'Contratación régimen especial (con ofertas)': 6,
  'Selección abreviada subasta inversa': 5,
  'Licitación pública': 4,
  'Licitación pública Obra Publica': 4,
  'Licitación Pública Acuerdo Marco de Precios': 3,
};

/**
 * Formas contractuales que en la práctica son vinculación de una persona
 * natural, no consultoría contratable por una S.A.S. Puntúan alto por tema y
 * territorio, así que sin este castigo inundan el nivel A.
 */
const SENALES_NOMINA = [
  'APOYO A LA GESTION',
  'POR SUS PROPIOS MEDIOS Y CON PLENA AUTONOMIA',
  'SERVICIOS PERSONALES',
  'CONTRATO DE APOYO',
];

/**
 * Todas las formas de "prestacion de servicios" en un solo patron. Enumerar
 * las variantes como cadenas sueltas no da abasto: SECOP trae desde
 * "PRESTAR SUS SERVICIOS" hasta redacciones sin preposicion como
 * "PRESTACION LOS SERVICIOS", y cada una que falte se cuela al nivel A.
 */
const RE_PRESTACION_SERVICIOS =
  /\bPRESTA(R|CION)\s+(DE\s+)?(LOS\s+|SUS\s+|EL\s+)?SERVICIOS?/;

/** Señales de contrato-proyecto: la figura que Mapzy realmente puede ganar. */
const SENALES_PROYECTO = [
  'CONSULTORIA', 'ESTUDIOS Y DISENOS', 'INTERVENTORIA', 'ELABORACION DE',
  'LEVANTAMIENTO TOPOGRAFICO', 'ACTUALIZACION CATASTRAL', 'FORMULACION DEL',
  'ESTUDIO DE', 'DISENO DE',
];

/**
 * Compila una raíz a regex anclada al inicio de palabra. Sin este ancla,
 * "LIDAR" coincide dentro de "soLIDARio", "SIG" dentro de "aSIGnacion" y
 * "DRON" dentro de "paDRON": falsos positivos que envenenan el nivel A.
 * El sufijo queda libre para que TOPOGRAF cubra topografia y topografico.
 */
export function aRegex(raiz: string): RegExp {
  // Las raices solo contienen letras, digitos y espacios: no requieren escape.
  return new RegExp('\\b' + raiz);
}

/** Igual que aRegex pero exigiendo palabra completa a ambos lados. */
export function aRegexExacta(sigla: string): RegExp {
  return new RegExp('\\b' + sigla + '\\b');
}

function coincide(texto: string, patrones: RegExp[]): boolean {
  return patrones.some((re) => re.test(texto));
}

const RE_NOMINA = [...SENALES_NOMINA.map(aRegex), RE_PRESTACION_SERVICIOS];
const RE_PROYECTO = SENALES_PROYECTO.map(aRegex);

/** Regex por familia, compilados una sola vez. */
const RE_FAMILIAS = new Map(
  FAMILIAS.map((f) => [f.id, [...f.raices.map(aRegex), ...f.siglas.map(aRegexExacta)]])
);

export function normaliza(texto: string): string {
  return texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // quita tildes para comparar
}

/**
 * Afinidad temática: hasta 40 puntos. Solo se consideran las familias activas,
 * de modo que buscar "cartografía" no premia por acertar en "ambiental".
 */
function puntuaTema(
  objeto: string,
  familiasActivas: string[],
  terminosPropios: string[]
): { puntos: number; razon: string | null; servicio: string } {
  const t = normaliza(objeto);

  let mejor = { puntos: 0, razon: null as string | null, servicio: 'Sin clasificar' };

  for (const id of familiasActivas) {
    const familia = buscaFamilia(id);
    const patrones = RE_FAMILIAS.get(id);
    if (!familia || !patrones) continue;
    if (familia.peso > mejor.puntos && coincide(t, patrones)) {
      mejor = {
        puntos: familia.peso,
        razon: `Coincide con ${familia.nombre.toLowerCase()}`,
        servicio: familia.servicio,
      };
    }
  }

  if (terminosPropios.length > 0 && PESO_TERMINO_PROPIO > mejor.puntos) {
    const acertados = terminosPropios.filter((term) => coincide(t, [aRegex(term)]));
    if (acertados.length > 0) {
      mejor = {
        puntos: PESO_TERMINO_PROPIO,
        razon: `Coincide con tu término: ${acertados.join(', ').toLowerCase()}`,
        servicio: 'Búsqueda personalizada',
      };
    }
  }

  return mejor;
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

/**
 * Cercanía a la base de operación: hasta 20 puntos, medida en kilómetros
 * reales entre capitales. Con intensidad "ninguna" todos los departamentos
 * reciben lo mismo, para que una búsqueda nacional no quede sesgada hacia casa.
 */
function puntuaCercania(
  departamento: string,
  base: string,
  intensidad: IntensidadCercania
): { puntos: number; razon: string; distancia: number | null } {
  const NEUTRO = 12;
  if (intensidad === 'ninguna') {
    return { puntos: NEUTRO, razon: 'Cercanía desactivada: ranking por mérito', distancia: null };
  }

  const origen = buscaDepartamento(base);
  const destino = buscaDepartamento(departamento);
  if (!origen || !destino) {
    return { puntos: 6, razon: `${departamento}: ubicación no determinada`, distancia: null };
  }

  const km = Math.round(distanciaKm(origen, destino));
  const tope = intensidad === 'alta' ? 20 : 12;

  let fraccion: number;
  let etiqueta: string;
  if (km === 0) {
    fraccion = 1;
    etiqueta = 'mismo departamento que la base';
  } else if (km <= 150) {
    fraccion = 0.9;
    etiqueta = `${km} km de la base: ida y vuelta en el día`;
  } else if (km <= 300) {
    fraccion = 0.7;
    etiqueta = `${km} km de la base: viaje corto`;
  } else if (km <= 550) {
    fraccion = 0.45;
    etiqueta = `${km} km de la base: exige pernoctar`;
  } else if (km <= 900) {
    fraccion = 0.25;
    etiqueta = `${km} km de la base: viáticos altos`;
  } else {
    fraccion = 0.1;
    etiqueta = `${km} km de la base: operación remota`;
  }

  return {
    puntos: Math.round(tope * fraccion),
    razon: `${departamento} — ${etiqueta}`,
    distancia: km,
  };
}

/** Modalidad de contratación: hasta 10 puntos. */
function puntuaModalidad(modalidad: string): { puntos: number; razon: string } {
  const puntos = PESOS_MODALIDAD[modalidad] ?? 6;
  if (puntos >= 9) return { puntos, razon: `${modalidad}: trámite ágil, poca competencia` };
  if (puntos <= 4) return { puntos, razon: `${modalidad}: proceso largo y muy competido` };
  return { puntos, razon: modalidad };
}

/** Frescura de la publicación: hasta 5 puntos. */
function puntuaFrescura(fechaISO: string): { puntos: number; razon: string } {
  const publicada = new Date(fechaISO).getTime();
  if (Number.isNaN(publicada)) return { puntos: 0, razon: 'Fecha no legible' };
  const dias = Math.floor((Date.now() - publicada) / 86_400_000);
  if (dias <= 7) return { puntos: 5, razon: `Publicado hace ${dias} día(s): ventana abierta` };
  if (dias <= 15) return { puntos: 4, razon: `Publicado hace ${dias} días` };
  if (dias <= 30) return { puntos: 3, razon: `Publicado hace ${dias} días` };
  if (dias <= 60) return { puntos: 1, razon: `Publicado hace ${dias} días: probablemente cerrado` };
  return { puntos: 0, razon: `Publicado hace ${dias} días: fuera de ventana` };
}

/**
 * Naturaleza del contrato: penaliza hasta -30 si es nómina disfrazada.
 * La forma de contratación manda sobre la actividad mencionada: un contrato
 * que dice "prestar los servicios profesionales" sigue siendo vinculación de
 * personal aunque el objeto nombre una actualización catastral.
 */
export function esNomina(objeto: string): boolean {
  return coincide(normaliza(objeto), RE_NOMINA);
}

function puntuaNaturaleza(objeto: string): { puntos: number; razon: string } {
  const t = normaliza(objeto);
  if (coincide(t, RE_NOMINA)) {
    return { puntos: -30, razon: 'Parece vinculación de personal, no consultoría: prioridad baja' };
  }
  if (coincide(t, RE_PROYECTO)) {
    return { puntos: 0, razon: 'Contrato de proyecto o consultoría: encaja con la figura de Mapzy S.A.S.' };
  }
  return { puntos: 0, razon: '' };
}

export function nivelDesdePuntaje(puntaje: number): 'A' | 'B' | 'C' {
  if (puntaje >= 70) return 'A';
  if (puntaje >= 50) return 'B';
  return 'C';
}

export interface DatosCalificacion {
  objeto: string;
  precioBase: number;
  departamento: string;
  modalidad: string;
  fechaPublicacion: string;
  familias: string[];
  terminosPropios: string[];
  baseOperacion: string;
  intensidadCercania: IntensidadCercania;
}

export function califica(
  datos: DatosCalificacion
): Pick<Prospecto, 'puntaje' | 'nivel' | 'razones' | 'servicioSugerido' | 'distanciaKm'> {
  const tema = puntuaTema(datos.objeto, datos.familias, datos.terminosPropios);
  const ticket = puntuaTicket(datos.precioBase);
  const cercania = puntuaCercania(datos.departamento, datos.baseOperacion, datos.intensidadCercania);
  const modalidad = puntuaModalidad(datos.modalidad);
  const frescura = puntuaFrescura(datos.fechaPublicacion);
  const naturaleza = puntuaNaturaleza(datos.objeto);

  const bruto =
    tema.puntos + ticket.puntos + cercania.puntos +
    modalidad.puntos + frescura.puntos + naturaleza.puntos;
  const puntaje = Math.max(0, Math.min(100, bruto));

  const razones = [
    tema.razon, naturaleza.razon, ticket.razon,
    cercania.razon, modalidad.razon, frescura.razon,
  ].filter((r): r is string => Boolean(r));

  return {
    puntaje,
    nivel: nivelDesdePuntaje(puntaje),
    razones,
    servicioSugerido: tema.servicio,
    distanciaKm: cercania.distancia,
  };
}
