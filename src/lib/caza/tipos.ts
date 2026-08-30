/** Cuánto pesa la cercanía a la base de operación dentro del puntaje. */
export type IntensidadCercania = 'alta' | 'media' | 'ninguna';

/** Un proceso de SECOP II ya calificado por el motor de caza. */
export interface Prospecto {
  id: string;
  referencia: string;
  entidad: string;
  departamento: string;
  ciudad: string;
  objeto: string;
  precioBase: number;
  fechaPublicacion: string;
  modalidad: string;
  tipoContrato: string;
  duracion: string;
  url: string;
  /** Puntaje 0-100 del calificador. */
  puntaje: number;
  /** A (>=70), B (50-69), C (<50). */
  nivel: 'A' | 'B' | 'C';
  /** Desglose legible de por qué obtuvo ese puntaje. */
  razones: string[];
  /** Línea de servicio Mapzy que mejor encaja. */
  servicioSugerido: string;
  /** Distancia en km desde la base de operación, o null si no se pudo ubicar. */
  distanciaKm: number | null;
}

export interface FiltrosCaza {
  /** Vacío significa toda Colombia. */
  departamentos: string[];
  /** Incluir procesos cuya entidad no declara departamento. */
  incluirSinDepartamento: boolean;
  /** Ids de familias temáticas activas. */
  familias: string[];
  /** Términos propios escritos por el usuario, ya normalizados. */
  terminosPropios: string[];
  /** Departamento desde el que se mide la cercanía. */
  baseOperacion: string;
  intensidadCercania: IntensidadCercania;
  diasAtras: number;
  montoMin: number;
  montoMax: number;
  /** Vacío significa todas las modalidades. */
  modalidades: string[];
  /** Si es false, se descartan los contratos con forma de vinculación de personal. */
  incluirNomina: boolean;
  nivelMinimo: 'A' | 'B' | 'C';
  limite: number;
}

export interface RespuestaCaza {
  prospectos: Prospecto[];
  /** Procesos que devolvió SECOP antes de filtrar por nivel. */
  total: number;
  /** true cuando SECOP devolvió exactamente el límite: hay más sin ver. */
  truncado: boolean;
  limite: number;
  consultadoEn: string;
  /** Milisegundos que tardó SECOP en responder. */
  latenciaMs: number;
}

/**
 * Estado de los filtros tal como los maneja la interfaz. Los numericos son
 * cadenas porque el campo debe poder quedar vacio mientras se escribe; la
 * conversion y el recorte a rango los hace el endpoint.
 */
export interface EstadoFiltros {
  departamentos: string[];
  incluirSinDepartamento: boolean;
  familias: string[];
  terminos: string;
  baseOperacion: string;
  intensidadCercania: IntensidadCercania;
  dias: string;
  montoMin: string;
  montoMax: string;
  modalidades: string[];
  incluirNomina: boolean;
  nivel: 'A' | 'B' | 'C';
  limite: string;
}

/** Un juego de filtros guardado por el usuario. */
export interface PerfilBusqueda {
  id: string;
  nombre: string;
  filtros: EstadoFiltros;
}
