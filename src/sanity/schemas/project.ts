/* eslint-disable @typescript-eslint/no-explicit-any, import/no-anonymous-default-export */
export default {
  name: 'project',
  title: 'Proyecto de Portafolio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título del Proyecto',
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
      name: 'client',
      title: 'Cliente',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
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
      validation: (Rule: any) => Rule.required(),
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
      name: 'description',
      title: 'Descripción (Resumen)',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'methodology',
      title: 'Metodología Técnica',
      type: 'text',
      rows: 5,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'results',
      title: 'Resultados Obtenidos',
      type: 'text',
      rows: 5,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'latitude',
      title: 'Latitud (Coordenadas)',
      type: 'number',
      description: 'Ejemplo: 4.6097 (Bogotá)',
    },
    {
      name: 'longitude',
      title: 'Longitud (Coordenadas)',
      type: 'number',
      description: 'Ejemplo: -74.0721 (Bogotá)',
    },
    {
      name: 'view3DUrl',
      title: 'URL de Visualización 3D (Opcional)',
      type: 'url',
      description: 'Enlace externo para visor LiDAR o Modelo 3D (Sketchfab, Potree, etc.)',
    },
  ],
};
