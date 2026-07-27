/* eslint-disable @typescript-eslint/no-explicit-any, import/no-anonymous-default-export */
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Autor',
      type: 'string',
      initialValue: 'Equipo Técnico Mapzy',
    },
    {
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'summary',
      title: 'Resumen (Corto)',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.max(200).warning('Mantener resumen bajo 200 caracteres.'),
    },
    {
      name: 'content',
      title: 'Contenido (Portable Text)',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
