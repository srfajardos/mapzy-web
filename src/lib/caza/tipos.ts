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
}

export interface FiltrosCaza {
  departamentos: string[];
  diasAtras: number;
  montoMin: number;
  montoMax: number;
  nivelMinimo: 'A' | 'B' | 'C';
}

export interface RespuestaCaza {
  prospectos: Prospecto[];
  total: number;
  consultadoEn: string;
  /** Milisegundos que tardó SECOP en responder. */
  latenciaMs: number;
}
