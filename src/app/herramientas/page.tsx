import React from 'react';
import Link from 'next/link';
import { Map, Network, FileSpreadsheet, Activity, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Herramientas Interactivas | Mapzy',
  description: 'Gadgets interactivos, visores conceptuales, riesgo sísmico y matrices de evaluación para territorio y mapas.',
};

export default function HerramientasHubPage() {
  const herramientas = [
    {
      slug: 'editor-mapas',
      titulo: 'Studio Editor de Mapas (Genesis)',
      descripcion: 'Crea, personaliza y genera pósters geoespaciales interactivos de cualquier municipio de Colombia con estilos visuales únicos.',
      icono: Map,
      tag: 'Gadget Mapzy Genesis'
    },
    {
      slug: 'estado-colombiano',
      titulo: 'Estructura Atómica del Estado Colombiano',
      descripcion: 'Mapa conceptual e interactivo desarrollado en D3.js para explorar ramas del poder, ministerios, cortes y órganos autónomos.',
      icono: Network,
      tag: 'Visor Interactivo D3'
    },
    {
      slug: 'matriz-exclusion',
      titulo: 'Matriz de Exclusión Geoespacial',
      descripcion: 'Evaluador de viabilidad territorial con filtros de veto absoluto, fricción y atractores financieros con guardado local.',
      icono: FileSpreadsheet,
      tag: 'Herramienta de Evaluación'
    },
    {
      slug: 'geo-risk',
      titulo: 'GeoRisk Colombia Monitor',
      descripcion: 'Portal de inteligencia geográfica para la evaluación y monitoreo de riesgos sismológicos y corredores viales prioritarios.',
      icono: Activity,
      tag: 'Monitor de Riesgos'
    }
  ];

  return (
    <div className="bg-white pb-16">
      <div className="bg-[#1a2a44] text-white py-20 px-4 mb-16 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-3 inline-block">Herramientas e Interactivos</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Mapzy Tools &amp; Gadgets</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Suite interactiva de visualización, gestión de riesgos, diseño de mapas y evaluación de viabilidad territorial.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {herramientas.map((h) => {
            const Icon = h.icono;
            return (
              <div
                key={h.slug}
                className="p-6 rounded-3xl bg-[#f8fafc] border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1a2a44] text-yellow-400 flex items-center justify-center mb-5 shadow-md">
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full inline-block mb-3">
                    {h.tag}
                  </span>
                  <h2 className="text-xl font-bold text-[#1a2a44] group-hover:text-yellow-600 transition-colors mb-2 leading-snug">
                    {h.titulo}
                  </h2>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    {h.descripcion}
                  </p>
                </div>
                <Link
                  href={`/herramientas/${h.slug}`}
                  className="inline-flex items-center gap-2 font-bold text-[#1a2a44] group-hover:text-yellow-600 transition-colors text-xs"
                >
                  Abrir herramienta <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
