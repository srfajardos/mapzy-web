import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Building, Activity, FileText, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';
import { client } from '@/sanity/lib/client';

// Cargar el mapa de manera dinámica desactivando SSR para evitar errores de 'window' o 'document'
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-3xl bg-gray-50 border border-gray-200/80 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-400 text-sm font-semibold tracking-wide">
          Cargando mapa cartográfico...
        </span>
      </div>
    </div>
  ),
});

interface ProyectoPageProps {
  params: {
    slug: string;
  };
}

// Generación estática para SEO
export async function generateStaticParams() {
  try {
    // Intentar obtener slugs de Sanity
    const query = `*[_type == "project"] { "slug": slug.current }`;
    const projects = await client.fetch(query);
    if (projects && projects.length > 0) {
      return projects;
    }
  } catch {
    console.warn('Fallo al obtener slugs de Sanity, retornando vacío.');
  }

  return [];
}

export async function generateMetadata({ params }: ProyectoPageProps) {
  let project = null;

  try {
    const query = `*[_type == "project" && slug.current == $slug][0]`;
    project = await client.fetch(query, { slug: params.slug });
  } catch {
    // Silenciar error en build si no está configurado Sanity
  }

  if (!project) {
    return { title: 'Proyecto No Encontrado | Mapzy' };
  }

  const nombre = project.title;
  return {
    title: `${nombre} | Casos de Éxito Mapzy`,
    description: project.description,
  };
}

export default async function ProyectoDetailPage({ params }: ProyectoPageProps) {
  let proyecto = null;

  try {
    const query = `*[_type == "project" && slug.current == $slug][0]`;
    proyecto = await client.fetch(query, { slug: params.slug });
  } catch {
    console.warn('Sanity no conectado. Proyecto vacío.');
  }

  if (!proyecto) {
    notFound();
  }

  const hasCoordinates = typeof proyecto.latitude === 'number' && typeof proyecto.longitude === 'number';

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link
          href="/#proyectos"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a2a44] font-bold mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Volver a Proyectos
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-yellow-400 text-[#1a2a44] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {proyecto.sector}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1a2a44] leading-tight">
            {proyecto.title}
          </h1>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info (Columna Izquierda y Centro) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Descripción */}
            <section className="bg-[#f8fafc] border border-gray-100 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-[#1a2a44] mb-4 flex items-center gap-2 border-b border-gray-200/80 pb-3">
                <FileText className="text-yellow-500" size={20} /> Resumen del Proyecto
              </h2>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                {proyecto.description}
              </p>
            </section>

            {/* Metodología Técnica */}
            <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1a2a44] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Activity className="text-yellow-500" size={20} /> Metodología Técnica Aplicada
              </h2>
              <p className="text-gray-600 leading-relaxed font-light">
                {proyecto.methodology}
              </p>
            </section>

            {/* Resultados */}
            <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1a2a44] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Building className="text-yellow-500" size={20} /> Resultados y Entregables
              </h2>
              <p className="text-gray-600 leading-relaxed font-light">
                {proyecto.results}
              </p>
            </section>
          </div>

          {/* Sidebar (Columna Derecha: Metadatos y Mapa) */}
          <div className="space-y-8">
            
            {/* Metadata Card */}
            <div className="bg-[#1a2a44] text-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-lg font-bold border-b border-white/10 pb-4 mb-6">Detalles de Operación</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Cliente</span>
                  <span className="font-bold text-lg text-yellow-400">{proyecto.client}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Sector Industrial</span>
                  <span className="font-bold text-lg">{proyecto.sector}</span>
                </div>
                {proyecto.view3DUrl && (
                  <div>
                    <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block mb-2">Visor Avanzado</span>
                    <a
                      href={proyecto.view3DUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a2a44] font-bold px-4 py-2 rounded-xl text-sm hover:bg-yellow-300 transition-colors"
                    >
                      Ver Visor 3D / LiDAR <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Map Card */}
            {hasCoordinates && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-md">
                <h3 className="text-md font-bold text-[#1a2a44] mb-4 flex items-center gap-2">
                  <MapPin className="text-yellow-500" size={18} /> Ubicación en el Territorio
                </h3>
                <InteractiveMap
                  lat={proyecto.latitude}
                  lng={proyecto.longitude}
                  proyectoNombre={proyecto.title}
                  cliente={proyecto.client}
                />
                <p className="text-[10px] text-gray-400 mt-3 text-center">
                  Coordenadas SIG: {proyecto.latitude.toFixed(4)}, {proyecto.longitude.toFixed(4)} (WGS 84)
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
