'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

interface StateNode {
  name: string;
  category: string;
  desc: string;
  extra?: string;
  children?: StateNode[];
  _children?: StateNode[];
}

type CustomHierarchyNode = d3.HierarchyNode<StateNode> & {
  x0?: number;
  y0?: number;
  x?: number;
  y?: number;
  _children?: CustomHierarchyNode[] | undefined;
  id?: string;
};

const stateData: StateNode = {
  name: "Estado Colombiano",
  category: "root",
  desc: "Estructura principal del poder público en Colombia. Se rige por la Constitución Política de 1991, estableciendo un Estado social de derecho, organizado en forma de República unitaria, descentralizada, con autonomía de sus entidades territoriales, democrática, participativa y pluralista.",
  extra: "El poder no se concentra. Se divide en Ramas (para administrar, legislar y juzgar) y en Órganos Estatales (para vigilar, organizar elecciones y mantener la estabilidad económica).",
  children: [
    // 1. RAMA EJECUTIVA
    {
      name: "Rama Ejecutiva",
      category: "ejecutiva",
      desc: "Encargada de administrar el Estado, ejecutar las políticas públicas, cumplir las leyes y mantener el orden público. Es liderada por el Presidente de la República.",
      children: [
        {
          name: "Sector Central (Nacional)",
          category: "ejecutiva",
          desc: "Entidades que conforman el núcleo del gobierno nacional y dictan las políticas de todo el país.",
          children: [
            {
              name: "Presidencia de la República",
              category: "ejecutiva",
              desc: "Jefatura de Estado, Jefatura de Gobierno y suprema autoridad administrativa. Dirige la fuerza pública y las relaciones internacionales.",
              children: [
                { name: "Vicepresidencia", category: "ejecutiva", desc: "Reemplaza al Presidente en faltas temporales o absolutas. El Presidente le confía misiones específicas (ej. equidad, temas sociales o relaciones internacionales)." },
                { name: "Consejerías Presidenciales", category: "ejecutiva", desc: "Grupos de asesores directos del Presidente (Ej. Consejería para las Regiones, Derechos Humanos, Paz)." }
              ]
            },
            {
              name: "Ministerios (19)",
              category: "ejecutiva",
              desc: "Son los principales órganos de la administración. Formulan las políticas públicas en sus respectivos sectores.",
              extra: "Cada ministerio está liderado por un Ministro, acompañado de Viceministerios.",
              children: [
                { name: "Min. del Interior", category: "ejecutiva", desc: "Formula políticas de derechos humanos, participación ciudadana, asuntos étnicos y relaciones políticas con el Congreso." },
                { name: "Min. de Relaciones Exteriores (Cancillería)", category: "ejecutiva", desc: "Maneja la política exterior, diplomacia, embajadas, consulados y pasaportes." },
                { name: "Min. de Hacienda y Crédito Público", category: "ejecutiva", desc: "Define la política económica, recauda impuestos (vía DIAN) y elabora el Presupuesto General de la Nación." },
                { name: "Min. de Justicia y del Derecho", category: "ejecutiva", desc: "Formula políticas de justicia, política criminal, sistema penitenciario (INPEC) y lucha contra las drogas." },
                { name: "Min. de Defensa Nacional", category: "ejecutiva", desc: "Dirige a las Fuerzas Militares (Ejército, Armada, Fuerza Aérea) y la Policía Nacional para defender la soberanía y el orden." },
                { name: "Min. de Agricultura y Desarrollo Rural", category: "ejecutiva", desc: "Promueve el desarrollo agropecuario, pesquero y forestal, y gestiona la tierra." },
                { name: "Min. de Salud y Protección Social", category: "ejecutiva", desc: "Dirige el sistema de salud, define beneficios, prevención de enfermedades y políticas de seguridad social." },
                { name: "Min. del Trabajo", category: "ejecutiva", desc: "Fomenta el empleo, protege los derechos laborales y regula el sistema de pensiones." },
                { name: "Min. de Minas y Energía", category: "ejecutiva", desc: "Regula la explotación de recursos naturales no renovables, generación eléctrica y combustibles." },
                { name: "Min. de Comercio, Industria y Turismo", category: "ejecutiva", desc: "Apoya el desarrollo empresarial, el turismo y regula las exportaciones e importaciones." },
                { name: "Min. de Educación Nacional", category: "ejecutiva", desc: "Regula y financia la educación preescolar, básica, media y superior (convalidaciones, calidad)." },
                { name: "Min. de Ambiente y Desarrollo Sostenible", category: "ejecutiva", desc: "Máxima autoridad ambiental. Protege la biodiversidad y regula el cambio climático." },
                { name: "Min. de Vivienda, Ciudad y Territorio", category: "ejecutiva", desc: "Formula políticas de vivienda de interés social, ordenamiento territorial, agua potable y saneamiento básico." },
                { name: "Min. de TIC", category: "ejecutiva", desc: "Promueve el acceso a internet, la radiodifusión, la transformación digital y el gobierno en línea." },
                { name: "Min. de Transporte", category: "ejecutiva", desc: "Define políticas de infraestructura vial, férrea, fluvial, marítima y aérea." },
                { name: "Min. de las Culturas, las Artes y los Saberes", category: "ejecutiva", desc: "Protege el patrimonio cultural, fomenta las artes, bibliotecas y saberes ancestrales." },
                { name: "Min. del Deporte", category: "ejecutiva", desc: "Formula la política pública del deporte, recreación, actividad física y alto rendimiento." },
                { name: "Min. de Ciencia, Tecnología e Innovación", category: "ejecutiva", desc: "Financia y promueve la investigación científica y el desarrollo tecnológico del país." },
                { name: "Min. de Igualdad y Equidad", category: "ejecutiva", desc: "Creado recientemente para formular políticas contra la desigualdad, discriminación y protección a poblaciones vulnerables." }
              ]
            },
            {
              name: "Departamentos Administrativos (6)",
              category: "ejecutiva",
              desc: "Tienen la misma jerarquía que los Ministerios, pero son más técnicos y operativos, no tan políticos.",
              children: [
                { name: "DAPRE", category: "ejecutiva", desc: "Departamento Administrativo de la Presidencia. Asiste directamente al Presidente administrativamente." },
                { name: "DNP", category: "ejecutiva", desc: "Departamento Nacional de Planeación. Diseña el Plan Nacional de Desarrollo y distribuye regalías." },
                { name: "Función Pública", category: "ejecutiva", desc: "Administra el empleo público, diseña organizaciones estatales y trámites." },
                { name: "DANE", category: "ejecutiva", desc: "Departamento Administrativo Nacional de Estadística. Realiza censos y mide inflación, pobreza, desempleo." },
                { name: "DNI", category: "ejecutiva", desc: "Dirección Nacional de Inteligencia. Produce inteligencia estratégica de Estado (sin funciones policiales)." },
                { name: "Prosperidad Social (DPS)", category: "ejecutiva", desc: "Encargado de los subsidios, transferencias monetarias y superación de la pobreza." }
              ]
            }
          ]
        },
        {
          name: "Sector Descentralizado",
          category: "ejecutiva",
          desc: "Entidades creadas por la ley para cumplir funciones técnicas especializadas, con autonomía administrativa y presupuesto propio.",
          children: [
            {
              name: "Establecimientos Públicos",
              category: "ejecutiva",
              desc: "Tienen funciones puramente administrativas.",
              children: [
                { name: "SENA", category: "ejecutiva", desc: "Servicio Nacional de Aprendizaje. Brinda formación técnica y tecnológica gratuita." },
                { name: "ICBF", category: "ejecutiva", desc: "Instituto Colombiano de Bienestar Familiar. Protege a la primera infancia, niñez y adolescencia." },
                { name: "INVIAS", category: "ejecutiva", desc: "Construcción y mantenimiento de la red vial no concesionada." },
                { name: "INPEC", category: "ejecutiva", desc: "Vigila y administra las cárceles del país." }
              ]
            },
            {
              name: "Agencias Nacionales",
              category: "ejecutiva",
              desc: "Unidades administrativas especiales con personería jurídica.",
              children: [
                { name: "ANI", category: "ejecutiva", desc: "Agencia Nacional de Infraestructura. Maneja las concesiones viales (peajes, grandes autopistas)." },
                { name: "ANLA", category: "ejecutiva", desc: "Agencia Nacional de Licencias Ambientales. Otorga permisos para grandes proyectos (minería, vías)." },
                { name: "ANT", category: "ejecutiva", desc: "Agencia Nacional de Tierras. Ejecuta la reforma agraria y titulación de predios." }
              ]
            },
            {
              name: "Empresas del Estado (EICE / Mixtas)",
              category: "ejecutiva",
              desc: "Entidades que desarrollan actividades industriales o comerciales compitiendo en el mercado.",
              children: [
                { name: "Ecopetrol", category: "ejecutiva", desc: "Sociedad de Economía Mixta. Principal empresa petrolera y energética del país." },
                { name: "Banco Agrario", category: "ejecutiva", desc: "Sociedad de Economía Mixta. Banco enfocado en crédito para el sector rural." },
                { name: "Indumil", category: "ejecutiva", desc: "Industria Militar. Fabrica armas, municiones y explosivos de uso oficial y civil." },
                { name: "Imprenta Nacional", category: "ejecutiva", desc: "EICE. Imprime el Diario Oficial, leyes y gacetas." }
              ]
            }
          ]
        },
        {
          name: "Orden Territorial",
          category: "ejecutiva",
          desc: "La rama ejecutiva a nivel regional y local.",
          children: [
            {
              name: "Departamentos (32)",
              category: "ejecutiva",
              desc: "Dirigidos por el Gobernador.",
              children: [
                { name: "Gobernador", category: "ejecutiva", desc: "Máxima autoridad ejecutiva del departamento, elegido por voto popular por 4 años." },
                { name: "Asamblea Departamental", category: "ejecutiva", desc: "Aunque hacen 'control político' territorial, administrativamente emiten Ordenanzas. Conformadas por Diputados." }
              ]
            },
            {
              name: "Municipios (1.102) y Distritos (12)",
              category: "ejecutiva",
              desc: "Dirigidos por el Alcalde, nivel base de la administración del Estado.",
              children: [
                { name: "Alcalde Mayor / Municipal", category: "ejecutiva", desc: "Jefe de la administración local, elegido por 4 años. Ejecuta el presupuesto local." },
                { name: "Concejo Municipal/Distrital", category: "ejecutiva", desc: "Corporación político-administrativa que emite Acuerdos (ej. POT, impuestos locales). Conformada por Concejales." }
              ]
            }
          ]
        }
      ]
    },

    // 2. RAMA LEGISLATIVA
    {
      name: "Rama Legislativa",
      category: "legislativa",
      desc: "Encargada de formular las leyes, ejercer control político sobre el gobierno y reformar la Constitución. Está conformada por el Congreso de la República (Bicameral).",
      extra: "El hecho de tener dos cámaras (Senado y Cámara) permite un doble filtro y debate, equilibrando la representación nacional con la representación regional.",
      children: [
        {
          name: "Senado de la República",
          category: "legislativa",
          desc: "Cámara Alta. Representa a la Nación en su conjunto. Sus miembros se eligen por circunscripción nacional (todo el país vota por ellos).",
          extra: "Compuesto por 108 senadores: 100 por circunscripción nacional, 2 circunscripción indígena, 5 Partido Comunes (Acuerdo de Paz). Aprueban tratados internacionales y juzgan a altos funcionarios.",
          children: [
            {
              name: "Plenaria del Senado",
              category: "legislativa",
              desc: "Reunión de los 108 senadores donde se toman las decisiones finales de los proyectos de ley."
            },
            {
              name: "Comisiones Constitucionales (7)",
              category: "legislativa",
              desc: "Donde se da el primer debate de las leyes según el tema.",
              children: [
                { name: "Comisión I (Constitucional)", category: "legislativa", desc: "Reformas constitucionales, leyes estatutarias, derechos fundamentales, paz." },
                { name: "Comisión II (Relaciones Internacionales)", category: "legislativa", desc: "Política internacional, defensa nacional, fuerza pública, tratados, comercio exterior." },
                { name: "Comisión III (Hacienda)", category: "legislativa", desc: "Impuestos, presupuesto nacional, planeación, Banco de la República." },
                { name: "Comisión IV (Presupuesto)", category: "legislativa", desc: "Leyes orgánicas de presupuesto, control fiscal, bienes nacionales." },
                { name: "Comisión V (Agro y Ambiente)", category: "legislativa", desc: "Régimen agropecuario, ecología, minas, energía, tierras." },
                { name: "Comisión VI (Transporte y Comunicaciones)", category: "legislativa", desc: "Obras públicas, transporte, comunicaciones, educación, cultura." },
                { name: "Comisión VII (Social)", category: "legislativa", desc: "Salud, vivienda, trabajo, seguridad social, familia, deporte." }
              ]
            }
          ]
        },
        {
          name: "Cámara de Representantes",
          category: "legislativa",
          desc: "Cámara Baja. Representa a los territorios (Departamentos). Se eligen por circunscripción territorial.",
          extra: "Compuesta por 188 representantes. Antioquia elige a los suyos, Cundinamarca a los suyos, etc. También incluye curules para afros, indígenas, exterior y las CITREP (Víctimas). Su función exclusiva es elegir al Defensor del Pueblo y acusar a altos funcionarios ante el Senado.",
          children: [
            {
              name: "Plenaria de la Cámara",
              category: "legislativa",
              desc: "Reunión de los 188 representantes para votar leyes en segundo o cuarto debate."
            },
            {
              name: "Comisiones Constitucionales (7)",
              category: "legislativa",
              desc: "Mismas temáticas que el Senado, pero integradas por Representantes a la Cámara. Toda ley debe pasar por comisión y plenaria de ambas cámaras (4 debates en total)."
            },
            {
              name: "Comisión de Acusación",
              category: "legislativa",
              desc: "Comisión especial de la Cámara encargada de investigar al Presidente, Fiscal, y Magistrados de las Altas Cortes."
            }
          ]
        }
      ]
    },

    // 3. RAMA JUDICIAL
    {
      name: "Rama Judicial",
      category: "judicial",
      desc: "Encargada de administrar justicia, solucionar los conflictos entre ciudadanos y entre estos y el Estado. Decide cuestiones jurídicas con fuerza de verdad definitiva (Sentencias).",
      extra: "A diferencia de otros países, Colombia tiene múltiples 'Cortes de Cierre' dependiendo del tipo de derecho (Ordinario, Administrativo, Constitucional, Disciplinario).",
      children: [
        {
          name: "Jurisdicción Constitucional",
          category: "judicial",
          desc: "Protege la supremacía de la Constitución Política.",
          children: [
            {
              name: "Corte Constitucional",
              category: "judicial",
              desc: "Compuesta por 9 Magistrados. Revisa tutelas, decide si las leyes aprobadas por el Congreso violan o no la Constitución (Exequibilidad).",
              extra: "Es la creadora de gran parte de la protección de derechos civiles modernos en Colombia."
            }
          ]
        },
        {
          name: "Jurisdicción Ordinaria",
          category: "judicial",
          desc: "Resuelve conflictos comunes entre personas: divorcios, robos, despidos laborales, contratos civiles.",
          children: [
            {
              name: "Corte Suprema de Justicia",
              category: "judicial",
              desc: "Máximo tribunal ordinario (23 Magistrados). Juzga a congresistas, ministros y al Presidente si lo acusa la Cámara.",
              children: [
                { name: "Sala de Casación Civil y Agraria", category: "judicial", desc: "Resuelve en última instancia pleitos de contratos, propiedades, familia." },
                { name: "Sala de Casación Laboral", category: "judicial", desc: "Resuelve conflictos de trabajadores, empleadores, pensiones y sindicatos." },
                { name: "Sala de Casación Penal", category: "judicial", desc: "Última instancia en condenas penales (asesinatos, corrupción, robo)." },
                { name: "Salas Especiales (Instrucción / Primera Instancia)", category: "judicial", desc: "Creadas recientemente para garantizar doble instancia a congresistas investigados." }
              ]
            },
            { name: "Tribunales Superiores de Distrito", category: "judicial", desc: "Segunda instancia a nivel departamental/regional." },
            { name: "Juzgados de Circuito y Municipales", category: "judicial", desc: "Donde inician los juicios civiles, penales, laborales locales." }
          ]
        },
        {
          name: "Jurisdicción Contencioso Administrativa",
          category: "judicial",
          desc: "Juzga al Estado. Resuelve conflictos entre ciudadanos y entidades del gobierno, o entre entidades.",
          children: [
            {
              name: "Consejo de Estado",
              category: "judicial",
              desc: "Máximo tribunal administrativo (31 Magistrados). Puede anular decretos del Presidente si son ilegales.",
              children: [
                { name: "Sala Contencioso Administrativa (Sec 1 a 5)", category: "judicial", desc: "Juzga demandas contra el Estado, problemas de impuestos, pérdida de investidura de políticos, problemas electorales." },
                { name: "Sala de Consulta y Servicio Civil", category: "judicial", desc: "Actúa como consejero jurídico del Gobierno Nacional. Los ministros le hacen preguntas legales." }
              ]
            },
            { name: "Tribunales Administrativos", category: "judicial", desc: "Segunda instancia departamental para demandas contra alcaldías/gobernaciones." },
            { name: "Juzgados Administrativos", category: "judicial", desc: "Primera instancia de litigios contra el Estado." }
          ]
        },
        {
          name: "Jurisdicción Disciplinaria",
          category: "judicial",
          desc: "Juzga el comportamiento ético de abogados y jueces.",
          children: [
            { name: "Comisión Nacional de Disciplina Judicial", category: "judicial", desc: "Sanciona a abogados litigantes, jueces y fiscales que cometen faltas éticas." }
          ]
        },
        {
          name: "Justicia Transicional (Acuerdo de Paz)",
          category: "judicial",
          desc: "Jurisdicción temporal para investigar y juzgar delitos cometidos en el marco del conflicto armado.",
          children: [
            {
              name: "Jurisdicción Especial para la Paz (JEP)",
              category: "judicial",
              desc: "Ofrece penas restaurativas a cambio de verdad plena y reparación. Investiga a ex-FARC y agentes del Estado (Militares).",
              children: [
                { name: "Sala de Reconocimiento de Verdad", category: "judicial", desc: "Recibe los testimonios y contrastes sobre macro-casos (secuestros, falsos positivos)." },
                { name: "Tribunal para la Paz", category: "judicial", desc: "Emite las sentencias y sanciones finales a quienes aportan o no verdad." }
              ]
            }
          ]
        },
        {
          name: "Fiscalía General de la Nación",
          category: "judicial",
          desc: "Parte de la rama judicial pero autónoma administrativamente. Investiga los delitos y acusa a los presuntos infractores ante los jueces penales.",
          children: [
            { name: "Cuerpo Técnico de Investigación (CTI)", category: "judicial", desc: "Policía judicial propia de la Fiscalía, realiza allanamientos, capturas forenses, balística." }
          ]
        },
        {
          name: "Consejo Superior de la Judicatura",
          category: "judicial",
          desc: "Es el gerente de la rama judicial. Administra el presupuesto, nombra magistrados (de listas) y provee infraestructura a los juzgados."
        }
      ]
    },

    // 4. ÓRGANOS DE CONTROL
    {
      name: "Órganos de Control",
      category: "control",
      desc: "Instituciones independientes que vigilan el comportamiento de los funcionarios, el uso del presupuesto y defienden a la sociedad. NO pertenecen a ninguna de las tres ramas.",
      children: [
        {
          name: "Ministerio Público",
          category: "control",
          desc: "Guardián de los derechos humanos y la ley.",
          children: [
            {
              name: "Procuraduría General de la Nación",
              category: "control",
              desc: "Vigila la conducta de los funcionarios públicos (incluyendo electos). Puede destituir e inhabilitar a alcaldes, gobernadores o ministros por corrupción o mala gestión (Control Disciplinario)."
            },
            {
              name: "Defensoría del Pueblo",
              category: "control",
              desc: "Impulsa la efectividad de los derechos humanos. Provee abogados gratuitos (Defensoría Pública) y emite alertas tempranas de riesgo de masacres."
            },
            {
              name: "Personerías",
              category: "control",
              desc: "Agentes del Ministerio Público a nivel municipal. Reciben quejas de la ciudadanía contra alcaldes y policía local."
            }
          ]
        },
        {
          name: "Control Fiscal",
          category: "control",
          desc: "Vigilan el dinero de los impuestos.",
          children: [
            {
              name: "Contraloría General de la República",
              category: "control",
              desc: "Vigila cómo se gastan los recursos públicos. Si detecta desvíos, inicia procesos de responsabilidad fiscal para que devuelvan la plata."
            },
            {
              name: "Contralorías Territoriales",
              category: "control",
              desc: "Hacen lo mismo que la CGR pero a nivel específico en departamentos y municipios grandes."
            },
            {
              name: "Auditoría General de la República",
              category: "control",
              desc: "Es la que 'vigila a los vigilantes'. Hace control fiscal específicamente sobre las Contralorías."
            }
          ]
        }
      ]
    },

    // 5. ORGANIZACIÓN ELECTORAL
    {
      name: "Organización Electoral",
      category: "electoral",
      desc: "Conjunto de entidades encargadas de la organización de las elecciones, su dirección y vigilancia, así como lo relativo a la identidad de las personas.",
      children: [
        {
          name: "Consejo Nacional Electoral (CNE)",
          category: "electoral",
          desc: "Suprema autoridad electoral. Regula a los partidos políticos, vigila la financiación de las campañas y declara resultados oficiales.",
          extra: "Está conformado por 9 magistrados elegidos por el Congreso en proporción a los partidos políticos, lo que a menudo genera debates sobre su independencia política."
        },
        {
          name: "Registraduría Nacional del Estado Civil",
          category: "electoral",
          desc: "Encargada de identificar a los colombianos (Cédula, Tarjeta de Identidad, Registro Civil) y de la logística operativa para que las elecciones se lleven a cabo (mesas, tarjetones)."
        }
      ]
    },

    // 6. ÓRGANOS AUTÓNOMOS
    {
      name: "Órganos Autónomos e Independientes",
      category: "autonomos",
      desc: "Entidades que por su función altamente técnica requieren independencia política y presupuestal completa del Presidente o el Congreso.",
      children: [
        {
          name: "Banco de la República",
          category: "autonomos",
          desc: "Autoridad monetaria, cambiaria y crediticia. Emite la moneda (pesos), controla la inflación fijando tasas de interés y administra las reservas internacionales.",
          extra: "Su Junta Directiva tiene 7 miembros (incluyendo el Ministro de Hacienda y 5 co-directores elegidos en periodos escalonados para evitar que un solo Presidente los cambie a todos)."
        },
        {
          name: "Comisión Nacional del Servicio Civil (CNSC)",
          category: "autonomos",
          desc: "Administra y vigila las carreras de los servidores públicos (Concursos de mérito). Garantiza que a los cargos públicos se acceda por capacidad y no por 'rosca'."
        },
        {
          name: "Corporaciones Autónomas Regionales (CAR)",
          category: "autonomos",
          desc: "Máximas autoridades ambientales a nivel regional. (Son 33, ej. CAR Cundinamarca, CVC, Corantioquia). Ejecutan políticas ambientales y otorgan permisos de agua, tala, etc."
        },
        {
          name: "Entes Universitarios Autónomos",
          category: "autonomos",
          desc: "Universidades del Estado (ej. Universidad Nacional, U. de Antioquia, Univalle). Tienen autonomía para darse sus directivas, programas y presupuestos sin injerencia del gobierno central para proteger la libertad de cátedra."
        },
        {
          name: "Comisión de Regulación de Comunicaciones (CRC)",
          category: "autonomos",
          desc: "Órgano autónomo que regula el mercado de redes, telecomunicaciones y servicios postales y de televisión (reemplazó a la antigua ANTV)."
        }
      ]
    }
  ]
};

export default function EstadoColombianoTree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<StateNode>(stateData);

  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const rootRef = useRef<CustomHierarchyNode | null>(null);
  const updateTreeRef = useRef<((source: CustomHierarchyNode) => void) | null>(null);

  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomRef.current || !containerRef.current) return;
    const height = containerRef.current.clientHeight || 600;
    d3.select(svgRef.current).transition().duration(750).call(
      zoomRef.current.transform,
      d3.zoomIdentity.translate(150, height / 2).scale(0.8)
    );
  }, []);

  const expandAll = useCallback(() => {
    if (!rootRef.current || !updateTreeRef.current) return;
    
    function expandNode(d: CustomHierarchyNode) {
      if (d._children) {
        d.children = d._children;
        d._children = undefined;
      }
      if (d.children) {
        (d.children as CustomHierarchyNode[]).forEach(expandNode);
      }
    }
    
    expandNode(rootRef.current);
    updateTreeRef.current(rootRef.current);
  }, []);

  const collapseAll = useCallback(() => {
    if (!rootRef.current || !updateTreeRef.current) return;

    function collapseNode(d: CustomHierarchyNode) {
      if (d.children) {
        d._children = d.children as CustomHierarchyNode[];
        d._children.forEach(collapseNode);
        d.children = undefined;
      }
    }

    if (rootRef.current.children) {
      (rootRef.current.children as CustomHierarchyNode[]).forEach(collapseNode);
    }
    updateTreeRef.current(rootRef.current);
    resetZoom();
  }, [resetZoom]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%');

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    const tree = d3.tree<StateNode>().nodeSize([45, 300]);
    const root: CustomHierarchyNode = d3.hierarchy(stateData);
    root.x0 = height / 2;
    root.y0 = 0;
    rootRef.current = root;

    let nodeIndex = 0;

    const colorScale: Record<string, string> = {
      root: "#f8fafc",
      ejecutiva: "#3b82f6",
      legislativa: "#ef4444",
      judicial: "#10b981",
      control: "#a855f7",
      electoral: "#f59e0b",
      autonomos: "#06b6d4"
    };

    function collapse(d: CustomHierarchyNode) {
      if (d.children) {
        d._children = d.children as CustomHierarchyNode[];
        d._children.forEach(collapse);
        d.children = undefined;
      }
    }

    if (root.children) {
      (root.children as CustomHierarchyNode[]).forEach(collapse);
    }

    function update(source: CustomHierarchyNode) {
      const treeData = tree(root);
      const nodes: CustomHierarchyNode[] = treeData.descendants();
      const links = treeData.descendants().slice(1);

      nodes.forEach((d) => {
        d.y = d.depth * 320;
      });

      // Nodes
      const node = g.selectAll<SVGGElement, CustomHierarchyNode>('g.node')
        .data(nodes, (d) => d.id || (d.id = `node-${++nodeIndex}`));

      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', () => `translate(${source.y0 || 0},${source.x0 || 0})`)
        .on('click', (event, d) => {
          if (d.children) {
            d._children = d.children as CustomHierarchyNode[];
            d.children = undefined;
          } else {
            d.children = d._children;
            d._children = undefined;
          }
          update(d);
          setSelectedNode(d.data);

          if (d.children && d.x !== undefined && d.y !== undefined) {
            svg.transition().duration(750).call(
              zoom.transform,
              d3.zoomIdentity.translate(width / 2 - d.y - 100, height / 2 - d.x).scale(1)
            );
          }
        })
        .style('cursor', 'pointer');

      nodeEnter.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 1e-6)
        .style('fill', (d) => d._children ? (colorScale[d.data.category] || "#3b82f6") : "#1e293b")
        .style('stroke', (d) => colorScale[d.data.category] || "#3b82f6")
        .style('stroke-width', '3px');

      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => d.children || d._children ? -15 : 15)
        .attr('text-anchor', (d) => d.children || d._children ? 'end' : 'start')
        .text((d) => d.data.name)
        .style('fill', '#e2e8f0')
        .style('font-size', '13px')
        .style('font-family', 'Inter, sans-serif')
        .style('fill-opacity', 1e-6);

      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate.transition()
        .duration(400)
        .attr('transform', (d) => `translate(${d.y || 0},${d.x || 0})`);

      nodeUpdate.select<SVGCircleElement>('circle.node-circle')
        .attr('r', 8)
        .style('fill', (d) => d._children ? (colorScale[d.data.category] || "#3b82f6") : "#1e293b")
        .style('stroke', (d) => colorScale[d.data.category] || "#3b82f6");

      nodeUpdate.select<SVGTextElement>('text')
        .style('fill-opacity', 1)
        .style('font-weight', (d) => d.depth <= 1 ? '700' : '400');

      const nodeExit = node.exit<CustomHierarchyNode>().transition()
        .duration(400)
        .attr('transform', () => `translate(${source.y || 0},${source.x || 0})`)
        .remove();

      nodeExit.select('circle').attr('r', 1e-6);
      nodeExit.select('text').style('fill-opacity', 1e-6);

      // Links
      const link = g.selectAll<SVGPathElement, CustomHierarchyNode>('path.link')
        .data(links, (d) => d.id || '');

      const diagonal = d3.linkHorizontal<{ x: number; y: number }, { x: number; y: number }>()
        .x((d) => d.y)
        .y((d) => d.x);

      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#475569')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.6)
        .attr('d', () => {
          const o = { x: source.x0 || 0, y: source.y0 || 0 };
          return diagonal({ source: o, target: o });
        });

      const linkUpdate = linkEnter.merge(link);
      linkUpdate.transition()
        .duration(400)
        .attr('d', (d) => {
          const p = d.parent as CustomHierarchyNode;
          const s = { x: p?.x || 0, y: p?.y || 0 };
          const t = { x: d.x || 0, y: d.y || 0 };
          return diagonal({ source: s, target: t });
        });

      link.exit().transition()
        .duration(400)
        .attr('d', () => {
          const o = { x: source.x || 0, y: source.y || 0 };
          return diagonal({ source: o, target: o });
        })
        .remove();

      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    updateTreeRef.current = update;
    update(root);

    setTimeout(() => {
      resetZoom();
    }, 100);

  }, [resetZoom]);

  return (
    <div className="w-full flex flex-col lg:flex-row bg-[#0f172a] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl min-h-[650px] relative">
      {/* Visualizer Container */}
      <div ref={containerRef} className="flex-1 relative min-h-[550px] cursor-grab active:cursor-grabbing">
        {/* Interactive Controls Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          <button
            onClick={expandAll}
            className="bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 shadow-md transition-all active:scale-95"
          >
            Expandir Todo
          </button>
          <button
            onClick={collapseAll}
            className="bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 shadow-md transition-all active:scale-95"
          >
            Contraer Todo
          </button>
          <button
            onClick={resetZoom}
            className="bg-[#1a2a44] hover:bg-yellow-500 hover:text-slate-950 text-yellow-400 text-xs font-bold px-3 py-2 rounded-xl border border-yellow-500/30 shadow-md transition-all active:scale-95"
          >
            Centrar Mapa
          </button>
        </div>

        <svg ref={svgRef} className="w-full h-full min-h-[550px]" />
      </div>

      {/* Details Panel Sidebar */}
      <div className="w-full lg:w-96 bg-[#1e293b] p-8 border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 rounded-full bg-slate-700 text-slate-300 inline-block">
              {selectedNode.category || 'Selecciona un nodo'}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">{selectedNode.name}</h2>
          <div className="w-16 h-1 bg-blue-500 mb-6" />

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Descripción General</h3>
              <p className="text-slate-200 text-sm leading-relaxed">
                {selectedNode.desc}
              </p>
            </div>

            {selectedNode.extra && (
              <div className="mt-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Datos Clave</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedNode.extra}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/60">
          <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">
            Estructura del Estado Colombiano • Constitución de 1991
          </p>
        </div>
      </div>
    </div>
  );
}
