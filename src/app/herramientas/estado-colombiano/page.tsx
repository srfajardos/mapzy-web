import React from 'react';
import EstadoColombianoTree from '@/components/EstadoColombianoTree';

export const metadata = {
  title: 'Estructura del Estado Colombiano | Mapzy Tools',
  description: 'Mapa conceptual e interactivo de la estructura del poder público en Colombia.',
};

export default function EstadoColombianoPage() {
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
          Visor Interactivo D3.js
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-[#1a2a44] mt-3">
          Estructura Atómica del Estado Colombiano
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Navega la jerarquía del poder público, ramas ejecutiva, legislativa, judicial, órganos de control y entes autónomos.
        </p>
      </div>

      <EstadoColombianoTree />
    </div>
  );
}
