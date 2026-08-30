/**
 * Valores reales de `modalidad_de_contratacion` en el dataset p6dx-8zbt.
 * Vive en su propio modulo porque lo necesitan tanto el servidor (para el
 * filtro SoQL) como la interfaz, y no conviene arrastrar todo secop.ts al
 * bundle del cliente solo por esta lista.
 */
export const MODALIDADES = [
  'Contratación directa',
  'Contratación Directa (con ofertas)',
  'Mínima cuantía',
  'Concurso de méritos abierto',
  'Concurso de méritos con precalificación',
  'Selección Abreviada de Menor Cuantía',
  'Seleccion Abreviada Menor Cuantia Sin Manifestacion Interes',
  'Selección abreviada subasta inversa',
  'Contratación régimen especial',
  'Contratación régimen especial (con ofertas)',
  'Licitación pública',
  'Licitación pública Obra Publica',
  'Licitación Pública Acuerdo Marco de Precios',
];
