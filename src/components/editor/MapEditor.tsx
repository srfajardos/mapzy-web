'use client';

import React, { useEffect, useRef } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { MAP_THEMES } from '@/data/mapThemes';

export default function MapEditor() {
  const {
    lat, lng, zoom, theme, title, subtitle, textStyle,
    font, showFrame, labelScale
  } = useMapStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);

  const activeTheme = MAP_THEMES[theme as keyof typeof MAP_THEMES] || MAP_THEMES.light;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!mapContainerRef.current) return;

      if (!leafletMapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: zoom,
          zoomControl: false,
          attributionControl: false
        });

        L.tileLayer(activeTheme.styleUrl, {
          maxZoom: 19
        }).addTo(map);

        leafletMapRef.current = map;
      } else {
        const map = leafletMapRef.current as L.Map;
        map.setView([lat, lng], zoom);
        
        map.eachLayer((layer: L.Layer) => {
          if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
          }
        });
        L.tileLayer(activeTheme.styleUrl, { maxZoom: 19 }).addTo(map);
      }
    };

    loadLeaflet();
  }, [lat, lng, zoom, theme, activeTheme]);

  const getContainerClasses = () => {
    switch (textStyle) {
      case 'minimal':
        return "absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/60 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-white/30 text-center min-w-[240px] pointer-events-none z-[1000] transition-all duration-500 origin-bottom";
      case 'gradient':
        return "absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-16 pointer-events-none z-[1000] transition-all duration-500 origin-bottom";
      case 'box':
      default:
        return "absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-10 py-8 shadow-2xl border border-slate-200 text-center min-w-[300px] pointer-events-none z-[1000] transition-all duration-500 origin-bottom";
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-200 flex items-center justify-center overflow-hidden min-h-[500px]">
      <div 
        ref={containerRef}
        className={`w-full h-full transition-all duration-500 ease-in-out relative ${
          showFrame ? 'p-8 bg-white shadow-2xl' : 'p-0 bg-transparent'
        }`}
      >
        <div className="w-full h-full relative overflow-hidden bg-slate-900 shadow-sm rounded-xl">
          <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-0" />
          
          {textStyle === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-10" />
          )}

          <div 
            className={getContainerClasses()}
            style={{ transform: textStyle === 'gradient' ? `scale(${labelScale})` : `translateX(-50%) scale(${labelScale})` }}
          >
            <div className="text-center">
              <h1 className={`uppercase leading-none mb-2 transition-all duration-500 ${font === 'serif' ? 'font-serif tracking-[0.4em] text-4xl font-light' : 'font-sans tracking-tighter text-5xl font-black'} ${textStyle === 'gradient' ? 'text-white drop-shadow-md' : 'text-slate-900'}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`uppercase tracking-[0.3em] text-xs font-medium opacity-75 transition-all duration-500 ${textStyle === 'gradient' ? 'text-white drop-shadow-md' : 'text-slate-600'}`}>
                  {subtitle}
                </p>
              )}
              <div className={`h-[1px] w-12 mx-auto my-4 transition-all ${textStyle === 'gradient' ? 'bg-white/40' : 'bg-slate-300'}`} />
              <p className={`text-[9px] tracking-[0.4em] font-bold uppercase opacity-60 ${textStyle === 'gradient' ? 'text-white' : 'text-slate-900'}`}>
                {`${lat.toFixed(4)}° N / ${lng.toFixed(4)}° W`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
