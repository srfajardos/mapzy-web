import React from 'react';
import { Compass, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a2a44] text-white py-12 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div>
          <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 shadow-md">
              <Compass className="text-[#1a2a44]" size={24} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-yellow-400">Mapzy</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-300 mt-1">
                Mapas, Zonificación y Yacimientos
              </span>
            </div>
          </div>
          <p className="text-slate-300 max-w-xs text-sm mx-auto md:mx-0 font-light">
            Mapeando futuros sostenibles para Colombia y el mundo. Soluciones geoespaciales integrales y consultoría experta.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-sm text-slate-300">
          <a
            href="mailto:info@mapzy.com.co"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold transition-colors text-sm"
          >
            <Mail size={16} /> info@mapzy.com.co
          </a>
          <p>&copy; {new Date().getFullYear()} Mapzy S.A.S. Todos los derechos reservados.</p>
          <p className="text-xs text-slate-400">Bogotá / Ricaurte, Cundinamarca • Colombia</p>
        </div>
      </div>
    </footer>
  );
}
