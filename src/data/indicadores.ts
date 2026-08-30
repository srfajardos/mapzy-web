/**
 * Indicadores de confianza de la portada.
 *
 * El documento `docs/Análisis UX_UI Sector Ingeniería.md` los describe como
 * "ancla de credibilidad cuantitativa" y exige que sean métricas irrefutables:
 * un número inventado en el sitio de una firma de ingeniería es peor que no
 * tener ninguno, porque el primer cliente que lo contraste pierde la confianza
 * en todo lo demás.
 *
 * Por eso la sección NO se muestra mientras `PUBLICADO` sea false. Sergio
 * reemplaza los valores por los reales, cambia la bandera a true, y recién ahí
 * aparece en el sitio. Así ningún dato sin verificar puede llegar a producción
 * por descuido.
 */

export const PUBLICADO = false;

export interface Indicador {
  /** Número o cantidad. Se anima contando desde cero al entrar en pantalla. */
  valor: number;
  /** Texto antes del número, por ejemplo "$". */
  prefijo?: string;
  /** Texto después del número, por ejemplo "+" o " M". */
  sufijo?: string;
  etiqueta: string;
  /** Aclaración corta bajo la etiqueta. Opcional. */
  detalle?: string;
}

export const INDICADORES: Indicador[] = [
  {
    valor: 0,
    sufijo: '+',
    etiqueta: 'Hectáreas levantadas',
    detalle: 'Fotogrametría, LiDAR y topografía convencional',
  },
  {
    valor: 0,
    sufijo: '+',
    etiqueta: 'Proyectos ejecutados',
    detalle: 'Sector minero, ambiental y obra pública',
  },
  {
    valor: 0,
    sufijo: '',
    etiqueta: 'Años de experiencia',
    detalle: 'Geología, geomática y gestión del riesgo',
  },
  {
    valor: 0,
    sufijo: '%',
    etiqueta: 'Entregables aprobados en primera radicación',
    detalle: 'Ante ANM, corporaciones autónomas y entes territoriales',
  },
];
