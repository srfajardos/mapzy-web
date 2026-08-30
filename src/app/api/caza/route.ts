import { NextResponse, type NextRequest } from 'next/server';
import { cazaProspectos } from '@/lib/caza/secop';
import { MODALIDADES } from '@/lib/caza/modalidades';
import { NOMBRES_DEPARTAMENTOS } from '@/lib/caza/territorio';
import { IDS_FAMILIAS, FAMILIAS_POR_DEFECTO, normalizaTermino } from '@/lib/caza/tematica';
import type { FiltrosCaza, IntensidadCercania } from '@/lib/caza/tipos';

export const dynamic = 'force-dynamic';

function entero(valor: string | null, porDefecto: number, min: number, max: number): number {
  // Number(null) y Number('') valen 0, no NaN: sin este corte, un parametro
  // ausente se recortaba al minimo del rango en vez de usar el valor por
  // defecto, y "dias" terminaba valiendo 1 en lugar de 45.
  if (valor === null || valor.trim() === '') return porDefecto;
  const n = Number(valor);
  if (!Number.isFinite(n)) return porDefecto;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function booleano(valor: string | null, porDefecto: boolean): boolean {
  if (valor === null) return porDefecto;
  return valor === '1' || valor === 'true';
}

/** Deja solo los valores del parámetro que estén en la lista blanca. */
function permitidos(valor: string | null, blanca: string[]): string[] {
  return (valor ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && blanca.includes(v));
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;

  // Nada que venga del cliente entra al SoQL sin pasar por una lista blanca.
  const departamentos = permitidos(q.get('departamentos'), NOMBRES_DEPARTAMENTOS);
  const modalidades = permitidos(q.get('modalidades'), MODALIDADES);

  const familiasPedidas = permitidos(q.get('familias'), IDS_FAMILIAS);
  const familias = familiasPedidas.length > 0 ? familiasPedidas : FAMILIAS_POR_DEFECTO;

  // Los términos propios sí son texto libre, así que se normalizan a
  // mayúsculas sin tildes ni signos: lo que sobrevive no puede romper el SoQL.
  const terminosPropios = (q.get('terminos') ?? '')
    .split(',')
    .map(normalizaTermino)
    .filter((t) => t.length >= 3)
    .slice(0, 10);

  const basePedida = q.get('base') ?? '';
  const baseOperacion = NOMBRES_DEPARTAMENTOS.includes(basePedida) ? basePedida : 'Cundinamarca';

  const intensidadPedida = q.get('cercania') ?? 'alta';
  const intensidadCercania: IntensidadCercania =
    intensidadPedida === 'media' || intensidadPedida === 'ninguna' ? intensidadPedida : 'alta';

  const nivelPedido = (q.get('nivel') ?? 'C').toUpperCase();
  const nivelMinimo: FiltrosCaza['nivelMinimo'] =
    nivelPedido === 'A' || nivelPedido === 'B' ? nivelPedido : 'C';

  const filtros: FiltrosCaza = {
    departamentos,
    incluirSinDepartamento: booleano(q.get('sinDepartamento'), false),
    familias,
    terminosPropios,
    baseOperacion,
    intensidadCercania,
    diasAtras: entero(q.get('dias'), 45, 1, 365),
    montoMin: entero(q.get('montoMin'), 0, 0, 100_000_000_000),
    montoMax: entero(q.get('montoMax'), 0, 0, 100_000_000_000),
    modalidades,
    incluirNomina: booleano(q.get('incluirNomina'), true),
    nivelMinimo,
    limite: entero(q.get('limite'), 1000, 100, 5000),
  };

  try {
    const resultado = await cazaProspectos(filtros);
    return NextResponse.json(resultado, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[caza] fallo consultando SECOP II:', mensaje);
    return NextResponse.json(
      { error: 'No se pudo consultar SECOP II', detalle: mensaje },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
