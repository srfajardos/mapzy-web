export interface City {
  name: string;
  department: string;
  lat: number;
  lng: number;
  featured?: boolean;
}

export const COLOMBIA_CITIES: City[] = [
  { name: 'BOGOTÁ', department: 'Cundinamarca', lat: 4.7110, lng: -74.0721, featured: true },
  { name: 'MEDELLÍN', department: 'Antioquia', lat: 6.2442, lng: -75.5812, featured: true },
  { name: 'CALI', department: 'Valle del Cauca', lat: 3.4516, lng: -76.5320, featured: true },
  { name: 'BARRANQUILLA', department: 'Atlántico', lat: 10.9685, lng: -74.7813, featured: true },
  { name: 'CARTAGENA', department: 'Bolívar', lat: 10.3910, lng: -75.4794, featured: true },
  { name: 'CÚCUTA', department: 'Norte de Santander', lat: 7.8939, lng: -72.5078, featured: true },
  { name: 'BUCARAMANGA', department: 'Santander', lat: 7.1193, lng: -73.1227, featured: true },
  { name: 'PEREIRA', department: 'Risaralda', lat: 4.8133, lng: -75.6961, featured: true },
  { name: 'SANTA MARTA', department: 'Magdalena', lat: 11.2408, lng: -74.1990, featured: true },
  { name: 'IBAGUÉ', department: 'Tolima', lat: 4.4389, lng: -75.2322, featured: true },
  { name: 'PASTO', department: 'Nariño', lat: 1.2136, lng: -77.2811, featured: true },
  { name: 'MANIZALES', department: 'Caldas', lat: 5.0703, lng: -75.5138, featured: true },
  { name: 'NEIVA', department: 'Huila', lat: 2.9273, lng: -75.2819, featured: true },
  { name: 'VILLAVICENCIO', department: 'Meta', lat: 4.1420, lng: -73.6266, featured: true },
  { name: 'ARMENIA', department: 'Quindío', lat: 4.5339, lng: -75.6811, featured: true },
  { name: 'VALLEDUPAR', department: 'Cesar', lat: 10.4631, lng: -73.2532, featured: true },
  { name: 'MONTERÍA', department: 'Córdoba', lat: 8.7480, lng: -75.8814, featured: true },
  { name: 'SINCELEJO', department: 'Sucre', lat: 9.3047, lng: -75.3978, featured: true },
  { name: 'POPAYÁN', department: 'Cauca', lat: 2.4448, lng: -76.6147, featured: true },
  { name: 'TUNJA', department: 'Boyacá', lat: 5.5353, lng: -73.3678, featured: true },
  { name: 'RIOHACHA', department: 'La Guajira', lat: 11.5444, lng: -72.9072, featured: true },
  { name: 'FLORENCIA', department: 'Caquetá', lat: 1.6175, lng: -75.6065, featured: true },
  { name: 'YOPAL', department: 'Casanare', lat: 5.3378, lng: -72.3959, featured: true },
  { name: 'QUIBDÓ', department: 'Chocó', lat: 5.6947, lng: -76.6611, featured: true },
  { name: 'GIRARDOT', department: 'Cundinamarca', lat: 4.3015, lng: -74.8071, featured: true },
  { name: 'RICAURTE', department: 'Cundinamarca', lat: 4.2819, lng: -74.7678, featured: true },
].sort((a, b) => a.name.localeCompare(b.name));
