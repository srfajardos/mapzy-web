import { califica } from './calificador';
import type { FiltrosCaza, Prospecto, RespuestaCaza } from './tipos';

const ENDPOINT = 'https://www.datos.gov.co/resource/p6dx-8zbt.json';

/**
 * Raíces de búsqueda enviadas a SECOP. Son deliberadamente amplias: el filtro
 * fino lo hace el calificador sobre el resultado. Buscar poco y puntuar mucho
 * sale más barato que pedirle a Socrata 70 condiciones LIKE.
 */
const RAICES_BUSQUEDA = [
  'TOPOGRAF', 'GEOLOG', 'GEOTECN', 'CATASTR', 'FOTOGRAMETR', 'BATIMETR',
  'LIDAR', 'DRON', 'GESTION DEL RIESGO', 'AMENAZA', 'CARTOGRAF',
  'HIDROGEOLOG', 'ORDENAMIENTO TERRITORIAL', 'GEORREFERENCIA',
];

const CAMPOS = [
  'id_del_proceso', 'referencia_del_proceso', 'entidad', 'departamento_entidad',
  'ciudad_entidad', 'nombre_del_procedimiento', 'descripci_n_del_procedimiento',
  'precio_base', 'fecha_de_publicacion_del', 'modalidad_de_contratacion',
  'tipo_de_contrato', 'duracion', 'unidad_de_duracion', 'urlproceso',
].join(',');

export const DEPARTAMENTOS_DISPONIBLES = [
  'Tolima', 'Huila', 'Cundinamarca', 'Distrito Capital de Bogotá',
  'Quindío', 'Caldas', 'Risaralda', 'Valle del Cauca', 'Meta', 'Boyacá',
];

/** Escapa comillas simples para SoQL. Sin esto, un nombre con apóstrofo rompe la consulta. */
function escapaSoql(valor: string): string {
  return valor.replace(/'/g, "''");
}

function clausulaTerminos(): string {
  const condiciones = RAICES_BUSQUEDA.flatMap((raiz) => [
    `upper(nombre_del_procedimiento) like '%${raiz}%'`,
    `upper(descripci_n_del_procedimiento) like '%${raiz}%'`,
  ]);
  return `(${condiciones.join(' OR ')})`;
}

function construyeWhere(filtros: FiltrosCaza): string {
  const desde = new Date(Date.now() - filtros.diasAtras * 86_400_000)
    .toISOString()
    .slice(0, 19);

  const partes: string[] = [
    `fecha_de_publicacion_del > '${desde}'`,
    `estado_de_apertura_del_proceso='Abierto'`,
    clausulaTerminos(),
  ];

  if (filtros.departamentos.length > 0) {
    const lista = filtros.departamentos.map((d) => `'${escapaSoql(d)}'`).join(',');
    partes.push(`departamento_entidad in(${lista})`);
  }
  if (filtros.montoMin > 0) partes.push(`precio_base >= ${Math.round(filtros.montoMin)}`);
  if (filtros.montoMax > 0) partes.push(`precio_base <= ${Math.round(filtros.montoMax)}`);

  return partes.join(' AND ');
}

interface FilaSecop {
  id_del_proceso?: string;
  referencia_del_proceso?: string;
  entidad?: string;
  departamento_entidad?: string;
  ciudad_entidad?: string;
  nombre_del_procedimiento?: string;
  descripci_n_del_procedimiento?: string;
  precio_base?: string;
  fecha_de_publicacion_del?: string;
  modalidad_de_contratacion?: string;
  tipo_de_contrato?: string;
  duracion?: string;
  unidad_de_duracion?: string;
  urlproceso?: { url?: string } | string;
}

function extraeUrl(campo: FilaSecop['urlproceso']): string {
  if (typeof campo === 'string') return campo;
  return campo?.url ?? '';
}

function aProspecto(fila: FilaSecop): Prospecto {
  const objeto = fila.nombre_del_procedimiento || fila.descripci_n_del_procedimiento || '';
  const precioBase = Number(fila.precio_base ?? 0) || 0;
  const departamento = fila.departamento_entidad ?? 'No definido';
  const modalidad = fila.modalidad_de_contratacion ?? 'No definida';
  const fechaPublicacion = fila.fecha_de_publicacion_del ?? '';

  const calificacion = califica({ objeto, precioBase, departamento, modalidad, fechaPublicacion });

  return {
    id: fila.id_del_proceso ?? '',
    referencia: fila.referencia_del_proceso ?? '',
    entidad: fila.entidad ?? 'Sin entidad',
    departamento,
    ciudad: fila.ciudad_entidad ?? '',
    objeto,
    precioBase,
    fechaPublicacion,
    modalidad,
    tipoContrato: fila.tipo_de_contrato ?? '',
    duracion: [fila.duracion, fila.unidad_de_duracion].filter(Boolean).join(' '),
    url: extraeUrl(fila.urlproceso),
    ...calificacion,
  };
}

const ORDEN_NIVEL: Record<'A' | 'B' | 'C', number> = { A: 0, B: 1, C: 2 };

/** Consulta SECOP II, califica cada proceso y devuelve los prospectos ordenados. */
export async function cazaProspectos(filtros: FiltrosCaza): Promise<RespuestaCaza> {
  const params = new URLSearchParams({
    $select: CAMPOS,
    $where: construyeWhere(filtros),
    $order: 'fecha_de_publicacion_del DESC',
    $limit: '1000',
  });

  const inicio = Date.now();
  const respuesta = await fetch(`${ENDPOINT}?${params}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(45_000),
  });
  const latenciaMs = Date.now() - inicio;

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`SECOP respondió ${respuesta.status}: ${detalle.slice(0, 300)}`);
  }

  const filas = (await respuesta.json()) as FilaSecop[];
  const umbral = ORDEN_NIVEL[filtros.nivelMinimo];

  const prospectos = filas
    .map(aProspecto)
    .filter((p) => ORDEN_NIVEL[p.nivel] <= umbral)
    .sort((a, b) => b.puntaje - a.puntaje || b.fechaPublicacion.localeCompare(a.fechaPublicacion));

  return {
    prospectos,
    total: filas.length,
    consultadoEn: new Date().toISOString(),
    latenciaMs,
  };
}
