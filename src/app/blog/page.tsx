import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Blog y Artículos | Mapzy - Tecnología Geoespacial y Sostenibilidad',
  description: 'Mantente al día con nuestras publicaciones sobre gemelos digitales, minería sostenible, geología y sistemas de información geográfica en Colombia.',
};

interface BlogPost {
  id: string | number;
  slug: string;
  titulo: string;
  fecha: string;
  resumen: string;
  imagen: string;
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const query = `*[_type == "post"] | order(publishedAt desc) { _id, title, "slug": slug.current, summary, publishedAt, mainImage }`;
    const sanityPosts = await client.fetch(query);

    if (sanityPosts && sanityPosts.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      posts = sanityPosts.map((p: any) => ({
        id: p._id,
        slug: p.slug || '',
        titulo: p.title || 'Artículo sin título',
        fecha: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha no especificada',
        resumen: p.summary || 'Sin descripción disponible',
        imagen: (p.mainImage && p.mainImage.asset) ? urlFor(p.mainImage).url() : 'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&q=80&w=300',
      }));
    }
  } catch (error) {
    console.error('Error al conectar con Sanity.io para Blog:', error);
  }

  return (
    <div className="bg-white pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-[#1a2a44] text-white py-20 px-4 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&q=80&w=600')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-3 inline-block">Conocimiento Territorial</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Nuestro Blog</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Análisis, trends y estudios sobre tecnología geoespacial, medio ambiente y recursos minerales.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col lg:flex-row gap-6 p-6 rounded-3xl bg-[#f8fafc] hover:bg-yellow-50/50 transition-all duration-300 border border-transparent hover:border-yellow-200 group"
              >
                {/* Image */}
                <div className="w-full lg:w-48 h-48 bg-gray-200 rounded-2xl overflow-hidden shrink-0 relative">
                  <img
                    src={post.imagen}
                    alt={post.titulo || 'Artículo sin título'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Text info */}
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{post.fecha}</span>
                    <h2 className="text-2xl font-bold my-2 text-[#1a2a44] group-hover:text-yellow-600 transition-colors">
                      {post.titulo || 'Artículo sin título'}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {post.resumen || 'Sin descripción disponible'}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#1a2a44] font-bold flex items-center gap-1 group/btn hover:text-yellow-600 transition-colors text-sm"
                  >
                    Leer artículo completo{' '}
                    <ChevronRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#f8fafc] rounded-3xl border border-slate-200 max-w-xl mx-auto p-8">
            <h3 className="text-lg font-bold text-[#1a2a44] mb-2">Artículos en Redacción</h3>
            <p className="text-xs text-slate-500">Estamos publicando nuevos contenidos en Sanity.io. ¡Vuelve pronto para leer nuestros últimos análisis geoespaciales!</p>
          </div>
        )}
      </div>
    </div>
  );
}
