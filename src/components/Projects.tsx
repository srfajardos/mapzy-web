'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export interface Project {
  id: number;
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen: string;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  };

  return (
    <section id="proyectos" className="py-24 px-4 bg-[#f1f5f9] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-yellow-600 font-bold uppercase tracking-widest text-xs mb-2 inline-block">
              Nuestro Portafolio
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a2a44]">
              Proyectos <span className="text-yellow-500">Recientes</span>
            </h2>
            <p className="text-gray-500 mt-2">Soluciones de ingeniería y geociencias aplicadas en territorio colombiano.</p>
          </div>
          <Link
            href="/servicios"
            className="hidden md:flex items-center text-[#1a2a44] font-bold hover:text-yellow-600 transition-colors gap-1 group"
          >
            Ver servicios{' '}
            <ChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {projects.map((proyecto) => (
            <motion.div
              key={proyecto.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:border-yellow-400 transition-all duration-300 hover:shadow-2xl flex flex-col group cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -8 }}
            >
              <Link href={`/proyectos/${proyecto.slug}`} className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a2a44]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proyecto.imagen}
                    alt={proyecto.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 z-20 bg-yellow-400 text-[#1a2a44] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {proyecto.categoria}
                  </span>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a2a44] mb-2 group-hover:text-yellow-600 transition-colors">
                      {proyecto.nombre}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-light">
                      {proyecto.descripcion}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-bold text-yellow-600 uppercase tracking-widest gap-1 group-hover:gap-2 transition-all">
                    Ver Estudio de Caso <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
