'use client';

import React, { useState, useEffect, useCallback, useId, useMemo } from 'react';
import Link from 'next/link';
import {
  Crosshair, ChevronLeft, Search, Loader2, ExternalLink, Bookmark, BookmarkCheck,
  Download, Trash2, AlertTriangle, MapPin, Calendar, Building2, ChevronDown, Target,
  SlidersHorizontal, Save, Home, Route,
} from 'lucide-react';
import type {
  Prospecto, RespuestaCaza, PerfilBusqueda, IntensidadCercania, EstadoFiltros,
} from '@/lib/caza/tipos';
import { DEPARTAMENTOS, REGIONES, NOMBRES_DEPARTAMENTOS } from '@/lib/caza/territorio';
import { FAMILIAS, FAMILIAS_POR_DEFECTO } from '@/lib/caza/tematica';
import { MODALIDADES } from '@/lib/caza/modalidades';

const CLAVE_GUARDADOS = 'mapzy_caza_guardados';
const CLAVE_PERFILES = 'mapzy_caza_perfiles';

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
});

const ESTILO_NIVEL: Record<'A' | 'B' | 'C', string> = {
  A: 'bg-yellow-400 text-[#1a2a44] border-yellow-500',
  B: 'bg-slate-200 text-slate-800 border-slate-300',
  C: 'bg-slate-100 text-slate-500 border-slate-200',
};

/** Deja solo dígitos y quita ceros a la izquierda, permitiendo el campo vacío. */
function soloDigitos(valor: string): string {
  return valor.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');
}

function fechaCorta(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

const FILTROS_INICIALES: EstadoFiltros = {
  departamentos: ['Tolima', 'Huila', 'Cundinamarca'],
  incluirSinDepartamento: false,
  familias: FAMILIAS_POR_DEFECTO,
  terminos: '',
  baseOperacion: 'Cundinamarca',
  intensidadCercania: 'alta',
  dias: '45',
  montoMin: '3000000',
  montoMax: '',
  modalidades: [],
  incluirNomina: true,
  nivel: 'B',
  limite: '1000',
};

export default function ConsolaDeCazaPage() {
  const diasId = useId();
  const minId = useId();
  const maxId = useId();
  const nivelId = useId();
  const baseId = useId();
  const cercaniaId = useId();
  const terminosId = useId();
  const limiteId = useId();

  const [f, setF] = useState<EstadoFiltros>(FILTROS_INICIALES);
  const [avanzados, setAvanzados] = useState(false);

  const [resultado, setResultado] = useState<RespuestaCaza | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string>('');
  const [expandido, setExpandido] = useState<string | null>(null);

  const [guardados, setGuardados] = useState<Prospecto[]>([]);
  const [verGuardados, setVerGuardados] = useState(false);
  const [perfiles, setPerfiles] = useState<PerfilBusqueda[]>([]);

  const set = <K extends keyof EstadoFiltros>(clave: K, valor: EstadoFiltros[K]) =>
    setF((prev) => ({ ...prev, [clave]: valor }));

  const alternar = (clave: 'departamentos' | 'familias' | 'modalidades', valor: string) =>
    setF((prev) => ({
      ...prev,
      [clave]: prev[clave].includes(valor)
        ? prev[clave].filter((x) => x !== valor)
        : [...prev[clave], valor],
    }));

  useEffect(() => {
    try {
      const g = localStorage.getItem(CLAVE_GUARDADOS);
      if (g) setGuardados(JSON.parse(g) as Prospecto[]);
      const p = localStorage.getItem(CLAVE_PERFILES);
      if (p) setPerfiles(JSON.parse(p) as PerfilBusqueda[]);
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

  const guardarPerfil = () => {
    const nombre = window.prompt('Nombre del perfil (ej: Cartografía nacional)');
    if (!nombre?.trim()) return;
    const nuevo = {
      id: `${Date.now()}`,
      nombre: nombre.trim(),
      filtros: f,
    };
    const lista = [...perfiles, nuevo];
    setPerfiles(lista);
    try {
      localStorage.setItem(CLAVE_PERFILES, JSON.stringify(lista));
    } catch {
      // Sin espacio: el perfil vive solo en esta sesión.
    }
  };

  const aplicarPerfil = (p: PerfilBusqueda) => setF(p.filtros);

  const borrarPerfil = (id: string) => {
    const lista = perfiles.filter((p) => p.id !== id);
    setPerfiles(lista);
    try {
      localStorage.setItem(CLAVE_PERFILES, JSON.stringify(lista));
    } catch {
      // Ignorado a propósito.
    }
  };

  const buscar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams({
        departamentos: f.departamentos.join(','),
        sinDepartamento: f.incluirSinDepartamento ? '1' : '0',
        familias: f.familias.join(','),
        terminos: f.terminos,
        base: f.baseOperacion,
        cercania: f.intensidadCercania,
        dias: f.dias || '45',
        modalidades: f.modalidades.join(','),
        incluirNomina: f.incluirNomina ? '1' : '0',
        nivel: f.nivel,
        limite: f.limite || '1000',
      });
      if (f.montoMin) params.set('montoMin', f.montoMin);
      if (f.montoMax) params.set('montoMax', f.montoMax);

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
  }, [f]);

  const exportarCSV = () => {
    const filas = verGuardados ? guardados : (resultado?.prospectos ?? []);
    if (filas.length === 0) return;

    const cabecera = [
      'Puntaje', 'Nivel', 'Entidad', 'Departamento', 'Km desde base', 'Objeto',
      'Precio base', 'Publicado', 'Modalidad', 'Servicio sugerido', 'URL',
    ];
    const escapa = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [
      cabecera.map(escapa).join(','),
      ...filas.map((p) => [
        p.puntaje, p.nivel, p.entidad, p.departamento, p.distanciaKm ?? '', p.objeto,
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

  const resumenTerritorio = useMemo(() => {
    if (f.departamentos.length === 0) return 'Toda Colombia';
    if (f.departamentos.length === NOMBRES_DEPARTAMENTOS.length) return 'Los 33 departamentos';
    return `${f.departamentos.length} departamento(s)`;
  }, [f.departamentos]);

  const claseChip = (activo: boolean) =>
    `px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
      activo
        ? 'bg-[#1a2a44] text-yellow-400 border-[#1a2a44]'
        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
    }`;

  const claseCampo =
    'w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-[#1a2a44] focus:ring-2 focus:ring-yellow-400 focus:outline-none';

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
            {perfiles.length > 0 && (
              <div className="mb-5 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">Perfiles guardados</span>
                <div className="flex flex-wrap gap-2">
                  {perfiles.map((p) => (
                    <span key={p.id} className="inline-flex items-center rounded-xl border border-slate-300 overflow-hidden">
                      <button onClick={() => aplicarPerfil(p)} className="px-3 py-1.5 text-xs font-bold text-[#1a2a44] hover:bg-slate-100">
                        {p.nombre}
                      </button>
                      <button
                        onClick={() => borrarPerfil(p.id)}
                        title={`Borrar ${p.nombre}`}
                        className="px-2 py-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 border-l border-slate-200"
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Temática */}
            <div className="mb-5">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Qué buscar <span className="font-normal text-slate-400">— define también cómo puntúa el tema</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {FAMILIAS.map((fam) => (
                  <button
                    key={fam.id}
                    onClick={() => alternar('familias', fam.id)}
                    aria-pressed={f.familias.includes(fam.id)}
                    title={fam.descripcion}
                    className={claseChip(f.familias.includes(fam.id))}
                  >
                    {fam.nombre}
                  </button>
                ))}
              </div>
              <label htmlFor={terminosId} className="text-[11px] font-bold text-slate-600 block mt-3 mb-1">
                Tus propios términos (separados por coma)
              </label>
              <input
                id={terminosId}
                type="text"
                value={f.terminos}
                onChange={(e) => set('terminos', e.target.value)}
                placeholder="Ej: aerofotografía, restitución, mojón"
                className={claseCampo}
              />
            </div>

            {/* Territorio */}
            <div className="mb-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Territorio <span className="font-normal text-slate-400">— {resumenTerritorio}</span>
                </span>
                <div className="flex gap-2">
                  <button onClick={() => set('departamentos', [])} className="text-[11px] font-bold text-[#1a2a44] underline hover:text-yellow-600">
                    Toda Colombia
                  </button>
                  <button onClick={() => set('departamentos', [...NOMBRES_DEPARTAMENTOS])} className="text-[11px] font-bold text-[#1a2a44] underline hover:text-yellow-600">
                    Marcar los 33
                  </button>
                </div>
              </div>
              {REGIONES.map((region) => (
                <div key={region} className="mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{region}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {DEPARTAMENTOS.filter((d) => d.region === region).map((d) => (
                      <button
                        key={d.nombre}
                        onClick={() => alternar('departamentos', d.nombre)}
                        aria-pressed={f.departamentos.includes(d.nombre)}
                        className={claseChip(f.departamentos.includes(d.nombre))}
                      >
                        {d.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.incluirSinDepartamento}
                  onChange={(e) => set('incluirSinDepartamento', e.target.checked)}
                  className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-600">
                  Incluir procesos sin departamento declarado (584 mil en el dataset)
                </span>
              </label>
            </div>

            {/* Base de operación */}
            <div className="grid sm:grid-cols-2 gap-4 mb-5 pt-4 border-t border-slate-100">
              <div>
                <label htmlFor={baseId} className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Home size={13} /> Base de operación
                </label>
                <select id={baseId} value={f.baseOperacion} onChange={(e) => set('baseOperacion', e.target.value)} className={`${claseCampo} bg-white`}>
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d.nombre} value={d.nombre}>{d.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={cercaniaId} className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Route size={13} /> Peso de la cercanía
                </label>
                <select
                  id={cercaniaId}
                  value={f.intensidadCercania}
                  onChange={(e) => set('intensidadCercania', e.target.value as IntensidadCercania)}
                  className={`${claseCampo} bg-white`}
                >
                  <option value="alta">Alta — favorece fuerte lo cercano (hasta 20 pts)</option>
                  <option value="media">Media — cuenta, sin dominar (hasta 12 pts)</option>
                  <option value="ninguna">Ninguna — ranking por mérito, ignora distancia</option>
                </select>
              </div>
            </div>

            {/* Numéricos */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div>
                <label htmlFor={diasId} className="text-xs font-bold text-slate-700 block mb-1">Publicado en los últimos (días)</label>
                <input id={diasId} type="text" inputMode="numeric" value={f.dias} onChange={(e) => set('dias', soloDigitos(e.target.value))} className={claseCampo} placeholder="45" />
              </div>
              <div>
                <label htmlFor={minId} className="text-xs font-bold text-slate-700 block mb-1">Monto mínimo (COP)</label>
                <input id={minId} type="text" inputMode="numeric" value={f.montoMin} onChange={(e) => set('montoMin', soloDigitos(e.target.value))} className={claseCampo} placeholder="Sin mínimo" />
              </div>
              <div>
                <label htmlFor={maxId} className="text-xs font-bold text-slate-700 block mb-1">Monto máximo (COP)</label>
                <input id={maxId} type="text" inputMode="numeric" value={f.montoMax} onChange={(e) => set('montoMax', soloDigitos(e.target.value))} className={claseCampo} placeholder="Sin tope" />
              </div>
              <div>
                <label htmlFor={nivelId} className="text-xs font-bold text-slate-700 block mb-1">Nivel mínimo</label>
                <select id={nivelId} value={f.nivel} onChange={(e) => set('nivel', e.target.value as 'A' | 'B' | 'C')} className={`${claseCampo} bg-white`}>
                  <option value="A">Solo A (70+): prioridad máxima</option>
                  <option value="B">A y B (50+): recomendado</option>
                  <option value="C">Todo (incluye descartables)</option>
                </select>
              </div>
            </div>

            {/* Avanzados */}
            <button
              onClick={() => setAvanzados(!avanzados)}
              className="text-xs font-bold text-slate-600 hover:text-[#1a2a44] flex items-center gap-1 mb-3"
            >
              <SlidersHorizontal size={14} />
              {avanzados ? 'Ocultar filtros avanzados' : 'Filtros avanzados'}
              <ChevronDown size={14} className={avanzados ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>

            {avanzados && (
              <div className="mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Modalidad de contratación <span className="font-normal text-slate-400">— sin marcar nada entran todas</span>
                </span>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {MODALIDADES.map((m) => (
                    <button key={m} onClick={() => alternar('modalidades', m)} aria-pressed={f.modalidades.includes(m)} className={claseChip(f.modalidades.includes(m))}>
                      {m}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" checked={f.incluirNomina} onChange={(e) => set('incluirNomina', e.target.checked)} className="w-4 h-4 accent-yellow-400 rounded cursor-pointer" />
                  <span className="text-[11px] font-bold text-slate-600">
                    Incluir contratos con forma de vinculación de personal (siempre penalizados −30)
                  </span>
                </label>
                <div className="max-w-xs">
                  <label htmlFor={limiteId} className="text-[11px] font-bold text-slate-600 block mb-1">Techo de procesos por consulta</label>
                  <input id={limiteId} type="text" inputMode="numeric" value={f.limite} onChange={(e) => set('limite', soloDigitos(e.target.value))} className={claseCampo} placeholder="1000" />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={buscar}
                disabled={cargando}
                className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#1a2a44] font-black py-3 px-8 rounded-2xl transition-all shadow-md text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {cargando ? <><Loader2 size={18} className="animate-spin" /> Rastreando SECOP II…</> : <><Search size={18} /> Cazar oportunidades</>}
              </button>
              <button onClick={guardarPerfil} className="bg-white border border-slate-300 hover:border-slate-400 text-[#1a2a44] font-bold py-3 px-5 rounded-2xl text-xs flex items-center gap-2 transition-all">
                <Save size={16} /> Guardar perfil
              </button>
              <button onClick={() => setF(FILTROS_INICIALES)} className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3">
                Restablecer
              </button>
            </div>
            {f.familias.length === 0 && !f.terminos.trim() && (
              <p className="text-[11px] text-amber-700 font-bold mt-2">
                Sin familias ni términos, la búsqueda trae todo lo publicado en el territorio elegido.
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

        {!verGuardados && resultado?.truncado && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <p className="text-amber-800 text-xs font-bold">
              SECOP devolvió el tope de {resultado.limite.toLocaleString('es-CO')} procesos: hay más que no se
              alcanzaron a revisar. Estás viendo los más recientes. Acota el territorio, la fecha o el monto —
              o sube el techo en filtros avanzados.
            </p>
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
              <article key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 flex gap-4 items-start">
                  <div className={`shrink-0 w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${ESTILO_NIVEL[p.nivel]}`}>
                    <span className="text-lg leading-none">{p.puntaje}</span>
                    <span className="text-[10px] leading-none mt-0.5">NIVEL {p.nivel}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1a2a44] text-sm leading-snug">{p.objeto || 'Sin objeto publicado'}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Building2 size={13} /> {p.entidad}</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {p.departamento}{p.ciudad ? ` · ${p.ciudad}` : ''}
                        {p.distanciaKm !== null && <span className="text-slate-400">({p.distanciaKm} km)</span>}
                      </span>
                      <span className="flex items-center gap-1"><Calendar size={13} /> {fechaCorta(p.fechaPublicacion)}</span>
                      <span className="flex items-center gap-1"><Target size={13} /> {p.servicioSugerido}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="font-black text-[#1a2a44] text-base">{pesos.format(p.precioBase)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{p.modalidad}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => alternarGuardado(p)}
                      title={guardado ? 'Quitar de guardados' : 'Guardar prospecto'}
                      className={`p-2 rounded-xl border transition-all ${guardado ? 'bg-yellow-400 border-yellow-500 text-[#1a2a44]' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'}`}
                    >
                      {guardado ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" title="Abrir en SECOP II"
                        className="p-2 rounded-xl border border-slate-300 text-slate-500 hover:border-slate-400 hover:text-[#1a2a44] transition-all">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setExpandido(abierto ? null : p.id)}
                  className="w-full px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                >
                  <ChevronDown size={14} className={abierto ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  {abierto ? 'Ocultar calificación' : `Por qué puntúa ${p.puntaje}`}
                </button>
                {abierto && (
                  <ul className="px-5 py-3 bg-slate-50 border-t border-slate-200 space-y-1">
                    {p.razones.map((r) => (
                      <li key={r} className="text-xs text-slate-600 flex gap-2">
                        <span className="text-yellow-500 font-black">·</span>{r}
                      </li>
                    ))}
                    {p.referencia && <li className="text-[11px] text-slate-400 pt-1">Referencia SECOP: {p.referencia}</li>}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        {verGuardados && guardados.length > 0 && (
          <button onClick={() => persistir([])} className="mt-6 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
            <Trash2 size={14} /> Vaciar guardados
          </button>
        )}

        {!cargando && listaVisible.length === 0 && (resultado || verGuardados) && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-slate-500 text-sm font-bold">
              {verGuardados
                ? 'Aún no has guardado prospectos.'
                : 'Ningún proceso superó el nivel mínimo. Prueba bajando el nivel, ampliando los días o marcando más familias.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
