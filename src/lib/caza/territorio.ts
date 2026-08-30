/**
 * Los 33 departamentos tal como los escribe SECOP II en `departamento_entidad`.
 * La grafia importa: la consulta SoQL compara texto exacto, asi que cualquier
 * variacion aqui devuelve cero resultados en silencio.
 *
 * Las coordenadas son las de la capital de cada departamento y sirven para
 * medir cercania desde la base de operacion. No pretenden ser el centroide
 * geometrico: para decidir si un contrato queda cerca o lejos, la capital es
 * mejor referencia porque es donde suele estar la entidad contratante.
 */
export interface Departamento {
  nombre: string;
  lat: number;
  lon: number;
  /** Region, solo para agrupar la lista en la interfaz. */
  region: 'Andina' | 'Caribe' | 'Pacífica' | 'Orinoquía' | 'Amazonía' | 'Insular';
}

export const DEPARTAMENTOS: Departamento[] = [
  { nombre: 'Antioquia', lat: 6.244, lon: -75.581, region: 'Andina' },
  { nombre: 'Boyacá', lat: 5.535, lon: -73.368, region: 'Andina' },
  { nombre: 'Caldas', lat: 5.07, lon: -75.521, region: 'Andina' },
  { nombre: 'Cundinamarca', lat: 4.6, lon: -74.3, region: 'Andina' },
  { nombre: 'Distrito Capital de Bogotá', lat: 4.711, lon: -74.072, region: 'Andina' },
  { nombre: 'Huila', lat: 2.927, lon: -75.289, region: 'Andina' },
  { nombre: 'Norte de Santander', lat: 7.894, lon: -72.504, region: 'Andina' },
  { nombre: 'Quindío', lat: 4.534, lon: -75.681, region: 'Andina' },
  { nombre: 'Risaralda', lat: 4.813, lon: -75.696, region: 'Andina' },
  { nombre: 'Santander', lat: 7.119, lon: -73.123, region: 'Andina' },
  { nombre: 'Tolima', lat: 4.439, lon: -75.232, region: 'Andina' },

  { nombre: 'Atlántico', lat: 10.968, lon: -74.781, region: 'Caribe' },
  { nombre: 'Bolívar', lat: 10.391, lon: -75.479, region: 'Caribe' },
  { nombre: 'Cesar', lat: 10.463, lon: -73.253, region: 'Caribe' },
  { nombre: 'Córdoba', lat: 8.748, lon: -75.881, region: 'Caribe' },
  { nombre: 'La Guajira', lat: 11.545, lon: -72.907, region: 'Caribe' },
  { nombre: 'Magdalena', lat: 11.241, lon: -74.199, region: 'Caribe' },
  { nombre: 'Sucre', lat: 9.304, lon: -75.398, region: 'Caribe' },

  { nombre: 'Cauca', lat: 2.444, lon: -76.614, region: 'Pacífica' },
  { nombre: 'Chocó', lat: 5.694, lon: -76.658, region: 'Pacífica' },
  { nombre: 'Nariño', lat: 1.214, lon: -77.281, region: 'Pacífica' },
  { nombre: 'Valle del Cauca', lat: 3.452, lon: -76.532, region: 'Pacífica' },

  { nombre: 'Arauca', lat: 7.084, lon: -70.759, region: 'Orinoquía' },
  { nombre: 'Casanare', lat: 5.336, lon: -72.396, region: 'Orinoquía' },
  { nombre: 'Meta', lat: 4.142, lon: -73.626, region: 'Orinoquía' },
  { nombre: 'Vichada', lat: 6.185, lon: -67.486, region: 'Orinoquía' },

  { nombre: 'Amazonas', lat: -4.215, lon: -69.941, region: 'Amazonía' },
  { nombre: 'Caquetá', lat: 1.614, lon: -75.607, region: 'Amazonía' },
  { nombre: 'Guainía', lat: 3.865, lon: -67.924, region: 'Amazonía' },
  { nombre: 'Guaviare', lat: 2.57, lon: -72.646, region: 'Amazonía' },
  { nombre: 'Putumayo', lat: 1.15, lon: -76.648, region: 'Amazonía' },
  { nombre: 'Vaupés', lat: 1.198, lon: -70.174, region: 'Amazonía' },

  { nombre: 'San Andrés, Providencia y Santa Catalina', lat: 12.583, lon: -81.7, region: 'Insular' },
];

/** Valor que usa SECOP cuando la entidad no declara departamento. */
export const SIN_DEPARTAMENTO = 'No Definido';

export const NOMBRES_DEPARTAMENTOS = DEPARTAMENTOS.map((d) => d.nombre);

const PORNOMBRE = new Map(DEPARTAMENTOS.map((d) => [d.nombre, d]));

export function buscaDepartamento(nombre: string): Departamento | undefined {
  return PORNOMBRE.get(nombre);
}

/** Distancia en kilometros por la formula del haversine. */
export function distanciaKm(a: Departamento, b: Departamento): number {
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const REGIONES: Departamento['region'][] = [
  'Andina', 'Caribe', 'Pacífica', 'Orinoquía', 'Amazonía', 'Insular',
];
