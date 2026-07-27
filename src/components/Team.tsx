import React from 'react';
import { Users } from 'lucide-react';

export default function Team() {
  const equipo = [
    { nombre: 'Sergio R. Fajardo', cargo: 'Director General y Coord. Geología' },
    { nombre: 'Juan S. Samboni', cargo: 'Gestión de Riesgo y Ordenamiento' },
    { nombre: 'Andres F. Bermudez', cargo: 'SIG y Geofísica' },
    { nombre: 'Javier S. Fajardo', cargo: 'Biología y Gestión Ambiental' },
  ];

  return (
    <section id="equipo" className="py-24 px-4 bg-[#1a2a44] text-white">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-2 inline-block">
          Talento Científico y Técnico
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Nuestro <span className="text-yellow-400">Equipo</span>
        </h2>
        <div className="w-20 h-1.5 bg-yellow-400 mx-auto mb-16 rounded-full"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {equipo.map((m, idx) => (
            <div key={idx} className="group">
              <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-yellow-400 p-1 bg-white/5 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-white/10">
                  <Users size={48} className="text-yellow-400" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">{m.nombre}</h4>
              <p className="text-yellow-400/80 text-sm font-medium uppercase tracking-wider">
                {m.cargo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
