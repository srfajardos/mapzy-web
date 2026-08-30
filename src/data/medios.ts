/**
 * Medios de la portada.
 *
 * El documento `docs/Análisis UX_UI Sector Ingeniería.md` es explícito: la
 * fotografía de banco "es penalizada cognitivamente por los usuarios técnicos"
 * y el estándar del sector es cinematografía real de dron sobre operaciones
 * propias. Mapzy vuela drones, así que el material existe; solo falta subirlo.
 *
 * Mientras estas dos rutas estén vacías, el hero dibuja un fondo cartográfico
 * generado con la identidad de la marca. No hay ninguna foto de archivo.
 *
 * Para publicar material propio:
 *   1. Dejar los archivos en `public/media/hero/`.
 *   2. Escribir aquí las rutas, que se resuelven desde `public/`:
 *        export const HERO_VIDEO  = '/media/hero/sobrevuelo.mp4';
 *        export const HERO_POSTER = '/media/hero/sobrevuelo.jpg';
 *
 * El póster se muestra mientras el video carga, y en pantallas pequeñas es lo
 * único que se descarga: el video solo se sirve de `md` hacia arriba.
 *
 * Los comandos de conversión y los pesos objetivo están en
 * `docs/GUIA_MEDIOS.md`.
 */

export const HERO_VIDEO = '';

/** Misma toma en WebM. Opcional: pesa cerca de un 40 % menos donde se admite. */
export const HERO_VIDEO_WEBM = '';

export const HERO_POSTER = '';
