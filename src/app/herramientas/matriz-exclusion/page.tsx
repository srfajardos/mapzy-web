import React from 'react';
import MatrizExclusion from '@/components/MatrizExclusion';

export const metadata = {
  title: 'Matriz de Exclusión Geoespacial | Mapzy Tools',
  description: 'Herramienta interactiva de evaluación de viabilidad territorial.',
};

export default function MatrizExclusionPage() {
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto space-y-6">
      <MatrizExclusion />
    </div>
  );
}
