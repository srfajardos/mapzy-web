'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Activity, Navigation, Layers } from 'lucide-react';

interface GeoRiskItem {
  id: number;
  lugar?: string;
  via?: string;
  mag?: number;
  prof?: string;
  lat: number;
  lng: number;
  fecha?: string;
  amenaza?: string;
  riesgo?: string;
  type?: 'sismo' | 'via';
}

const SISMOS_DATA: GeoRiskItem[] = [
  { id: 1, lugar: "Mesa de los Santos (Santander)", mag: 4.8, prof: "148 km", lat: 6.78, lng: -73.12, fecha: "2026-04-10" },
  { id: 2, lugar: "El Calvario (Meta)", mag: 5.2, prof: "12 km", lat: 4.45, lng: -73.71, fecha: "2026-04-08" },
  { id: 3, lugar: "Dabeiba (Antioquia)", mag: 4.1, prof: "30 km", lat: 7.00, lng: -76.25, fecha: "2026-04-06" },
  { id: 4, lugar: "Zapatoca (Santander)", mag: 3.9, prof: "140 km", lat: 6.82, lng: -73.27, fecha: "2026-04-05" },
  { id: 5, lugar: "Lenguazaque (Cundinamarca)", mag: 4.4, prof: "50 km", lat: 5.30, lng: -73.71, fecha: "2026-04-02" }
];

const VIAS_RIESGO_DATA: GeoRiskItem[] = [
  { id: 1, via: "Vía Bogotá - Villavicencio (KM 58)", amenaza: "Remoción en Masa / Deslizamiento", lat: 4.35, lng: -73.80, riesgo: "CRÍTICO" },
  { id: 2, via: "Corredor Calarcá - Cajamarca (La Línea)", amenaza: "Falla Geológica Activa", lat: 4.45, lng: -75.40, riesgo: "ALTO" },
  { id: 3, via: "Vía Medellín - Quibdó (Las Animas)", amenaza: "Inundación / Colapso de Talud", lat: 5.65, lng: -76.50, riesgo: "ALTO" },
  { id: 4, via: "Vía Bucaramanga - Pamplona (KM 34)", amenaza: "Desprendimiento de Rocas", lat: 7.15, lng: -72.95, riesgo: "MEDIO" }
];

export default function GeoRiskMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);
  const [selectedItem, setSelectedItem] = useState<GeoRiskItem | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadMap = async () => {
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
          center: [4.5709, -74.2973],
          zoom: 6,
          zoomControl: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          attribution: '&copy; CartoDB & OpenStreetMap'
        }).addTo(map);

        leafletMapRef.current = map;

        const seismicIcon = L.divIcon({
          className: 'custom-seismic-marker',
          html: `<div style="background-color: #ef4444; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(239,68,68,0.8);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        const roadIcon = L.divIcon({
          className: 'custom-road-marker',
          html: `<div style="background-color: #f59e0b; width: 18px; height: 18px; border-radius: 4px; border: 2px solid white; box-shadow: 0 0 10px rgba(245,158,11,0.8);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        SISMOS_DATA.forEach(sismo => {
          const marker = L.marker([sismo.lat, sismo.lng], { icon: seismicIcon }).addTo(map);
          marker.on('click', () => setSelectedItem({ ...sismo, type: 'sismo' }));
        });

        VIAS_RIESGO_DATA.forEach(via => {
          const marker = L.marker([via.lat, via.lng], { icon: roadIcon }).addTo(map);
          marker.on('click', () => setSelectedItem({ ...via, type: 'via' }));
        });
      }
    };

    loadMap();
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row bg-[#0f172a] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl min-h-[600px]">
      <div className="flex-1 relative min-h-[500px]">
        {/* Legend pill overlay moved to top-4 right-4 */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs text-white flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Sismos Recientes</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block"></span> Vías en Riesgo</div>
        </div>
        <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-0" />
      </div>

      <div className="w-full lg:w-96 bg-[#1e293b] p-6 border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-yellow-500" size={20} />
            <h3 className="text-xl font-bold text-white">Monitor GeoRisk MVP</h3>
          </div>

          {selectedItem ? (
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3 animate-in fade-in duration-300">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md inline-block ${selectedItem.type === 'sismo' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                {selectedItem.type === 'sismo' ? 'Evento Sismológico' : 'Infraestructura Vial'}
              </span>
              <h4 className="text-lg font-bold text-white">{selectedItem.lugar || selectedItem.via}</h4>
              
              {selectedItem.type === 'sismo' ? (
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Magnitud:</span>
                    <strong className="text-red-400 text-sm font-bold">{selectedItem.mag} Mw</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Profundidad:</span>
                    <strong className="text-white">{selectedItem.prof}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <strong className="text-slate-400">{selectedItem.fecha}</strong>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-700/50 pb-1">
                    <span>Tipo de Amenaza:</span>
                    <strong className="text-amber-400 font-bold">{selectedItem.amenaza}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Nivel de Riesgo:</span>
                    <strong className="text-[#ef4444] font-bold">{selectedItem.riesgo}</strong>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-center text-xs text-slate-400">
              Haz clic en cualquier marcador del mapa para inspeccionar eventos sísmicos o tramos viales vulnerables.
            </div>
          )}

          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Estadísticas del Monitor</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                <Activity className="text-red-500" size={24} />
                <div>
                  <div className="text-lg font-bold text-white">{SISMOS_DATA.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Sismos Reportados</div>
                </div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                <Navigation className="text-amber-500" size={24} />
                <div>
                  <div className="text-lg font-bold text-white">{VIAS_RIESGO_DATA.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Tramos Críticos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-700 text-[10px] text-slate-500 text-center uppercase tracking-widest">
          Datos de Inteligencia Geoespacial • Mapzy &amp; GeoRisk Colombia
        </div>
      </div>
    </div>
  );
}
