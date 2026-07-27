import { create } from 'zustand';

interface MapState {
  lat: number;
  lng: number;
  zoom: number;
  theme: string;
  title: string;
  subtitle: string;
  orientation: 'portrait' | 'landscape';
  paperSize: string;
  showLabels: boolean;
  isCustomMode: boolean;
  font: 'sans' | 'serif';
  showFrame: boolean;
  labelScale: number;
  mapColors: {
    background: string;
    nature: string;
    infrastructure: string;
    roadMain: string;
    roadStreet: string;
    roadMinor: string;
    urban: string;
    rural: string;
    water: string;
    text: string;
    building: string;
    border: string;
    airport: string;
  };
  textStyle: 'box' | 'gradient' | 'minimal';
  setCoords: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
  setTheme: (themeId: string) => void;
  setText: (title: string, subtitle: string) => void;
  setOrientation: (orientation: 'portrait' | 'landscape') => void;
  setPaperSize: (size: string) => void;
  setShowLabels: (show: boolean) => void;
  setIsCustomMode: (isCustom: boolean) => void;
  setTextStyle: (style: 'box' | 'gradient' | 'minimal') => void;
  setFont: (font: 'sans' | 'serif') => void;
  setShowFrame: (show: boolean) => void;
  setLabelScale: (scale: number) => void;
  setMapColor: (key: keyof MapState['mapColors'], color: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  lat: 6.2442,
  lng: -75.5812,
  zoom: 12,
  theme: 'light',
  title: 'MEDELLÍN',
  subtitle: 'ANTIOQUIA',
  orientation: 'portrait',
  paperSize: '50x70cm',
  textStyle: 'box',
  showLabels: true,
  isCustomMode: false,
  font: 'sans',
  showFrame: false,
  labelScale: 1,
  mapColors: {
    background: '#ffffff',
    nature: '#e6e6e6',
    infrastructure: '#d0d0d0',
    roadMain: '#000000',
    roadStreet: '#555555',
    roadMinor: '#bbbbbb',
    urban: '#333333',
    rural: '#cccccc',
    water: '#e0e0e0',
    text: '#000000',
    building: '#d9d9d9',
    border: '#a0a0a0',
    airport: '#808080',
  },
  setCoords: (lat, lng) => set({ lat, lng }),
  setZoom: (zoom) => set({ zoom }),
  setTheme: (theme) => set({ theme }),
  setText: (title, subtitle) => set({ title, subtitle }),
  setOrientation: (orientation) => set({ orientation }),
  setPaperSize: (paperSize) => set({ paperSize }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setIsCustomMode: (isCustomMode) => set({ isCustomMode }),
  setTextStyle: (textStyle) => set({ textStyle }),
  setFont: (font) => set({ font }),
  setShowFrame: (showFrame) => set({ showFrame }),
  setLabelScale: (labelScale) => set({ labelScale }),
  setMapColor: (key, color) =>
    set((state) => ({
      mapColors: { ...state.mapColors, [key]: color }
    })),
}));
