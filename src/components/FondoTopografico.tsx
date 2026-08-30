import React from 'react';

/**
 * Fondo cartográfico generado: curvas de nivel y retícula de coordenadas.
 *
 * Sustituye a la fotografía de banco que ocupaba el hero. El documento de UX
 * del sector señala que el stock resta credibilidad ante un lector técnico;
 * un patrón abstracto propio no finge ser una operación de campo que no se
 * está mostrando, y además dice de qué trabaja la firma.
 *
 * Es SVG y CSS, sin peticiones de red ni imágenes que descargar.
 *
 * La retícula va en CSS y no dentro del SVG a propósito: el SVG se escala con
 * `slice` para cubrir el contenedor, así que un patrón definido ahí crecía
 * hasta celdas de 128 px en un monitor de 2560 y parecía una hoja de cálculo.
 * En CSS mantiene 56 px reales en cualquier pantalla.
 */
export default function FondoTopografico() {
  // Curvas concéntricas irregulares, como las de un cerro en un plano.
  const curvas = Array.from({ length: 9 }, (_, i) => ({
    escala: 1 + i * 0.34,
    opacidad: 0.26 - i * 0.022,
    key: `curva-${i}`,
  }));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#1a2a44]" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(250,204,21,0.07) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(250,204,21,0.07) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Macizo principal, desplazado a la derecha para no competir con el texto */}
        <g transform="translate(880 380)">
          {curvas.map(({ escala, opacidad, key }) => (
            <path
              key={key}
              d="M0,-70 C58,-70 96,-38 96,6 C96,50 58,78 0,78 C-58,78 -100,50 -100,6 C-100,-38 -58,-70 0,-70 Z"
              fill="none"
              stroke="#facc15"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              opacity={opacidad}
              transform={`scale(${escala})`}
            />
          ))}
        </g>

        {/* Depresión secundaria en la esquina inferior izquierda */}
        <g transform="translate(160 700)">
          {curvas.slice(0, 6).map(({ escala, opacidad, key }) => (
            <path
              key={`b-${key}`}
              d="M0,-46 C42,-46 70,-24 70,6 C70,36 42,56 0,56 C-42,56 -74,36 -74,6 C-74,-24 -42,-46 0,-46 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={opacidad * 0.7}
              transform={`scale(${escala})`}
            />
          ))}
        </g>
      </svg>

      {/* Degradado para que el texto del hero mantenga contraste suficiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a44] via-[#1a2a44]/85 to-[#1a2a44]/40" />
    </div>
  );
}
