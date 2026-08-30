import React from 'react';
import { Users } from 'lucide-react';

interface Miembro {
  nombre: string;
  cargo: string;
  /**
   * Ruta dentro de `public/`. Si el archivo no existe todavía, la tarjeta
   * muestra el ícono y no una imagen rota: la foto se pinta como capa encima
   * del ícono, así que un 404 simplemente deja ver lo que hay debajo.
   */
  foto?: string;
}

const EQUIPO: Miembro[] = [
  {
    nombre: 'Sergio R. Fajardo',
    cargo: 'Director General y Coord. Geología',
    foto: '/media/equipo/sergio-fajardo.webp',
  },
  {
    nombre: 'Javier S. Fajardo',
    cargo: 'Biología y Gestión Ambiental',
    foto: '/media/equipo/javier-fajardo.webp',
  },
];

/**
 * Fuera del equipo visible por ahora. Se conservan aquí, y no borrados, para
 * reincorporarlos moviéndolos de vuelta a EQUIPO cuando corresponda.
 */
const EN_PAUSA: Miembro[] = [
  { nombre: 'Juan S. Samboni', cargo: 'Gestión de Riesgo y Ordenamiento' },
  { nombre: 'Andres F. Bermudez', cargo: 'SIG y Geofísica' },
];
void EN_PAUSA;

export default function Team() {
  // Con dos personas, cuatro columnas dejaban la fila descuadrada a la
  // izquierda. La rejilla se ajusta al número real de integrantes.
  const columnas =
    EQUIPO.length >= 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : EQUIPO.length === 3
        ? 'sm:grid-cols-3'
        : 'sm:grid-cols-2 max-w-2xl mx-auto';

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

        <div className={`grid grid-cols-1 ${columnas} gap-12`}>
          {EQUIPO.map((m) => (
            <div key={m.nombre} className="group">
              <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-yellow-400 p-1 bg-white/5 transition-transform duration-300 group-hover:scale-105 shadow-lg">
                <div className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden bg-white/10">
                  <Users size={48} className="text-yellow-400" aria-hidden="true" />
                  {m.foto && (
                    <span
                      role="img"
                      aria-label={`Retrato de ${m.nombre}`}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${m.foto}')` }}
                    />
                  )}
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
