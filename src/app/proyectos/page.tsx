import React from 'react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import PortafolioFiltrable, { type ProyectoResumen } from '@/components/PortafolioFiltrable';

export const revalidate = 60;

export const metadata = {
  title: 'Proyectos',
  description:
    'Portafolio de proyectos de geología, topografía, geomática y consultoría ambiental ejecutados por Mapzy S.A.S. en Colombia. Filtra por sector industrial.',
};

interface ProyectoSanity {
  _id: string;
  slug?: { current?: string };
  title?: string;
  client?: string;
  sector?: string;
  description?: string;
  mainImage?: unknown;
}

async function obtenerProyectos(): Promise<ProyectoResumen[]> {
  try {
    const query = `*[_type == "project"] | order(_createdAt desc) {
      _id, slug, title, client, sector, description, mainImage
    }`;
    const crudos: ProyectoSanity[] = await client.fetch(query);
    if (!crudos?.length) return [];

    return crudos
      .filter((p) => p.slug?.current)
      .map((p) => ({
        id: p._id,
        slug: p.slug!.current!,
        titulo: p.title ?? 'Proyecto sin título',
        cliente: p.client ?? '',
        sector: p.sector ?? 'Sin sector',
        descripcion: p.description ?? '',
        // Sin imagen se dibuja un marcador de la marca. Antes se rellenaba con
        // una foto de banco, que el documento de UX identifica como señal de
        // desconfianza para un lector técnico.
        imagen: p.mainImage ? urlFor(p.mainImage).width(800).url() : null,
      }));
  } catch {
    console.warn('No se pudo consultar Sanity para el portafolio.');
    return [];
  }
}

export default async function ProyectosPage() {
  const proyectos = await obtenerProyectos();

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <header className="bg-[#1a2a44] text-white pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs">
            Portafolio
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-3 leading-tight">
            Evidencia, no promesas
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl text-lg font-light">
            Cada caso documenta el contexto del desafío, la metodología técnica aplicada y los
            resultados verificables. Filtra por el sector que te interesa.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8">
        <PortafolioFiltrable proyectos={proyectos} />
      </main>
    </div>
  );
}
