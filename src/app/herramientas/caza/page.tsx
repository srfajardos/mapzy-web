'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import Link from 'next/link';
import {
  Crosshair, ChevronLeft, Search, Loader2, ExternalLink, Bookmark, BookmarkCheck,
  Download, Trash2, AlertTriangle, MapPin, Calendar, Building2, ChevronDown, Target,
} from 'lucide-react';
import type { Prospecto, RespuestaCaza } from '@/lib/caza/tipos';

const DEPARTAMENTOS = [
  'Tolima', 'Huila', 'Cundinamarca', 'Distrito Capital de Bogotá',
  'Quindío', 'Caldas', 'Risaralda', 'Valle del Cauca', 'Meta', 'Boyacá',
];

const CLAVE_GUARDADOS = 'mapzy_caza_guardados';

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
});

const ESTILO_NIVEL: Record<'A' | 'B' | 'C', string> = {
  A: 'bg-yellow-400 text-[#1a2a44] border-yellow-500',
  B: 'bg-slate-200 text-slate-800 border-slate-300',
  C: 'bg-slate-100 text-slate-500 border-slate-200',
};

function fechaCorta(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ConsolaDeCazaPage() {
  const diasId = useId();
  const minId = useId();
  const maxId = useId();
  const nivelId = useId();

  const [departamentos, setDepartamentos] = useState<string[]>(['Tolima', 'Huila', 'Cundinamarca']);
  const [dias, setDias] = useState<string>('45');
  const [montoMin, setMontoMin] = useState<string>('3000000');
  const [montoMax, setMontoMax] = useState<string>('');
  const [nivel, setNivel] = useState<'A' | 'B' | 'C'>('B');

  const [resultado, setResultado] = useState<RespuestaCaza | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string>('');
  const [expandido, setExpandido] = useState<string | null>(null);

  const [guardados, setGuardados] = useState<Prospecto[]>([]);
  const [verGuardados, setVerGuardados] = useState(false);

  useEffect(() => {
    try {
      const crudo = localStorage.getItem(CLAVE_GUARDADOS);
      if (crudo) setGuardados(JSON.parse(crudo) as Prospecto[]);
    } catch {
      // Un localStorage corrupto o bloqueado no debe tumbar la consola.
    }
  }, []);

  const persistir = useCallback((lista: Prospecto[]) => {
    setGuardados(lista);
    try {
      localStorage.setItem(CLAVE_GUARDADOS, JSON.stringify(lista));
    } catch {
      // Cuota llena o modo privado: la sesión sigue usable en memoria.
    }
  }, []);

  const alternarGuardado = (p: Prospecto) => {
    const existe = guardados.some((g) => g.id === p.id);
    persistir(existe ? guardados.filter((g) => g.id !== p.id) : [...guardados, p]);
  };

  const alternarDepartamento = (d: string) => {
    setDepartamentos((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const buscar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams({
        departamentos: departamentos.join(','),
        dias,
        nivel,
      });
      if (montoMin) params.set('montoMin', montoMin);
      if (montoMax) params.set('montoMax', montoMax);

      const r = await fetch(`/api/caza?${params}`, { cache: 'no-store' });
      const cuerpo = await r.json();
      if (!r.ok) throw new Error(cuerpo?.detalle || cuerpo?.error || `Error ${r.status}`);
      setResultado(cuerpo as RespuestaCaza);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setResultado(null);
    } finally {
      setCargando(false);
    }
  }, [departamentos, dias, montoMin, montoMax, nivel]);

  const exportarCSV = () => {
    const filas = verGuardados ? guardados : (resultado?.prospectos ?? []);
    if (filas.length === 0) return;

    const cabecera = [
      'Puntaje', 'Nivel', 'Entidad', 'Departamento', 'Objeto',
      'Precio base', 'Publicado', 'Modalidad', 'Servicio sugerido', 'URL',
    ];
    const escapa = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [
      cabecera.map(escapa).join(','),
      ...filas.map((p) => [
        p.puntaje, p.nivel, p.entidad, p.departamento, p.objeto,
        p.precioBase, fechaCorta(p.fechaPublicacion), p.modalidad, p.servicioSugerido, p.url,
      ].map(escapa).join(',')),
    ].join('\n');

    // BOM inicial para que Excel en español lea las tildes correctamente.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `mapzy_caza_${new Date().toISOString().slice(0, 10)}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
  };

  const listaVisible = verGuardados ? guardados : (resultado?.prospectos ?? []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <header className="bg-[#1a2a44] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/herramientas"
            className="inline-flex items-center gap-1 text-slate-300 hover:text-yellow-400 text-xs font-bold mb-4 transition-colors"
          >
            <ChevronLeft size={16} /> Volver a Herramientas
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 text-[#1a2a44] rounded-2xl flex items-center justify-center shrink-0">
                <Crosshair size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-black">Consola de Caza</h1>
                <p className="text-slate-300 text-sm">
                  Prospección B2B sobre SECOP II · Dataset{' '}
                  <code className="text-yellow-400">p6dx-8zbt</code>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setVerGuardados(!verGuardados)}
                className={`font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs transition-all border ${
                  verGuardados
                    ? 'bg-yellow-400 text-[#1a2a44] border-yellow-400'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <BookmarkCheck size={16} /> Guardados ({guardados.length})
              </button>
              <button
                onClick={exportarCSV}
                disabled={listaVisible.length === 0}
                className="bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs transition-all"
              >
                <Download size={16} /> CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 -mt-4">
        {!verGuardados && (
          <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-6">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">
              Filtros de caza
            </h2>

            <div className="mb-5">
              <span className="text-xs font-bold text-slate-700 block mb-2">Territorio</span>
              <div className="flex flex-wrap gap-2">
                {DEPARTAMENTOS.map((d) => {
                  const activo = departamentos.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => alternarDepartamento(d)}
                      aria-pressed={activo}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        activo
                          ? 'bg-[#1a2a44] text-yellow-400 border-[#1a2a44]'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div>
                <label htmlFor={diasId} className="text-xs font-bold text-slate-700 block mb-1">
                  Publicado en los últimos (días)
                </label>
                <input
                  id={diasId} type="number" min={1} max={365} value={dias}
                  onChange={(e) => setDias(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={minId} className="text-xs font-bold text-slate-700 block mb-1">
                  Monto mínimo (COP)
                </label>
                <input
                  id={minId} type="number" min={0} step={1000000} value={montoMin}
                  onChange={(e) => setMontoMin(e.target.value)} placeholder="0"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={maxId} className="text-xs font-bold text-slate-700 block mb-1">
                  Monto máximo (COP)
                </label>
                <input
                  id={maxId} type="number" min={0} step={1000000} value={montoMax}
                  onChange={(e) => setMontoMax(e.target.value)} placeholder="Sin tope"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor={nivelId} className="text-xs font-bold text-slate-700 block mb-1">
                  Nivel mínimo
                </label>
                <select
                  id={nivelId} value={nivel}
                  onChange={(e) => setNivel(e.target.value as 'A' | 'B' | 'C')}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white"
                >
                  <option value="A">Solo A (70+): prioridad máxima</option>
                  <option value="B">A y B (50+): recomendado</option>
                  <option value="C">Todo (incluye descartables)</option>
                </select>
              </div>
            </div>

            <button
              onClick={buscar}
              disabled={cargando || departamentos.length === 0}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#1a2a44] font-black py-3 px-8 rounded-2xl transition-all shadow-md text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {cargando ? (
                <><Loader2 size={18} className="animate-spin" /> Rastreando SECOP II…</>
              ) : (
                <><Search size={18} /> Cazar oportunidades</>
              )}
            </button>
            {departamentos.length === 0 && (
              <p className="text-xs text-red-600 font-bold mt-2">
                Selecciona al menos un departamento.
              </p>
            )}
          </section>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div className="min-w-0">
              <p className="font-bold text-red-800 text-sm">No se pudo consultar SECOP II</p>
              <p className="text-red-700 text-xs mt-1 break-words">{error}</p>
            </div>
          </div>
        )}

        {!verGuardados && resultado && (
          <p className="text-xs text-slate-500 font-bold mb-3">
            {resultado.prospectos.length} prospecto(s) calificados de {resultado.total} procesos
            revisados · SECOP respondió en {resultado.latenciaMs} ms
          </p>
        )}
        {verGuardados && (
          <p className="text-xs text-slate-500 font-bold mb-3">
            {guardados.length} prospecto(s) guardados en este navegador
          </p>
        )}

        <div className="space-y-3">
          {listaVisible.map((p) => {
            const guardado = guardados.some((g) => g.id === p.id);
            const abierto = expandido === p.id;
            return (
              <article
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 flex gap-4 items-start">
                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${ESTILO_NIVEL[p.nivel]}`}
                  >
                    <span className="text-lg leading-none">{p.puntaje}</span>
                    <span className="text-[10px] leading-none mt-0.5">NIVEL {p.nivel}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1a2a44] text-sm leading-snug">
                      {p.objeto || 'Sin objeto publicado'}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Building2 size={13} /> {p.entidad}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {p.departamento}{p.ciudad ? ` · ${p.ciudad}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {fechaCorta(p.fechaPublicacion)}
                      </span>
                      <span className="flex items-center gap-1"><Target size={13} /> {p.servicioSugerido}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="font-black text-[#1a2a44] text-base">
                        {pesos.format(p.precioBase)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                        {p.modalidad}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => alternarGuardado(p)}
                      title={guardado ? 'Quitar de guardados' : 'Guardar prospecto'}
                      className={`p-2 rounded-xl border transition-all ${
                        guardado
                          ? 'bg-yellow-400 border-yellow-500 text-[#1a2a44]'
                          : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {guardado ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    {p.url && (
                      <a
                        href={p.url} target="_blank" rel="noopener noreferrer"
                        title="Abrir en SECOP II"
                        className="p-2 rounded-xl border border-slate-300 text-slate-500 hover:border-slate-400 hover:text-[#1a2a44] transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setExpandido(abierto ? null : p.id)}
                  className="w-full px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                >
                  <ChevronDown
                    size={14}
                    className={abierto ? 'rotate-180 transition-transform' : 'transition-transform'}
                  />
                  {abierto ? 'Ocultar calificación' : `Por qué puntúa ${p.puntaje}`}
                </button>
                {abierto && (
                  <ul className="px-5 py-3 bg-slate-50 border-t border-slate-200 space-y-1">
                    {p.razones.map((r) => (
                      <li key={r} className="text-xs text-slate-600 flex gap-2">
                        <span className="text-yellow-500 font-black">·</span>
                        {r}
                      </li>
                    ))}
                    {p.referencia && (
                      <li className="text-[11px] text-slate-400 pt-1">
                        Referencia SECOP: {p.referencia}
                      </li>
                    )}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        {verGuardados && guardados.length > 0 && (
          <button
            onClick={() => persistir([])}
            className="mt-6 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 size={14} /> Vaciar guardados
          </button>
        )}

        {!cargando && listaVisible.length === 0 && (resultado || verGuardados) && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-slate-500 text-sm font-bold">
              {verGuardados
                ? 'Aún no has guardado prospectos.'
                : 'Ningún proceso superó el nivel mínimo. Prueba bajando el nivel o ampliando los días.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
