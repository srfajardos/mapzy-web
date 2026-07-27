'use client';

import React, { useState, useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { COLOMBIA_CITIES, City } from '@/data/colombia-cities';
import { Search, MapPin } from 'lucide-react';

export default function CitySelector() {
    const { setCoords, setText } = useMapStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredCities = useMemo(() => {
        if (!searchTerm) {
            return COLOMBIA_CITIES.filter(c => c.featured);
        }
        const term = searchTerm.toLowerCase();
        return COLOMBIA_CITIES.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.department.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const handleSelectCity = (city: City) => {
        setCoords(city.lat, city.lng);
        const displaySubtitle = city.name === 'BOGOTÁ' ? 'DISTRITO CAPITAL' : city.department.toUpperCase();
        setText(city.name, displaySubtitle);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-2 block">Búsqueda de Ubicación</label>

            <div className="relative group">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all text-sm text-slate-800"
                    placeholder="Buscar ciudad o municipio..."
                />
                <Search className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredCities.length === 0 ? (
                            <div className="p-6 text-xs text-slate-400 text-center font-medium">No se encontraron resultados</div>
                        ) : (
                            <div className="p-2">
                                <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Ciudades Recomendadas</div>
                                <ul>
                                    {filteredCities.map((city) => (
                                        <li key={`${city.name}-${city.department}`}>
                                            <button
                                                onClick={() => handleSelectCity(city)}
                                                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                                    <MapPin size={14} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm tracking-tight">{city.name}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{city.department}</div>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
