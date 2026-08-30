import { califica, esNomina } from './calificador';
import { buscaFamilia } from './tematica';
import { SIN_DEPARTAMENTO } from './territorio';
import type { FiltrosCaza, Prospecto, RespuestaCaza } from './tipos';

export { MODALIDADES } from './modalidades';

const ENDPOINT = 'https://www.datos.gov.co/resource/p6dx-8zbt.json';

const CAMPOS = [
  'id_del_proceso', 'referencia_del_proceso', 'entidad', 'departamento_entidad',
  'ciudad_entidad', 'nombre_del_procedimiento', 'descripci_n_del_procedimiento',
  'precio_base', 'fecha_de_publicacion_del', 'modalidad_de_contratacion',
  'tipo_de_contrato', 'duracion', 'unidad_de_duracion', 'urlproceso',
].join(',');

/** Escapa comillas simples para SoQL. Sin esto, un apóstrofo rompe la consulta. */
function escapaSoql(valor: string): string {
  return valor.replace(/'/g, "''");
}

/**
 * Une las raíces de las familias activas con los términos propios del usuario.
 * Si no queda ninguna, la consulta no filtra por texto y devuelve todo lo que
 * pase por territorio y fecha.
 */
interface Patron {
  texto: string;
  /** true si debe aparecer como palabra suelta y no como fragmento. */
  exacta: boolean;
}

function raicesActivas(filtros: FiltrosCaza): Patron[] {
  const patrones: Patron[] = [];
  for (const id of filtros.familias) {
    const familia = buscaFamilia(id);
    if (!familia) continue;
    for (const r of familia.raices) patrones.push({ texto: r, exacta: false });
    for (const g of familia.siglas) patrones.push({ texto: g, exacta: true });
  }
  for (const t of filtros.terminosPropios) patrones.push({ texto: t, exacta: false });

  const vistos = new Set<string>();
  return patrones.filter((p) => {
    const clave = `${p.texto}|${p.exacta}`;
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
}

function clausulaTerminos(patrones: Patron[]): string | null {
  if (patrones.length === 0) return null;
  const condiciones = patrones.flatMap(({ texto, exacta }) => {
    const r = escapaSoql(texto);
    // Las siglas se rodean de espacios: sin eso, buscar SIG arrastra miles de
    // filas con "Sigrid", "siguiente" o "asignacion" y agota el techo de la
    // consulta antes de llegar a lo que importa.
    const patron = exacta ? `% ${r} %` : `%${r}%`;
    return [
      `upper(nombre_del_procedimiento) like '${patron}'`,
      `upper(descripci_n_del_procedimiento) like '${patron}'`,
    ];
  });
  return `(${condiciones.join(' OR ')})`;
}

function clausulaTerritorio(filtros: FiltrosCaza): string | null {
  const lista: string[] = [...filtros.departamentos];
  if (filtros.incluirSinDepartamento) lista.push(SIN_DEPARTAMENTO);
  // Lista vacía significa toda Colombia: no se añade condición.
  if (lista.length === 0) return null;
  const valores = lista.map((d) => `'${escapaSoql(d)}'`).join(',');
  return `departamento_entidad in(${valores})`;
}

function construyeWhere(filtros: FiltrosCaza): string {
  const desde = new Date(Date.now() - filtros.diasAtras * 86_400_000)
    .toISOString()
    .slice(0, 19);

  const partes: (string | null)[] = [
    `fecha_de_publicacion_del > '${desde}'`,
    `estado_de_apertura_del_proceso='Abierto'`,
    clausulaTerritorio(filtros),
    clausulaTerminos(raicesActivas(filtros)),
  ];

  if (filtros.montoMin > 0) partes.push(`precio_base >= ${Math.round(filtros.montoMin)}`);
  if (filtros.montoMax > 0) partes.push(`precio_base <= ${Math.round(filtros.montoMax)}`);

  if (filtros.modalidades.length > 0) {
    const valores = filtros.modalidades.map((m) => `'${escapaSoql(m)}'`).join(',');
    partes.push(`modalidad_de_contratacion in(${valores})`);
  }

  return partes.filter((p): p is string => Boolean(p)).join(' AND ');
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

function aProspecto(fila: FilaSecop, filtros: FiltrosCaza): Prospecto {
  const objeto = fila.nombre_del_procedimiento || fila.descripci_n_del_procedimiento || '';
  const precioBase = Number(fila.precio_base ?? 0) || 0;
  const departamento = fila.departamento_entidad ?? SIN_DEPARTAMENTO;
  const modalidad = fila.modalidad_de_contratacion ?? 'No definida';
  const fechaPublicacion = fila.fecha_de_publicacion_del ?? '';

  const calificacion = califica({
    objeto,
    precioBase,
    departamento,
    modalidad,
    fechaPublicacion,
    familias: filtros.familias,
    terminosPropios: filtros.terminosPropios,
    baseOperacion: filtros.baseOperacion,
    intensidadCercania: filtros.intensidadCercania,
  });

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
    $limit: String(filtros.limite),
  });

  const inicio = Date.now();
  const respuesta = await fetch(`${ENDPOINT}?${params}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(60_000),
  });
  const latenciaMs = Date.now() - inicio;

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`SECOP respondió ${respuesta.status}: ${detalle.slice(0, 300)}`);
  }

  const filas = (await respuesta.json()) as FilaSecop[];
  const umbral = ORDEN_NIVEL[filtros.nivelMinimo];

  const prospectos = filas
    .filter((f) => {
      if (filtros.incluirNomina) return true;
      const objeto = f.nombre_del_procedimiento || f.descripci_n_del_procedimiento || '';
      return !esNomina(objeto);
    })
    .map((f) => aProspecto(f, filtros))
    .filter((p) => ORDEN_NIVEL[p.nivel] <= umbral)
    .sort((a, b) => b.puntaje - a.puntaje || b.fechaPublicacion.localeCompare(a.fechaPublicacion));

  return {
    prospectos,
    total: filas.length,
    // SECOP devolvió justo el tope: hay más procesos que no llegaron a verse.
    truncado: filas.length >= filtros.limite,
    limite: filtros.limite,
    consultadoEn: new Date().toISOString(),
    latenciaMs,
  };
}
