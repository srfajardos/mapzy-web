/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Las imagenes de proyectos y blog viven en Sanity. Autorizando su CDN,
    // next/image puede redimensionarlas y servirlas en AVIF o WebP en vez de
    // descargar el original a tamano completo, que es lo que pasa hoy con las
    // etiquetas <img> crudas.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
