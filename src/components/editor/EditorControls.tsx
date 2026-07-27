'use client';

import React from 'react';
import { useMapStore } from '@/store/useMapStore';
import CitySelector from './CitySelector';
import { COLOMBIA_CITIES } from '@/data/colombia-cities';
import { Layout, Map as MapIcon, Type, Smartphone, Monitor, LocateFixed, Square, ToggleRight, ToggleLeft } from 'lucide-react';

const PRESET_THEMES = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'blueprint', name: 'Blueprint' },
  { id: 'hackerman', name: 'Hackerman' },
];

const TEXT_STYLES: Array<{ id: 'box' | 'gradient' | 'minimal'; name: string }> = [
  { id: 'box', name: 'Classic' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'gradient', name: 'Modern' },
];

export default function EditorControls() {
  const {
    theme, setTheme, title, subtitle, setText,
    orientation, setOrientation, setCoords, setZoom,
    showLabels, setShowLabels,
    isCustomMode, setIsCustomMode, textStyle, setTextStyle,
    font, setFont, showFrame, setShowFrame, labelScale, setLabelScale
  } = useMapStore();

  const handleTeleport = () => {
    const randomCity = COLOMBIA_CITIES[Math.floor(Math.random() * COLOMBIA_CITIES.length)];
    setCoords(randomCity.lat, randomCity.lng);
    setZoom(13);
    const displaySubtitle = randomCity.name === 'BOGOTÁ' ? 'DISTRITO CAPITAL' : randomCity.department.toUpperCase();
    setText(randomCity.name, displaySubtitle);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-[#1a2a44] tracking-tight">MAPZY <span className="text-yellow-600 font-light">STUDIO</span></h1>
        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1">Generador de Pósters Geoespaciales</p>
      </div>

      <section className="space-y-3">
        <button
          onClick={handleTeleport}
          className="w-full group relative overflow-hidden flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#1a2a44] to-yellow-600 text-white rounded-xl shadow-lg hover:opacity-95 transition-all active:scale-[0.98]"
        >
          <LocateFixed size={20} />
          <div className="text-left">
            <span className="block text-sm font-bold leading-none">Teletranspórtame</span>
            <span className="text-[10px] opacity-80 uppercase tracking-wider">Explorar Ciudad Aleatoria</span>
          </div>
        </button>
      </section>

      {/* Tipografía y Ubicación */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
          <Type size={16} className="text-yellow-600" />
          <h2>Ubicación y Texto</h2>
        </div>
        <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <CitySelector />
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 block">Título de la Ciudad</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setText(e.target.value, subtitle)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Ej. MEDELLÍN"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 block">Subtítulo / Departamento</label>
              <input 
                type="text" 
                value={subtitle} 
                onChange={(e) => setText(title, e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Ej. ANTIOQUIA, COLOMBIA"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFont('sans')}
              className={`p-3 rounded-lg border text-sm font-bold transition-all ${font === 'sans' ? 'ring-2 ring-yellow-500 bg-[#1a2a44] text-white border-[#1a2a44]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Sans Moderno
            </button>
            <button
              onClick={() => setFont('serif')}
              className={`p-3 rounded-lg border text-sm font-serif transition-all ${font === 'serif' ? 'ring-2 ring-yellow-500 bg-[#1a2a44] text-white border-[#1a2a44]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Serif Elegante
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tamaño de Texto</label>
              <span className="text-[10px] font-mono font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">{labelScale.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1" 
              value={labelScale}
              onChange={(e) => setLabelScale(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-yellow-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {TEXT_STYLES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTextStyle(t.id)}
                className={`py-2 px-1 rounded-md border text-[10px] font-bold uppercase tracking-tighter transition-all ${textStyle === t.id ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Estilos del Mapa */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
          <MapIcon size={16} className="text-yellow-600" />
          <h2>Estética del Mapa</h2>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${showLabels ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {showLabels ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              Etiquetas Geográficas
            </div>
          </button>

          <button
            onClick={() => setShowFrame(!showFrame)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${showFrame ? 'bg-[#1a2a44] text-white border-[#1a2a44] shadow-lg' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <Square size={14} />
              Marco de Galería
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${showFrame ? 'bg-yellow-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showFrame ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          {PRESET_THEMES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setIsCustomMode(false); setTheme(s.id); }}
              className={`p-3 text-xs font-bold rounded-lg border transition-all ${theme === s.id && !isCustomMode ? 'ring-2 ring-yellow-500 bg-[#1a2a44] text-white border-[#1a2a44]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </section>

      {/* Orientación */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
          <Layout size={16} className="text-yellow-600" />
          <h2>Orientación</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOrientation('portrait')}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${orientation === 'portrait' ? 'ring-2 ring-yellow-500 bg-white border-yellow-100 shadow-md' : 'bg-slate-50 border-transparent text-slate-400'}`}
          >
            <Smartphone size={20} className={orientation === 'portrait' ? 'text-yellow-600' : ''} />
            <span className="text-[10px] font-bold uppercase">Vertical</span>
          </button>
          <button
            onClick={() => setOrientation('landscape')}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${orientation === 'landscape' ? 'ring-2 ring-yellow-500 bg-white border-yellow-100 shadow-md' : 'bg-slate-50 border-transparent text-slate-400'}`}
          >
            <Monitor size={20} className={orientation === 'landscape' ? 'text-yellow-600' : ''} />
            <span className="text-[10px] font-bold uppercase">Horizontal</span>
          </button>
        </div>
      </section>
    </div>
  );
}
