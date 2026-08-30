'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { INDICADORES, PUBLICADO, type Indicador } from '@/data/indicadores';

const formatoNumero = new Intl.NumberFormat('es-CO');

/** Cuenta desde cero hasta `destino` cuando el elemento entra en pantalla. */
function useConteo(destino: number, activo: boolean, duracionMs = 1400): number {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!activo) return;

    // Respeta a quien pidió menos movimiento en su sistema operativo.
    const prefiereQuieto =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefiereQuieto || destino === 0) {
      setValor(destino);
      return;
    }

    let cuadro = 0;
    const inicio = performance.now();

    const avanzar = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracionMs);
      // Desaceleración cúbica: arranca rápido y frena al final.
      const suave = 1 - Math.pow(1 - t, 3);
      setValor(Math.round(destino * suave));
      if (t < 1) cuadro = requestAnimationFrame(avanzar);
    };

    cuadro = requestAnimationFrame(avanzar);
    return () => cancelAnimationFrame(cuadro);
  }, [destino, activo, duracionMs]);

  return valor;
}

function Contador({ indicador, activo }: { indicador: Indicador; activo: boolean }) {
  const valor = useConteo(indicador.valor, activo);

  return (
    <div className="text-center px-4">
      <div className="text-4xl md:text-5xl font-black text-yellow-400 leading-none tabular-nums">
        {indicador.prefijo}
        {formatoNumero.format(valor)}
        {indicador.sufijo}
      </div>
      <p className="text-white font-bold text-sm mt-3 leading-snug">{indicador.etiqueta}</p>
      {indicador.detalle && (
        <p className="text-slate-400 text-xs mt-1 leading-snug">{indicador.detalle}</p>
      )}
    </div>
  );
}

/**
 * Franja de indicadores de confianza. No renderiza nada mientras los valores
 * no estén verificados (ver `src/data/indicadores.ts`).
 */
export default function Indicadores() {
  const ref = useRef<HTMLElement>(null);
  const enPantalla = useInView(ref, { once: true, amount: 0.4 });

  if (!PUBLICADO) return null;

  return (
    <section ref={ref} className="bg-[#1a2a44] border-y border-yellow-400/20 py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="text-yellow-400" size={18} />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
            Respaldo verificable
          </span>
        </div>
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 divide-y-0 lg:divide-x divide-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={enPantalla ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {INDICADORES.map((ind) => (
            <Contador key={ind.etiqueta} indicador={ind} activo={enPantalla} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
