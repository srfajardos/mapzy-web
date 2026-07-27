'use client';

import React, { useState, useEffect } from 'react';
import { Download, Trash2, CheckSquare, Square, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface MatrixItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  comment: string;
}

interface MatrixSection {
  id: string;
  title: string;
  description: string;
  color: string;
  items: MatrixItem[];
}

const defaultLayers: MatrixSection[] = [
  {
    id: "fase-a",
    title: "Fase A: Capas de Veto Absoluto y Riesgo Inminente",
    description: "Intersección = Abortar polígono. Estas capas representan bloqueos legales o físicos insalvables.",
    color: "red",
    items: [
      { id: "v-etnico", title: "Vetos Étnicos y Sociales", description: "TCN Tierras Comunidades Negras y RI Resguardo Indígena.", checked: false, comment: "" },
      { id: "v-amb-sup", title: "Vetos Ambientales Supremos", description: "Complejos Páramo, Límite PNN (Parques Nacionales Naturales) y Límite RUNAP.", checked: false, comment: "" },
      { id: "v-prot-terr", title: "Vetos de Protección Territorial", description: "Área Protección Local, Área Protección Regional y Límite RNSC.", checked: false, comment: "" },
      { id: "v-arq-sob", title: "Vetos Arqueológicos y de Soberanía", description: "Parque Arqueológico, LM Límite Internacional y Zonas de Restitución de Tierras.", checked: false, comment: "" },
      { id: "v-topo", title: "Veto Topográfico (Física del Terreno)", description: "Modelo Digital de Elevación (DEM) / Pendientes (Slope) superiores al 15% - 20%.", checked: false, comment: "" },
      { id: "v-hidro-clim", title: "Veto Hídrico-Climático (Riesgo Natural)", description: "Amenaza por Inundación y Remoción en Masa (IDEAM).", checked: false, comment: "" }
    ]
  },
  {
    id: "fase-b",
    title: "Fase B: Capas de Fricción, Alertas y Atractores",
    description: "Variables de costeo, negociación y viabilidad logística.",
    color: "amber",
    items: [
      { id: "f-bio", title: "Biológicas y Forestales", description: "Reservas Forestales L2, Distribución Especies y LRE.", checked: false, comment: "" },
      { id: "f-arq-min", title: "Arqueológicas Menores", description: "Hallazgos Arqueológicos Municipio.", checked: false, comment: "" },
      { id: "f-subsuelo", title: "Competencia del Subsuelo", description: "Catastro Minero (Títulos vigentes/solicitudes) y Bloques de Hidrocarburos.", checked: false, comment: "" },
      { id: "f-pot", title: "Ordenamiento del Suelo", description: "POT/EOT Municipal.", checked: false, comment: "" },
      { id: "f-seguridad", title: "Seguridad y Conflicto", description: "Alertas Tempranas (Defensoría del Pueblo) y presencia de economías ilícitas (SIMCI).", checked: false, comment: "" },
      { id: "f-acuiferos", title: "Competencia Hídrica Subterránea", description: "Nivel freático y Zonas de Recarga de Acuíferos.", checked: false, comment: "" },
      { id: "f-agricola", title: "Veto Agrícola Estratégico", description: "Distritos de Riego (ej. canales y zonas de influencia directa).", checked: false, comment: "" },
      { id: "f-edafo", title: "Edafología Intocable", description: "Suelos agrológicos Clases I, II y III (IGAC).", checked: false, comment: "" },
      { id: "f-servidumbres", title: "Servidumbres Invisibles", description: "Trazado de Gasoductos, Poliductos y redes soterradas mayores.", checked: false, comment: "" }
    ]
  },
  {
    id: "fase-c",
    title: "Fase C: Atractores Tácticos y Financieros",
    description: "Vectores de apalancamiento puro para reducir OPEX y CAPEX.",
    color: "emerald",
    items: [
      { id: "a-zomac", title: "Incentivos Tributarios (ZOMAC)", description: "Municipios con exenciones en impuesto de renta.", checked: false, comment: "" },
      { id: "a-circular", title: "Sinergia de Residuos (Economía Circular)", description: "Proximidad a plantas cementeras masivas para disposición de lodo de sílice.", checked: false, comment: "" },
      { id: "a-ptar", title: "Hídrico Industrial (PTAR)", description: "Cercanía a Plantas de Tratamiento de Aguas Residuales para circuitos cerrados.", checked: false, comment: "" },
      { id: "a-backhaul", title: "Topología de Retorno (Flete Inverso)", description: "Corredores logísticos con disponibilidad de mulas vacías (backhaul).", checked: false, comment: "" },
      { id: "a-gas", title: "Infraestructura de Gas Natural", description: "Presencia de City Gates o ramales de TGI/Vanti para secado térmico.", checked: false, comment: "" },
      { id: "a-sena", title: "Capital Humano Técnico", description: "Proximidad a nodos SENA (metalmecánica, CNC, electricidad de potencia).", checked: false, comment: "" },
      { id: "a-red-elec", title: "Red de Alta Tensión", description: "Sistema Interconectado Nacional (Subestaciones y líneas > 34.5 kV).", checked: false, comment: "" },
      { id: "a-vial", title: "Malla Vial Estratégica", description: "Red vial primaria, concesiones 4G/5G y puentes con capacidad >40 ton.", checked: false, comment: "" },
      { id: "a-cluster", title: "Clústeres Industriales", description: "Zonas francas, parques industriales y polígonos logísticos.", checked: false, comment: "" }
    ]
  }
];

export default function MatrizExclusion() {
  const [sections, setSections] = useState<MatrixSection[]>(defaultLayers);
  const STORAGE_KEY = 'mapzy_exclusion_matrix_data';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
          setSections(parsed);
        }
      } catch (e) {
        console.error("Error al cargar la matriz guardada:", e);
      }
    }
  }, []);

  const saveState = (newSections: MatrixSection[]) => {
    setSections(newSections);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSections));
  };

  const handleToggle = (sIndex: number, iIndex: number) => {
    const updated = [...sections];
    updated[sIndex].items[iIndex].checked = !updated[sIndex].items[iIndex].checked;
    saveState(updated);
  };

  const handleComment = (sIndex: number, iIndex: number, text: string) => {
    const updated = [...sections];
    updated[sIndex].items[iIndex].comment = text;
    saveState(updated);
  };

  const handleClear = () => {
    if (confirm("¿Deseas reiniciar la matriz y borrar tus comentarios locales?")) {
      localStorage.removeItem(STORAGE_KEY);
      setSections(defaultLayers);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sections, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "matriz_exclusion_mapzy.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-[#1a2a44] text-white p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs inline-block mb-1">Evaluación de Viabilidad Territorial</span>
          <h2 className="text-3xl font-black">Matriz de Exclusión Geoespacial</h2>
          <p className="text-slate-300 text-sm mt-1">Filtro de Vía Negativa para Prospección Territorial e Industrial (Tolima / Cundinamarca)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#1a2a44] font-bold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-md"
          >
            <Download size={16} /> Exportar JSON
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Trash2 size={16} /> Reiniciar
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {sections.map((section, sIndex) => {
          const colorStyles: Record<string, string> = {
            red: "border-red-200 bg-red-50/50 text-red-950",
            amber: "border-amber-200 bg-amber-50/50 text-amber-950",
            emerald: "border-emerald-200 bg-emerald-50/50 text-emerald-950"
          };

          return (
            <div key={section.id} className={`rounded-2xl border ${colorStyles[section.color]} overflow-hidden shadow-sm`}>
              <div className="px-6 py-4 border-b border-inherit bg-white/70 backdrop-blur-sm">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {section.color === 'red' && <AlertTriangle className="text-red-500" size={20} />}
                  {section.color === 'amber' && <Zap className="text-amber-500" size={20} />}
                  {section.color === 'emerald' && <ShieldCheck className="text-emerald-500" size={20} />}
                  {section.title}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
              </div>

              <div className="divide-y divide-inherit">
                {section.items.map((item: MatrixItem, iIndex: number) => (
                  <div key={item.id} className="p-5 flex flex-col md:flex-row gap-4 hover:bg-white/60 transition-colors">
                    <div className="md:w-1/2 flex items-start gap-3">
                      <button
                        onClick={() => handleToggle(sIndex, iIndex)}
                        className="mt-1 text-slate-700 hover:text-slate-900 transition-colors shrink-0"
                      >
                        {item.checked ? <CheckSquare className="text-yellow-600" size={20} /> : <Square className="text-slate-300" size={20} />}
                      </button>
                      <div>
                        <span
                          onClick={() => handleToggle(sIndex, iIndex)}
                          className={`font-bold cursor-pointer text-sm md:text-base ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}
                        >
                          {item.title}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <div className="md:w-1/2">
                      <textarea
                        value={item.comment}
                        onChange={(e) => handleComment(sIndex, iIndex, e.target.value)}
                        placeholder="Agregar observaciones, coordenadas o números de resolución..."
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500/20 text-slate-800 h-20 resize-none shadow-inner"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
