/**
 * Familias tematicas de busqueda. Cada una aporta dos cosas: las raices que
 * se mandan a SECOP en la consulta, y el peso con que puntua el calificador
 * cuando el objeto contractual coincide.
 *
 * El peso refleja que tan directamente ejecuta Mapzy ese trabajo sin
 * subcontratar ni aprender nada nuevo, no que tan grande es el mercado.
 */
export interface FamiliaTematica {
  id: string;
  nombre: string;
  descripcion: string;
  /** Puntos de tema sobre 40 cuando el objeto coincide con esta familia. */
  peso: number;
  /**
   * Raices en mayuscula y sin tildes. Coinciden por INICIO de palabra, con
   * sufijo libre: TOPOGRAF cubre topografia, topografico y topografo.
   */
  raices: string[];
  /**
   * Siglas y palabras cortas. Coinciden por palabra COMPLETA. Como prefijo
   * darian falsos positivos absurdos: SIG dentro de "Sigrid", POT dentro de
   * "potable", PTO dentro de "punto".
   */
  siglas: string[];
  /** Linea de servicio que se sugiere en la ficha del prospecto. */
  servicio: string;
}

export const FAMILIAS: FamiliaTematica[] = [
  {
    id: 'topografia',
    nombre: 'Topografía y geomática',
    descripcion: 'Levantamientos, dron, fotogrametría, LiDAR, batimetría',
    peso: 40,
    raices: [
      'TOPOGRAF', 'FOTOGRAMETR', 'AEROFOTOGRAF', 'BATIMETR',
            'GEORREFERENCIA', 'LEVANTAMIENTO', 'DRON',
    ],
    siglas: ['LIDAR'],
    servicio: 'Topografía y Geomática',
  },
  {
    id: 'cartografia',
    nombre: 'Cartografía y SIG',
    descripcion: 'Cartografía, sistemas de información geográfica, geoespacial',
    peso: 38,
    raices: [
      'CARTOGRAF', 'GEOESPACIAL', 'GEOGRAFIC',
            'SISTEMA DE INFORMACION GEOGRAFICA',
    ],
    siglas: ['SIG'],
    servicio: 'Cartografía y SIG',
  },
  {
    id: 'catastro',
    nombre: 'Catastro y predial',
    descripcion: 'Actualización catastral, linderos, reconocimiento predial',
    peso: 38,
    raices: [
      'CATASTR', 'PREDIAL', 'LINDERO',
    ],
    siglas: [],
    servicio: 'Catastro y Linderos',
  },
  {
    id: 'geologia',
    nombre: 'Geología y geotecnia',
    descripcion: 'Geología, geotecnia, hidrogeología, geomorfología',
    peso: 32,
    raices: [
      'GEOLOG', 'GEOTECN', 'HIDROGEOLOG', 'GEOMORFOLOG',
    ],
    siglas: [],
    servicio: 'Geología y Geotecnia',
  },
  {
    id: 'riesgo',
    nombre: 'Gestión del riesgo',
    descripcion: 'PMGRD, EMRE, amenaza, vulnerabilidad, remoción en masa',
    peso: 32,
    raices: [
      'GESTION DEL RIESGO', 'AMENAZA', 'VULNERABILIDAD',
            'DESLIZAMIENTO', 'REMOCION EN MASA',
    ],
    siglas: ['PMGRD', 'EMRE'],
    servicio: 'Geología y Gestión del Riesgo',
  },
  {
    id: 'mineria',
    nombre: 'Minería',
    descripcion: 'Títulos mineros, PTO, cubicación, cubaje ANM',
    peso: 30,
    raices: [
      'MINER', 'CUBICACION', 'CUBAJE', 'TITULO MINERO',
            'PLAN DE TRABAJOS Y OBRAS',
    ],
    siglas: ['PTO'],
    servicio: 'Minería y Cubicación ANM',
  },
  {
    id: 'ordenamiento',
    nombre: 'Ordenamiento territorial',
    descripcion: 'POT, EOT, PBOT, ordenamiento del territorio',
    peso: 26,
    raices: [
      'ORDENAMIENTO TERRITORIAL',
    ],
    siglas: ['POT', 'EOT', 'PBOT'],
    servicio: 'Ordenamiento Territorial',
  },
  {
    id: 'ambiental',
    nombre: 'Ambiental',
    descripcion: 'PMA, estudios de impacto, cuencas, licencias ambientales',
    peso: 20,
    raices: [
      'AMBIENTAL', 'PLAN DE MANEJO', 'IMPACTO AMBIENTAL',
            'CUENCA', 'LICENCIA AMBIENTAL',
    ],
    siglas: ['PMA', 'EIA'],
    servicio: 'Consultoría Ambiental',
  },
];

/** Peso que reciben los terminos que el usuario escribe a mano. */
export const PESO_TERMINO_PROPIO = 40;

export const IDS_FAMILIAS = FAMILIAS.map((f) => f.id);

export const FAMILIAS_POR_DEFECTO = ['topografia', 'cartografia', 'catastro', 'riesgo'];

const PORID = new Map(FAMILIAS.map((f) => [f.id, f]));

export function buscaFamilia(id: string): FamiliaTematica | undefined {
  return PORID.get(id);
}

/**
 * Normaliza un termino escrito por el usuario al formato de las raices:
 * mayusculas, sin tildes y sin caracteres que puedan romper el SoQL.
 */
export function normalizaTermino(termino: string): string {
  return termino
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9 ]/g, '')
    .trim();
}
