'use client';

import React from 'react';
import { Database, Leaf, Zap, Globe } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export default function Services() {
  const servicios = [
    {
      titulo: 'Geología & Minería',
      descripcion: 'Diseño de planes de minería y exploración geológica avanzada. Cartografía geológica y caracterización geotécnica de yacimientos.',
      icon: Database,
    },
    {
      titulo: 'Gestión Ambiental',
      descripcion: 'Evaluaciones de impacto ambiental (EIA), trámites de licenciamiento, planes de manejo ambiental y remediación de ecosistemas.',
      icon: Leaf,
    },
    {
      titulo: 'Tecnología SIG',
      descripcion: 'Implementación de sistemas de información geográfica completos, análisis espacial avanzado y desarrollo de gemelos digitales.',
      icon: Zap,
    },
    {
      titulo: 'Ordenamiento',
      descripcion: 'Zonificación territorial de precisión, análisis de uso del suelo y consultoría para planes de ordenamiento territorial (POT).',
      icon: Globe,
    },
  ];

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="servicios" className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={headerVariants}
        >
          <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-2 inline-block">
            Qué Hacemos
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1a2a44]">
            Servicios <span className="text-yellow-500">Especializados</span>
          </h2>
          <div className="w-20 h-1.5 bg-yellow-400 mx-auto mb-16 rounded-full"></div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {servicios.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                className="p-8 border border-gray-100 rounded-3xl hover:border-yellow-400 transition-all duration-300 hover:shadow-2xl group text-left flex flex-col justify-between bg-white shadow-sm"
                variants={cardVariants}
                whileHover={{ y: -8 }}
              >
                <div>
                  <div className="text-yellow-500 mb-6 bg-yellow-400/10 w-16 h-16 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#1a2a44]">{service.titulo}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm mb-6">{service.descripcion}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
