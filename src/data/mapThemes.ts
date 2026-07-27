export interface MapThemeColors {
  water: string;
  land: string;
  road_major: string;
  road_minor: string;
  building: string;
  nature: string;
  border: string;
  text: string;
}

export interface MapTheme {
  id: string;
  name: string;
  styleUrl: string;
  colors: MapThemeColors;
}

export const MAP_THEMES: Record<string, MapTheme> = {
  light: {
    id: 'light',
    name: 'Light Editorial',
    styleUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    colors: {
      land: '#ffffff',
      water: '#d4d4d8',
      road_major: '#000000',
      road_minor: '#a1a1aa',
      building: '#e4e4e7',
      nature: '#ffffff',
      border: '#d4d4d8',
      text: '#000000',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark Obsidian',
    styleUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    colors: {
      land: '#000000',
      water: '#18181b',
      road_major: '#ffffff',
      road_minor: '#52525b',
      building: '#18181b',
      nature: '#000000',
      border: '#27272a',
      text: '#ffffff',
    },
  },
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint Tech',
    styleUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    colors: {
      land: '#1e3a8a',
      water: '#172554',
      road_major: '#ffffff',
      road_minor: '#93c5fd',
      building: '#1e40af',
      nature: '#1e3a8a',
      border: '#60a5fa',
      text: '#ffffff',
    },
  },
  hackerman: {
    id: 'hackerman',
    name: 'Terminal Hackerman',
    styleUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    colors: {
      land: '#000000',
      water: '#0a0a0a',
      road_major: '#22c55e',
      road_minor: '#166534',
      building: '#052e16',
      nature: '#000000',
      border: '#22c55e',
      text: '#22c55e',
    },
  },
};
