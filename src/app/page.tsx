import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Projects, { Project } from '@/components/Projects';
import Team from '@/components/Team';
import ContactoForm from '@/components/ContactoForm';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const revalidate = 60; // Revalidar la página cada 60 segundos (ISR)

export default async function Home() {
  let projects: Project[] = [];

  try {
    // Consulta GROQ para obtener proyectos desde Sanity
    const query = `*[_type == "project"] | order(_createdAt desc) [0...3]`;
    const sanityProjects = await client.fetch(query);

    if (sanityProjects && sanityProjects.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projects = sanityProjects.map((p: any) => ({
        id: p._id,
        slug: p.slug.current,
        nombre: p.title,
        categoria: p.sector,
        descripcion: p.description,
        imagen: p.mainImage ? urlFor(p.mainImage).url() : 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=500',
      }));
    }
  } catch {
    console.warn('Error al conectar con Sanity.io para Proyectos. Retornando lista vacía.');
  }

  return (
    <>
      <Hero videoUrl="" />
      <Services />
      <Projects projects={projects} />
      <Team />
      <ContactoForm />
    </>
  );
}
