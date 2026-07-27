import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

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
    const query = `*[_type == "post" && slug.current == $slug][0]{ title, summary }`;
    post = await client.fetch(query, { slug: params.slug });
  } catch {
    // Ignorar en build
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
    const query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      publishedAt,
      summary,
      mainImage,
      body,
      "author": author->name
    }`;
    post = await client.fetch(query, { slug: params.slug });
  } catch (error) {
    console.warn('Error al obtener post de Sanity:', error);
  }

  if (!post) {
    notFound();
  }

  const title = post.title || 'Artículo sin título';
  
  const dateFormatted = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Fecha reciente';

  const authorName = typeof post.author === 'string'
    ? post.author
    : (post.author?.name || 'Equipo Técnico Mapzy');

  const summary = post.summary || '';
  const content = post.body || [];
  const image = (post.mainImage && post.mainImage.asset)
    ? urlFor(post.mainImage).url()
    : 'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&q=80&w=600';

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
              <span>{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{authorName}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[21/9] w-full rounded-[2rem] overflow-hidden mb-10 shadow-lg">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          {summary && (
            <p className="font-semibold text-lg text-gray-900 border-l-4 border-yellow-400 pl-4 py-2 italic bg-yellow-50/20 mb-8">
              {summary}
            </p>
          )}

          {/* Renderizado seguro de bloques de Sanity */}
          {Array.isArray(content) ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content.map((block: any, idx: number) => {
              if (block._type === 'block') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const text = block.children ? block.children.map((c: any) => c.text || '').join('') : '';
                if (!text.trim()) return null;

                if (block.style === 'h2') {
                  return <h2 key={idx} className="text-2xl font-bold text-[#1a2a44] mt-8 mb-4">{text}</h2>;
                }
                if (block.style === 'h3') {
                  return <h3 key={idx} className="text-xl font-bold text-[#1a2a44] mt-6 mb-3">{text}</h3>;
                }
                if (block.style === 'blockquote') {
                  return <blockquote key={idx} className="border-l-4 border-yellow-400 pl-4 py-2 italic my-4 text-slate-700 bg-yellow-50/20">{text}</blockquote>;
                }
                return <p key={idx} className="mb-4">{text}</p>;
              }

              if (block._type === 'image' && block.asset) {
                const imgUrl = urlFor(block).url();
                return (
                  <figure key={idx} className="my-6">
                    <img src={imgUrl} alt="Imagen ilustrativa" className="rounded-2xl w-full max-h-[500px] object-cover shadow-md" />
                  </figure>
                );
              }

              return null;
            })
          ) : (
            <p>{typeof content === 'string' ? content : ''}</p>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-bold text-[#1a2a44] mb-3">Metodología e Inteligencia Territorial Mapzy</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              En Mapzy combinamos análisis de sensores remotos, cartografía geoespacial y normatividad técnica ambiental para garantizar viabilidad y continuidad en cada proyecto territorial en Colombia.
            </p>
          </div>
        </div>

      </div>
    </article>
  );
}
