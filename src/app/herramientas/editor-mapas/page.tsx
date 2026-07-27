import React from 'react';
import { ExternalLink, Sparkles, Map, Palette, Download } from 'lucide-react';

export const metadata = {
  title: 'Mapzy Genesis Studio | Galería Cartográfica',
  description: 'Aplicación oficial de diseño de pósters cartográficos de Colombia.',
};

export default function MapzyGenesisPage() {
  return (
    <div className="pb-20 bg-slate-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8 pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={16} />
          <span>Aplicativo Oficial Mapzy Genesis</span>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
          Convierte tus viajes en <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400">
            Arte Cartográfico Premium
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Mapzy Genesis es nuestra aplicación especializada para el diseño de pósters cartográficos de calidad editorial, con tipografía personalizada y exportación en alta resolución de cualquier municipio de Colombia.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://mapzy-genesis.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            Abrir Mapzy Genesis Studio (Vercel App)
            <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Map className="text-indigo-400 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Cartografía de Precisión</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Búsqueda de municipios, veredas y ciudades con capas detalladas de calles y geografía nacional.
            </p>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Palette className="text-violet-400 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Estilos de Galería</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Paletas de color curadas desde minimalismo nórdico hasta blueprint y estilo obscuro.
            </p>
          </div>
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <Download className="text-emerald-400 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Listo para Impresión</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Formatos de alta resolución para pósters de gran formato e impresión física.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
