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
 *   1. Crear la carpeta `public/media/` en la raíz del proyecto.
 *   2. Dejar ahí el video (mp4, H.264, idealmente por debajo de 8 MB) y una
 *      imagen de póster del mismo encuadre.
 *   3. Escribir aquí las rutas, que se resuelven desde `public/`:
 *        export const HERO_VIDEO = '/media/sobrevuelo.mp4';
 *        export const HERO_POSTER = '/media/sobrevuelo.jpg';
 *
 * El póster se muestra mientras el video carga, así que conviene que sea el
 * primer fotograma o uno muy parecido.
 */

export const HERO_VIDEO = '';
export const HERO_POSTER = '';
