'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ProyectoResumen {
  id: string;
  slug: string;
  titulo: string;
  cliente: string;
  sector: string;
  descripcion: string;
  imagen: string | null;
}

const TODOS = 'Todos';

interface Props {
  proyectos: ProyectoResumen[];
}

/**
 * Portafolio con filtro por sector. El filtrado ocurre en memoria y sin
 * recargar la página, como pide el documento de UX: el visitante compara
 * trabajos del mismo sector sin perder el contexto de navegación.
 */
export default function PortafolioFiltrable({ proyectos }: Props) {
  const [sector, setSector] = useState<string>(TODOS);

  // Solo se ofrecen los sectores que realmente tienen proyectos publicados:
  // un filtro que devuelve cero resultados es una promesa incumplida.
  const sectores = useMemo(() => {
    const presentes = Array.from(new Set(proyectos.map((p) => p.sector).filter(Boolean)));
    return [TODOS, ...presentes.sort((a, b) => a.localeCompare(b, 'es'))];
  }, [proyectos]);

  const visibles = useMemo(
    () => (sector === TODOS ? proyectos : proyectos.filter((p) => p.sector === sector)),
    [proyectos, sector]
  );

  if (proyectos.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-14 text-center">
        <FolderOpen className="mx-auto text-slate-300 mb-3" size={40} />
        <p className="text-slate-500 font-bold text-sm">
          Todavía no hay proyectos publicados en el portafolio.
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Se cargan desde Sanity Studio, en el tipo de contenido &ldquo;Proyecto de Portafolio&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <>
      {sectores.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtrar por sector">
          {sectores.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              aria-pressed={sector === s}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                sector === s
                  ? 'bg-[#1a2a44] text-yellow-400 border-[#1a2a44]'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              {s}
              {s !== TODOS && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  {proyectos.filter((p) => p.sector === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibles.map((p, i) => (
          <motion.article
            key={p.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group"
          >
            <div className="h-44 bg-[#1a2a44] relative overflow-hidden">
              {p.imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imagen}
                  alt={p.titulo}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-yellow-400/30">
                  <FolderOpen size={44} />
                </div>
              )}
              <span className="absolute top-3 left-3 bg-yellow-400 text-[#1a2a44] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                {p.sector}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h2 className="font-black text-[#1a2a44] text-base leading-snug">{p.titulo}</h2>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                {p.cliente}
              </p>
              <p className="text-slate-600 text-sm mt-3 flex-1 line-clamp-3">{p.descripcion}</p>
              <Link
                href={`/proyectos/${p.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#1a2a44] hover:text-yellow-600 transition-colors"
              >
                Ver caso completo <ChevronRight size={16} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {visibles.length === 0 && (
        <p className="text-slate-500 text-sm font-bold text-center py-10">
          No hay proyectos en este sector todavía.
        </p>
      )}
    </>
  );
}
