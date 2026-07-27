'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, ShieldCheck, Search, HeartPulse, Plane, Construction, Landmark, MapPin, Truck } from 'lucide-react';

export default function SGRAndinoPage() {
  return (
    <div className="bg-white text-[#37352f] min-h-screen py-10 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto px-6 mb-6">
        <Link
          href="/articulos"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1a2a44] transition-colors"
        >
          <ArrowLeft size={16} /> Volver a Artículos
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-4">
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Documento Estratégico
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight font-serif text-[#37352f]">
              Sistema de Gestión del Riesgo para la Región Andina Colombiana
            </h1>
            <h2 className="text-xl text-slate-500 font-light leading-relaxed mb-8">
              Un marco integral enfocado en la caracterización de vulnerabilidades y planificación prospectiva para entornos intramontanos, fundamentado en la Ley 1523 de 2012.
            </h2>

            <div className="flex items-center gap-4 py-4 border-y border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                SGR
              </div>
              <div>
                <div className="text-sm font-semibold">Dirección de Planificación Territorial</div>
                <div className="text-xs text-slate-400">Ricaurte, Cundinamarca • Ley 1523 de 2012</div>
              </div>
            </div>
          </header>

          {/* Section 1 */}
          <section className="mb-12 space-y-6 text-lg leading-relaxed font-serif">
            <p>
              Diseñar un <strong>Sistema de Gestión del Riesgo (SGR)</strong> adaptado a la región andina e intramontaña colombiana requiere comprender una premisa fundamental: la topografía abrupta, la inestabilidad geológica y la variabilidad climática convierten a nuestro territorio en un sistema altamente dinámico y complejo.
            </p>
            <p>
              Para estructurar este sistema propio sobre una base legal y metodológica sólida, nos apalancamos en los tres pilares de la <strong>Ley 1523 de 2012</strong>: <em>Conocimiento del Riesgo, Reducción del Riesgo y Manejo de Desastres</em>, adaptándolos estrictamente a las dinámicas territoriales y productivas específicas de la región.
            </p>

            <h3 className="text-2xl font-bold font-sans text-[#37352f] pt-6 mb-4">
              1. Arquitectura del Sistema Propio
            </h3>
            <p>
              Todo marco de gestión debe estructurarse bajo la función teórica del riesgo. En la zona andina, las amenazas (movimientos en masa, avenidas torrenciales, sismos, incendios en páramos) suelen ser constantes o recurrentes. Por ende, el sistema debe enfocar su potencia en la <strong>caracterización de la exposición y las vulnerabilidades</strong> (física, socioeconómica, institucional y funcional).
            </p>

            {/* Formula Block */}
            <div className="my-8 py-6 px-4 bg-[#f7f6f3] border border-slate-200 rounded-2xl text-center font-mono text-xl md:text-2xl text-red-600 font-bold shadow-inner">
              Riesgo = f(Amenaza, Exposición, Vulnerabilidad)
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 font-sans text-base">
              <div className="border border-slate-200 rounded-2xl p-5 bg-[#f7f6f3]">
                <div className="flex items-center gap-2 mb-3 text-blue-600">
                  <Search size={20} />
                  <h4 className="font-bold text-[#37352f] text-base">Conocimiento</h4>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                  <li>Diagnóstico Sectorial</li>
                  <li>Análisis de Vulnerabilidad</li>
                  <li>Mapeo SIG e Indicadores</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 bg-[#f7f6f3]">
                <div className="flex items-center gap-2 mb-3 text-green-600">
                  <ShieldCheck size={20} />
                  <h4 className="font-bold text-[#37352f] text-base">Reducción</h4>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                  <li>Intervención en POT/PBOT</li>
                  <li>Bioingeniería y Estructuras</li>
                  <li>Protección Financiera</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 bg-[#f7f6f3]">
                <div className="flex items-center gap-2 mb-3 text-red-600">
                  <HeartPulse size={20} />
                  <h4 className="font-bold text-[#37352f] text-base">Manejo</h4>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                  <li>Planes Contingencia (Art. 42)</li>
                  <li>Alertas Tempranas (SAT)</li>
                  <li>Protocolos de Respuesta</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: 5 Sectors */}
          <section className="mb-12 font-sans">
            <h3 className="text-2xl font-bold mb-4">
              2. Caracterización de Riesgos y Vulnerabilidades Sectoriales
            </h3>
            <p className="text-slate-600 mb-8 font-serif">
              A continuación, se sintetizan las vulnerabilidades críticas y los problemas futuros proyectados para los cinco sectores clave en contextos intramontanos.
            </p>

            <div className="space-y-6">
              {/* Sector 1: Turismo */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                <div className="bg-slate-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-xl"><Plane size={24} /></div>
                  <h4 className="font-bold text-lg text-[#37352f]">Turismo</h4>
                </div>
                <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Vulnerabilidades</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Infraestructura en rondas hídricas o laderas inestables.</li>
                      <li>Falta de planes sectoriales y capacidad de evacuación.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Riesgos Futuros</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Aislamiento por cierres viales.</li>
                      <li>Sobrecarga en ecosistemas frágiles (ej. páramos).</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sector 2: Infraestructura */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                <div className="bg-slate-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex items-center gap-3">
                  <div className="p-3 bg-orange-100 text-orange-700 rounded-xl"><Construction size={24} /></div>
                  <h4 className="font-bold text-lg text-[#37352f]">Infraestructura</h4>
                </div>
                <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Vulnerabilidades</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Diseños que omiten el cambio climático.</li>
                      <li>Mantenimiento correctivo vs. preventivo.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Riesgos Futuros</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Colapso de redes vitales (agua, energía).</li>
                      <li>Altos costos de reconstrucción estructural.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sector 3: Gobernanza */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                <div className="bg-slate-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-700 rounded-xl"><Landmark size={24} /></div>
                  <h4 className="font-bold text-lg text-[#37352f]">Gobernanza</h4>
                </div>
                <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Vulnerabilidades</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Municipios Cat. 5 y 6 con escasa capacidad.</li>
                      <li>Desarticulación con autoridades ambientales.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Riesgos Futuros</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Parálisis institucional en emergencias.</li>
                      <li>Sanciones legales disciplinarias (Ley 1523, Art. 93).</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sector 4: Territorialidad */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                <div className="bg-slate-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex items-center gap-3">
                  <div className="p-3 bg-green-100 text-green-700 rounded-xl"><MapPin size={24} /></div>
                  <h4 className="font-bold text-lg text-[#37352f]">Territorialidad</h4>
                </div>
                <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Vulnerabilidades</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>POT/EOT desactualizados.</li>
                      <li>Expansión urbana sobre zonas de amenaza.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Riesgos Futuros</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Asentamientos en alto riesgo no mitigable.</li>
                      <li>Conflictos por reasentamientos fallidos.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sector 5: Logística y Transporte */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                <div className="bg-slate-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 text-yellow-700 rounded-xl"><Truck size={24} /></div>
                  <h4 className="font-bold text-lg text-[#37352f]">Logística y T.</h4>
                </div>
                <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Vulnerabilidades</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Dependencia de vías unimodales sin alternas.</li>
                      <li>Puntos críticos por deslizamientos.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 uppercase mb-2">Riesgos Futuros</div>
                    <ul className="space-y-1 list-disc pl-4">
                      <li>Desabastecimiento de insumos básicos.</li>
                      <li>Pérdida de competitividad regional.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Strategic Modules */}
          <section className="mb-12 font-sans space-y-6">
            <h3 className="text-2xl font-bold mb-4">3. Componentes Estratégicos del Sistema</h3>

            <div className="space-y-6">
              <div className="bg-[#f7f6f3] p-6 rounded-2xl border border-slate-200">
                <h4 className="text-base font-bold flex items-center gap-3 mb-3">
                  <span className="bg-[#1a2a44] text-yellow-400 text-xs px-2.5 py-1 rounded-lg">Módulo A</span>
                  Módulo de Conocimiento y Evaluación
                </h4>
                <ul className="space-y-3 text-sm text-slate-700 leading-relaxed list-disc pl-5">
                  <li>
                    <strong>Visor de Riesgo Territorial (GIS):</strong> Superposición de capas geográficas de amenazas (IDIGER, SGC, IDEAM) con la ubicación de activos críticos (vías, hoteles, redes de servicios).
                  </li>
                  <li>
                    <strong>Índice de Vulnerabilidad Multidimensional:</strong> Evaluación que combina factores de rigidez física, capacidad de respuesta económica e institucional.
                  </li>
                </ul>
              </div>

              <div className="bg-[#f7f6f3] p-6 rounded-2xl border border-slate-200">
                <h4 className="text-base font-bold flex items-center gap-3 mb-3">
                  <span className="bg-[#1a2a44] text-yellow-400 text-xs px-2.5 py-1 rounded-lg">Módulo B</span>
                  Módulo de Reducción y Planificación Prospectiva
                </h4>
                <ul className="space-y-3 text-sm text-slate-700 leading-relaxed list-disc pl-5">
                  <li>
                    <strong>Determinantes Ambientales en POT:</strong> Obligatoriedad de incorporar los estudios de riesgo como condicionante para el uso del suelo (Artículos 39 y 40 de la Ley 1523).
                  </li>
                  <li>
                    <strong>Análisis Específicos de Riesgo Sectorial:</strong> De acuerdo con el <em>Artículo 42 de la Ley 1523</em>, toda empresa que preste servicios públicos, ejecute obras mayores o desarrolle actividades de impacto, debe elaborar sus propios análisis y planes de contingencia.
                  </li>
                  <li>
                    <strong>Soluciones Basadas en la Naturaleza (SbN):</strong> Bioingeniería de suelos en laderas, reforestación de cuencas altas y restauración de humedales para amortiguar avenidas torrenciales.
                  </li>
                </ul>
              </div>

              <div className="bg-[#f7f6f3] p-6 rounded-2xl border border-slate-200">
                <h4 className="text-base font-bold flex items-center gap-3 mb-3">
                  <span className="bg-[#1a2a44] text-yellow-400 text-xs px-2.5 py-1 rounded-lg">Módulo C</span>
                  Módulo de Gobernanza y Financiación
                </h4>
                <ul className="space-y-3 text-sm text-slate-700 leading-relaxed list-disc pl-5">
                  <li>
                    <strong>Mecanismos de Concurrencia y Subsidiariedad:</strong> Estructuración de esquemas de asociación municipal (Art. 30) para compartir recursos en zonas comunes.
                  </li>
                  <li>
                    <strong>Fondo Territorial de Gestión del Riesgo:</strong> Creación y mantenimiento de una cuenta especial acumulativa para financiar prevención y contingencias (Art. 54).
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Implementation Callout */}
          <div className="my-10 p-6 bg-[#f4eeee] rounded-2xl border border-rose-200 text-[#603b2c] flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div className="font-sans text-sm leading-relaxed">
              <strong className="block font-bold text-base mb-1">Nota clave de implementación:</strong>
              Un error común en zonas intramontanas es analizar el riesgo de manera fragmentada por municipio. El agua y los deslizamientos no respetan límites administrativos; por tanto, este sistema debe adoptar la <strong>cuenca hidrográfica</strong> como la unidad mínima de análisis y gestión integral.
            </div>
          </div>

          <hr className="my-10 border-slate-200" />

          {/* Footer & Print Button */}
          <footer className="text-center font-sans space-y-4">
            <p className="text-slate-400 text-xs leading-relaxed">
              Documento estructurado en base a la Ley 1523 de 2012 de la República de Colombia.<br />
              Creado para planificación prospectiva y continuidad sectorial.
            </p>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              <Printer size={16} /> Exportar a PDF / Imprimir Documento
            </button>
          </footer>
        </article>
      </main>
    </div>
  );
}
