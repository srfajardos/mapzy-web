import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Proyecto de Portafolio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del Proyecto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sector',
      title: 'Sector Industrial',
      type: 'string',
      options: {
        list: [
          { title: 'Minería', value: 'Minería' },
          { title: 'Tecnología / SIG', value: 'Tecnología' },
          { title: 'Medio Ambiente', value: 'Medio Ambiente' },
          { title: 'Topografía / Obras', value: 'Topografía' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción (Resumen)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'methodology',
      title: 'Metodología Técnica',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'results',
      title: 'Resultados Obtenidos',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'latitude',
      title: 'Latitud (Coordenadas)',
      type: 'number',
      description: 'Ejemplo: 4.6097 (Bogotá)',
    }),
    defineField({
      name: 'longitude',
      title: 'Longitud (Coordenadas)',
      type: 'number',
      description: 'Ejemplo: -74.0721 (Bogotá)',
    }),
    defineField({
      name: 'view3DUrl',
      title: 'URL de Visualización 3D (Opcional)',
      type: 'url',
      description: 'Enlace externo para visor LiDAR o Modelo 3D (Sketchfab, Potree, etc.)',
    }),
  ],
})
