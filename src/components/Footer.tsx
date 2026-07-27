import React from 'react';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div>
          <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center shrink-0">
              <Compass className="text-white" size={24} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-[#1a2a44]">Mapzy</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mt-1">
                Mapas, Zonificación y Yacimientos
              </span>
            </div>
          </div>
          <p className="text-gray-500 max-w-xs text-sm mx-auto md:mx-0">
            Mapeando futuros sostenibles para Colombia y el mundo. Soluciones geoespaciales integrales y consultoría experta.
          </p>
        </div>
        <div className="text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Mapzy S.A.S. Todos los derechos reservados.</p>
          <p className="mt-1">Bogotá, Colombia.</p>
        </div>
      </div>
    </footer>
  );
}
