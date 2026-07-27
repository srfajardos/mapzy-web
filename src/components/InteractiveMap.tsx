'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración de los iconos por CDN para evitar el bug de rutas relativas de Leaflet en Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface InteractiveMapProps {
  lat: number;
  lng: number;
  proyectoNombre: string;
  cliente: string;
}

export default function InteractiveMap({ lat, lng, proyectoNombre, cliente }: InteractiveMapProps) {
  // Ajuste opcional para asegurarse que Leaflet se redibuje correctamente en re-renders
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  const position: [number, number] = [lat, lng];

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-inner border border-gray-200/80 z-10 relative">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="p-1 font-sans">
              <h4 className="font-bold text-[#1a2a44] text-sm mb-1">{proyectoNombre}</h4>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Cliente: {cliente}</p>
              <div className="mt-2 text-[10px] text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full inline-block font-bold">
                Área de Intervención SIG
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
