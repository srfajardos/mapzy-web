import React from 'react';
import { Database, Leaf, Zap, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Servicios | Mapzy - Ingeniería, Topografía y Consultoría Ambiental',
  description: 'Explora nuestros servicios técnicos especializados en geología, cartografía SIG, licencias ambientales y ordenamiento territorial en Colombia.',
};

export default function ServiciosPage() {
  const serviciosDetallados = [
    {
      titulo: 'Geología & Minería',
      icon: Database,
      subtitulo: 'Soluciones y exploración para el desarrollo de recursos.',
      descripcion: 'Nuestras capacidades en geología cubren desde la cartografía geológica de superficie hasta el modelado tridimensional avanzado de depósitos minerales. Diseñamos planes de minería óptimos y sostenibles que garantizan eficiencia operativa y estricto cumplimiento legal.',
      caracteristicas: [
        'Cartografía y mapeo geológico de campo.',
        'Exploración geofísica e investigación de yacimientos.',
        'Estudios geotécnicos para obras civiles y mineras.',
        'Diseño de planes de trabajos y obras (PTO).',
      ],
    },
    {
      titulo: 'Gestión Ambiental',
      icon: Leaf,
      subtitulo: 'Sostenibilidad y cumplimiento normativo integral.',
      descripcion: 'Ayudamos a nuestros clientes a navegar los complejos marcos regulatorios ambientales de Colombia. Formulamos Estudios de Impacto Ambiental (EIA) de alta calidad, gestionamos concesiones de agua y diseñamos planes de manejo ambiental prácticos y efectivos.',
      caracteristicas: [
        'Estudios de Impacto Ambiental (EIA).',
        'Planes de Manejo Ambiental (PMA).',
        'Trámites de concesiones de aguas y permisos de vertimientos.',
        'Auditorías ambientales y planes de cierre.',
      ],
    },
    {
      titulo: 'Tecnología SIG',
      icon: Zap,
      subtitulo: 'Inteligencia espacial para la toma de decisiones.',
      descripcion: 'Transformamos datos en valor geográfico. Desarrollamos Sistemas de Información Geográfica (SIG) personalizados y gemelos digitales que permiten monitorizar activos, optimizar rutas y modelar escenarios territoriales dinámicos.',
      caracteristicas: [
        'Desarrollo e integración de bases de datos espaciales.',
        'Procesamiento de imágenes satelitales y datos LiDAR.',
        'Creación de gemelos digitales para infraestructuras.',
        'Capacitación y soporte técnico en software SIG.',
      ],
    },
    {
      titulo: 'Ordenamiento Territorial',
      icon: Globe,
      subtitulo: 'Planificación de espacios sostenibles y resilientes.',
      descripcion: 'Acompañamos a entes públicos y privados en la formulación y revisión de los Planes de Ordenamiento Territorial (POT). Aportamos análisis técnicos de riesgo, zonificación ecológica y capacidad de soporte del suelo.',
      caracteristicas: [
        'Estudios de riesgos y amenazas por fenómenos naturales.',
        'Zonificación ecológica y ambiental del territorio.',
        'Estudios de capacidad de soporte del suelo.',
        'Consultoría para formulación y revisión de POT.',
      ],
    },
  ];

  return (
    <div className="bg-white pb-16">
      {/* Header Section */}
      <div className="bg-[#1a2a44] text-white py-20 px-4 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486787284432-3749cdce2660?q=80&w=1631')" }}></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-3 inline-block">Portafolio Técnico</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Nuestros Servicios</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Ofrecemos soluciones geoespaciales integrales basadas en rigor científico y experiencia operativa en el territorio.
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {serviciosDetallados.map((servicio, idx) => {
          const Icon = servicio.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content Panel */}
              <div className="flex-1">
                <div className="text-yellow-500 mb-6 bg-yellow-400/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <Icon size={32} />
                </div>
                <h2 className="text-3xl font-extrabold text-[#1a2a44] mb-3">{servicio.titulo}</h2>
                <h3 className="text-lg font-semibold text-yellow-600 mb-4">{servicio.subtitulo}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{servicio.descripcion}</p>
                
                <ul className="space-y-3">
                  {servicio.caracteristicas.map((caract, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-3">
                      <span className="text-yellow-500 mt-1 shrink-0">✔</span>
                      <span className="text-gray-700 text-sm font-medium">{caract}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative Panel */}
              <div className="flex-1 w-full aspect-[4/3] rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center p-8 relative overflow-hidden group shadow-md">
                <div className="absolute inset-0 bg-[#1a2a44]/5 group-hover:bg-[#1a2a44]/10 transition-colors duration-300"></div>
                <div className="z-10 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#1a2a44] text-yellow-400 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Icon size={40} />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#1a2a44]/60 font-bold">
                    Área Operativa
                  </span>
                  <p className="text-lg font-bold text-[#1a2a44] mt-1">{servicio.titulo}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call To Action */}
      <div className="max-w-5xl mx-auto px-4 mt-24">
        <div className="bg-[#f8fafc] border border-gray-100 rounded-[3rem] p-12 lg:p-16 text-center shadow-lg">
          <h2 className="text-3xl font-extrabold text-[#1a2a44] mb-4">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            Hablemos sobre cómo nuestras herramientas geoespaciales y de ingeniería pueden impulsar tu proyecto asegurando el cumplimiento ambiental.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 bg-[#1a2a44] text-white px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 hover:text-[#1a2a44] transition-all duration-300 transform hover:scale-105"
          >
            Iniciar Consulta SIG <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
