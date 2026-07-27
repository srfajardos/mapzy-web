'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  videoUrl?: string;
  fallbackImageUrl?: string;
}

export default function Hero({
  videoUrl,
  fallbackImageUrl = 'https://images.unsplash.com/photo-1486787284432-3749cdce2660?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}: HeroProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  };

  return (
    <header id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1a2a44]">
      {/* Background Media */}
      {videoUrl ? (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={fallbackImageUrl}
          >
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a44]/80 via-[#1a2a44]/60 to-[#1a2a44]/30"></div>
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${fallbackImageUrl}')` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a44]/80 via-[#1a2a44]/60 to-[#1a2a44]/30"></div>
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-4 inline-block bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20"
          variants={itemVariants}
        >
          Geociencias · Topografía · Medio Ambiente
        </motion.span>
        
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight select-none"
          variants={itemVariants}
        >
          Mapeando Futuros <span className="text-yellow-400">Sostenibles</span>
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-200 mb-10 font-light italic max-w-2xl mx-auto"
          variants={itemVariants}
        >
          &ldquo;Líderes en soluciones geoespaciales y desarrollo territorial de alta precisión en Colombia.&rdquo;
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Link
            href="/servicios"
            className="bg-yellow-400 text-[#1a2a44] px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(253,224,71,0.2)] hover:shadow-[0_0_30px_rgba(253,224,71,0.4)] text-center"
          >
            Ver Servicios
          </Link>
          <Link
            href="/#proyectos"
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-center"
          >
            Nuestros Proyectos
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2">
        <span className="text-white/60 text-xs uppercase tracking-widest">Desliza para explorar</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1.5">
          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </header>
  );
}
