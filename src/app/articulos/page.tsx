import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Artículos y Documentos | Mapzy',
  description: 'Publicaciones editoriales y marcos estratégicos sobre derecho, tecnología y gestión del riesgo en Colombia.',
};

export default function ArticulosHubPage() {
  const articulos = [
    {
      slug: 'dilema-vocacional',
      titulo: 'El conflicto entre la expectativa, el costo y la dispersión vocacional',
      subtitulo: 'Bitácora de Decisión: El Dilema Vocacional',
      descripcion: 'Análisis estratégico sobre la educación superior en Colombia, la empleabilidad pasiva y la cosmetología como motor de financiamiento.',
      categoria: 'Bitácora Editorial',
      fecha: '2026',
      readTime: '6 min'
    },
    {
      slug: 'sgr-andino',
      titulo: 'Sistema de Gestión del Riesgo para la Región Andina Colombiana',
      subtitulo: 'Marco Integral Ley 1523 de 2012',
      descripcion: 'Caracterización de vulnerabilidades, soluciones basadas en la naturaleza y planificación prospectiva en entornos intramontanos.',
      categoria: 'Documento Estratégico',
      fecha: '2026',
      readTime: '8 min'
    }
  ];

  return (
    <div className="bg-white pb-16">
      <div className="bg-[#1a2a44] text-white py-20 px-4 mb-16 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-3 inline-block">Conocimiento Territorial</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Artículos &amp; Documentos</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Marcos estratégicos, bitácoras críticas y análisis sobre gestión territorial y desarrollo en Colombia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articulos.map((art) => (
            <article
              key={art.slug}
              className="p-8 rounded-3xl bg-[#f8fafc] border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest bg-[#1a2a44] text-yellow-400 px-3 py-1 rounded-full">
                    {art.categoria}
                  </span>
                  <span className="text-xs text-slate-400">• {art.readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1a2a44] group-hover:text-yellow-600 transition-colors mb-3 leading-snug">
                  {art.titulo}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {art.descripcion}
                </p>
              </div>
              <Link
                href={`/articulos/${art.slug}`}
                className="inline-flex items-center gap-2 font-bold text-[#1a2a44] group-hover:text-yellow-600 transition-colors text-sm"
              >
                Leer documento completo <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
