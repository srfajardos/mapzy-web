import React, { useState, useEffect } from 'react';
import {
  Compass,
  Map,
  Leaf,
  Users,
  Mail,
  ChevronRight,
  Globe,
  Zap,
  Database,
  Menu,
  X,
  Linkedin,
  Youtube,
  Instagram,
  ExternalLink
} from 'lucide-react';

/**
 * Componente principal para el sitio web de Mapzy.
 * Mapzy: Mapeando futuros sostenibles.
 */
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');

  // Datos para el blog corporativo
  const blogPosts = [
    {
      id: 1,
      titolo: "El Futuro de la Tecnología Geoespacial",
      dato: "10 de Mayo, 2024",
      resumo: "Cómo los gemelos digitales están transformando la planificación territorial en Colombia."
    },
    {
      id: 2,
      titolo: "Minería Sostenible: ¿Es posible?",
      dato: "02 de Mayo, 2024",
      resumo: "Nuestra visión sobre el equilibrio entre la extracción de recursos y la protección ambiental."
    }
  ];

  // Datos para los proyectos destacados
  const proyectos = [
    { id: 1, nomo: "Mapeo SIG Bogotá", kategorio: "Tecnología" },
    { id: 2, nomo: "Análisis de Impacto Ambiental", kategorio: "Medio Ambiente" },
    { id: 3, nomo: "Exploración Geológica Avanzada", kategorio: "Minería" }
  ];

  // Datos del equipo directivo
  const equipo = [
    { n: "Sergio R. Fajardo", r: "Director General y Coord. Geología" },
    { n: "Juan S. Samboni", r: "Gestión de Riesgo y Ordenamiento" },
    { n: "Andres F. Bermudez", r: "SIG y Geofísica" },
    { n: "Javier S. Fajardo", r: "Biología y Gestión Ambiental" }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1a2a44] font-sans selection:bg-yellow-200">
      {/* Navegación */}
      <nav className="fixed w-full z-50 bg-[#1a2a44]/95 backdrop-blur-md text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-yellow-400/20">
                <Compass className="text-[#1a2a44]" size={28} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter text-yellow-400">Mapzy</span>
                <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-white/80 mt-1">Mapas, Zonificación y Yacimientos</span>
              </div>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              {['Inicio', 'Servicios', 'Proyectos', 'Blog', 'Equipo', 'Contacto'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-yellow-400 transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  {item}
                </a>
              ))}
              <button className="bg-yellow-400 text-[#1a2a44] px-5 py-2 rounded-full font-bold hover:bg-yellow-300 transition-all transform hover:scale-105">
                Consulta SIG
              </button>
            </div>

            <div className="md:hidden text-yellow-400">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#1a2a44] p-4 flex flex-col space-y-4 border-t border-white/10">
            {['Inicio', 'Servicios', 'Proyectos', 'Blog', 'Equipo', 'Contacto'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-yellow-400">
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486787284432-3749cdce2660?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a44]/70 to-[#1a2a44]/20"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Mapeando Futuros <span className="text-yellow-400">Sostenibles</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light italic">
            "Líderes en soluciones geoespaciales y desarrollo territorial en Colombia."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-[#1a2a44] px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(253,224,71,0.5)] transition-all">
              Ver Servicios
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              Nuestros Proyectos
            </button>
          </div>
        </div>
      </header>

      {/* Servicios Section */}
      <section id="servicios" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Nuestros <span className="text-yellow-500">Servicios</span></h2>
          <div className="w-20 h-1.5 bg-yellow-400 mx-auto mb-16 rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { t: "Geología & Minería", i: <Database />, d: "Diseño de planes de minería y exploración geológica avanzada." },
              { t: "Gestión Ambiental", i: <Leaf />, d: "Evaluaciones de impacto ambiental y planes de manejo integral." },
              { t: "Tecnología SIG", i: <Zap />, d: "Implementación de sistemas de información geográfica y gemelos digitales." },
              { t: "Ordenamiento", i: <Globe />, d: "Zonificación territorial y análisis de uso del suelo." }
            ].map((service, idx) => (
              <div key={idx} className="p-8 border border-gray-100 rounded-3xl hover:border-yellow-400 transition-all hover:shadow-2xl group text-left">
                <div className="text-yellow-500 mb-6 transform group-hover:scale-110 transition-transform">
                  {React.cloneElement(service.i, { size: 40 })}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.t}</h3>
                <p className="text-gray-500 leading-relaxed">{service.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos Section */}
      <section id="proyectos" className="py-24 px-4 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold">Proyectos <span className="text-yellow-500">Recientes</span></h2>
              <p className="text-gray-500 mt-2">Soluciones aplicadas en territorio colombiano.</p>
            </div>
            <button className="hidden md:flex items-center text-[#1a2a44] font-bold hover:text-yellow-600">
              Ver portafolio <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proyectos.map((p) => (
              <div key={p.id} className="relative group overflow-hidden rounded-2xl aspect-[4/3] bg-[#1a2a44]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">{p.kategorio}</span>
                  <h4 className="text-white text-xl font-bold mt-1">{p.nomo}</h4>
                </div>
                <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-500">
                  <img src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=500`} alt={p.nomo} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 italic">Últimas <span className="text-yellow-500">Publicaciones</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {blogPosts.map((post) => (
              <article key={post.id} className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-gray-50 hover:bg-yellow-50 transition-colors border border-transparent hover:border-yellow-200">
                <div className="w-full md:w-48 h-48 bg-gray-200 rounded-2xl overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&q=80&w=300" alt="blog" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm">{post.dato}</span>
                  <h3 className="text-2xl font-bold my-2 group-hover:text-yellow-600 transition-colors">{post.titolo}</h3>
                  <p className="text-gray-600 mb-4">{post.resumo}</p>
                  <button className="text-[#1a2a44] font-bold flex items-center gap-1 group hover:text-yellow-600">
                    Leer más <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo Section */}
      <section id="equipo" className="py-24 px-4 bg-[#1a2a44] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">Nuestro <span className="text-yellow-400">Equipo</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {equipo.map((m, idx) => (
              <div key={idx} className="group">
                <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-yellow-400 p-1 bg-white/5 transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                    <Users size={48} className="text-yellow-400" />
                  </div>
                </div>
                <h4 className="text-xl font-bold">{m.n}</h4>
                <p className="text-yellow-400/80 text-sm mt-1 uppercase tracking-tighter">{m.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f8fafc] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-xl border border-gray-100">
            <div className="lg:w-1/2 p-12 lg:p-20 bg-[#1a2a44] text-white">
              <h2 className="text-4xl font-bold mb-8 italic">"Iniciemos una conversación."</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400">
                    <Mail />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm uppercase">Correo Electrónico</p>
                    <p className="font-bold">info@mapzy.co</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400">
                    <Globe />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm uppercase">Ubicación Principal</p>
                    <p className="font-bold">Calle 119 #50-50, Bogotá, Colombia</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-[#1a2a44] transition-all cursor-pointer"><Linkedin size={18} /></div>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-[#1a2a44] transition-all cursor-pointer"><Instagram size={18} /></div>
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-[#1a2a44] transition-all cursor-pointer"><Youtube size={18} /></div>
              </div>
            </div>

            <div className="lg:w-1/2 p-12 lg:p-20">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Nombre</label>
                    <input type="text" className="w-full bg-white border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all" placeholder="Nombre completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                    <input type="email" className="w-full bg-white border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all" placeholder="correo@ejemplo.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Asunto</label>
                  <select className="w-full bg-white border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all">
                    <option>Consultoría SIG</option>
                    <option>Gestión Ambiental</option>
                    <option>Geología y Minería</option>
                    <option>Otros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Mensaje</label>
                  <textarea className="w-full bg-white border border-gray-200 p-4 rounded-xl h-32 focus:ring-2 focus:ring-yellow-400 outline-none transition-all resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
                </div>
                <button className="w-full bg-[#1a2a44] text-white p-4 rounded-xl font-bold hover:bg-black transition-all transform hover:translate-y-[-2px] shadow-lg flex items-center justify-center gap-2">
                  Enviar Mensaje <ChevronRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="bg-gray-100 py-12 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center shrink-0">
                <Compass className="text-white" size={24} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-[#1a2a44]">Mapzy</span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mt-1">Mapas, Zonificación y Yacimientos</span>
              </div>
            </div>
            <p className="text-gray-500 max-w-xs text-sm">
              Mapeando futuros sostenibles para Colombia y el mundo. Soluciones geoespaciales integrales.
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            <p>© 2024 Mapzy S.A.S. Todos los derechos reservados.</p>
            <p className="mt-1">Bogotá, Colombia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;