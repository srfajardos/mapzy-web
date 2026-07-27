import React from 'react';
import GeoRiskMap from '@/components/GeoRiskMap';

export const metadata = {
  title: 'GeoRisk Monitor | Mapzy Geoespacial',
  description: 'Portal de inteligencia de riesgos sismológicos y vulnerabilidad vial en Colombia.',
};

export default function GeoRiskPage() {
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
          Inteligencia de Riesgo Territorial
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-[#1a2a44] mt-3">
          GeoRisk Colombia MVP Monitor
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Visualización y monitoreo de eventos sismológicos recientes y tramos viales de alta vulnerabilidad en el territorio colombiano.
        </p>
      </div>

      <GeoRiskMap />
    </div>
  );
}
