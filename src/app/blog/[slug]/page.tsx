import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generar rutas estáticas para el SEO
export async function generateStaticParams() {
  try {
    const query = `*[_type == "post"] { "slug": slug.current }`;
    const posts = await client.fetch(query);
    if (posts && posts.length > 0) {
      return posts;
    }
  } catch {
    console.warn('Fallo al obtener slugs de Sanity para Blog. Retornando vacío.');
  }

  return [];
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  let post = null;

  try {
    const query = `*[_type == "post" && slug.current == $slug][0]`;
    post = await client.fetch(query, { slug: params.slug });
  } catch {
    // Ignorar en build si no hay conexión
  }

  if (!post) {
    return { title: 'Artículo No Encontrado | Mapzy' };
  }

  return {
    title: `${post.title} | Blog Mapzy`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post = null;

  try {
    const query = `*[_type == "post" && slug.current == $slug][0]`;
    post = await client.fetch(query, { slug: params.slug });
  } catch {
    console.warn('Sanity no conectado. Cargando post del blog vacío.');
  }

  if (!post) {
    notFound();
  }

  const title = post.title;
  const date = post.publishedAt;
  const summary = post.summary;
  const content = post.body || post.content;
  const image = post.mainImage ? urlFor(post.mainImage).url() : 'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&q=80&w=600';

  return (
    <article className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a2a44] font-bold mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Volver al Blog
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-[#1a2a44] leading-tight mb-6">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm border-y border-gray-100 py-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author || 'Equipo Técnico Mapzy'}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[21/9] w-full rounded-[2rem] overflow-hidden mb-10 shadow-lg">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p className="font-semibold text-lg text-gray-900 border-l-4 border-yellow-400 pl-4 py-2 italic bg-yellow-50/20">
            {summary}
          </p>
          
          {/* Si el contenido es Portable Text (array) o string plano */}
          {typeof content === 'string' ? (
            <p>{content}</p>
          ) : (
            <div className="space-y-4">
              {/* Renderizador simple de Portable Text para demostración (fallback a texto básico si viene de Sanity) */}
              {Array.isArray(content) && (content as Array<{ _type: string; children?: Array<{ text: string }> }>).map((block, idx: number) => {
                if (block._type === 'block' && block.children) {
                  return (
                    <p key={idx}>
                      {block.children.map((child) => child.text).join('')}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}
          
          <h3 className="text-xl font-bold text-[#1a2a44] mt-8 mb-4">Metodología Aplicada por Mapzy</h3>
          <p>
            En nuestra firma, cada análisis y propuesta técnica es respaldada por herramientas avanzadas de simulación geográfica y un rigor científico estricto. Esto nos permite garantizar que las intervenciones territoriales no solo cumplan con la legislación vigente, sino que aporten un valor duradero tanto a las empresas operadoras como a las comunidades circundantes.
          </p>
        </div>

      </div>
    </article>
  );
}
