import { NextResponse, type NextRequest } from 'next/server';
import { cazaProspectos, DEPARTAMENTOS_DISPONIBLES } from '@/lib/caza/secop';
import type { FiltrosCaza } from '@/lib/caza/tipos';

export const dynamic = 'force-dynamic';

function entero(valor: string | null, porDefecto: number, min: number, max: number): number {
  const n = Number(valor);
  if (!Number.isFinite(n)) return porDefecto;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;

  // Solo se aceptan departamentos de la lista blanca: nada del cliente entra al SoQL.
  const pedidos = (q.get('departamentos') ?? '').split(',').map((d) => d.trim()).filter(Boolean);
  const departamentos = pedidos.filter((d) => DEPARTAMENTOS_DISPONIBLES.includes(d));

  const nivelPedido = (q.get('nivel') ?? 'C').toUpperCase();
  const nivelMinimo: FiltrosCaza['nivelMinimo'] =
    nivelPedido === 'A' || nivelPedido === 'B' ? nivelPedido : 'C';

  const filtros: FiltrosCaza = {
    departamentos: departamentos.length > 0 ? departamentos : ['Tolima', 'Huila', 'Cundinamarca'],
    diasAtras: entero(q.get('dias'), 45, 1, 365),
    montoMin: entero(q.get('montoMin'), 0, 0, 100_000_000_000),
    montoMax: entero(q.get('montoMax'), 0, 0, 100_000_000_000),
    nivelMinimo,
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
