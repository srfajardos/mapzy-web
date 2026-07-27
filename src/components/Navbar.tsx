'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Herramientas', href: '/herramientas' },
    { name: 'Artículos', href: '/articulos' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="fixed w-full z-[100] bg-[#1a2a44]/95 backdrop-blur-md text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-yellow-400/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="text-[#1a2a44]" size={28} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter text-yellow-400">Mapzy</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-white/80 mt-1">
                Mapas, Zonificación y Yacimientos
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-yellow-400 transition-colors font-medium text-xs uppercase tracking-wider"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/#contacto"
              className="bg-yellow-400 text-[#1a2a44] px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-all duration-300 text-xs uppercase tracking-wider shadow-md hover:shadow-yellow-400/20"
            >
              Consulta SIG
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden text-yellow-400">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="focus:outline-none p-2"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#1a2a44] p-4 flex flex-col space-y-4 border-t border-white/10 animate-in fade-in slide-in-from-top-5 duration-200">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-yellow-400 text-base py-2 border-b border-white/5 last:border-0"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/#contacto"
            onClick={() => setIsMenuOpen(false)}
            className="bg-yellow-400 text-[#1a2a44] px-5 py-3 rounded-xl font-bold text-center block text-sm"
          >
            Consulta SIG
          </Link>
        </div>
      )}
    </nav>
  );
}
