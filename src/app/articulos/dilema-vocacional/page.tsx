import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Bitácora de Decisión: El Dilema Vocacional | Mapzy',
  description: 'El conflicto entre la expectativa, el costo y la dispersión vocacional. Análisis estratégico de alternativas.',
};

export default function DilemaVocacionalPage() {
  return (
    <div className="bg-[#fdfdfc] text-gray-900 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 mb-6">
        <Link
          href="/articulos"
          className="inline-flex items-center gap-2 text-sm font-sans font-bold text-slate-500 hover:text-[#1a2a44] transition-colors"
        >
          <ArrowLeft size={16} /> Volver a Artículos
        </Link>
      </div>

      <header className="max-w-3xl mx-auto px-6 pt-6 pb-8 border-b border-gray-200">
        <div className="mb-4">
          <span className="text-xs font-sans font-bold text-gray-500 uppercase tracking-widest border-b border-gray-900 pb-1">
            Bitácora Personal &amp; Análisis Crítico
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6 text-gray-900">
          El conflicto entre la expectativa, el costo y la dispersión vocacional
        </h1>
        <div className="flex items-center text-sm font-sans text-gray-600">
          <div className="uppercase tracking-wider">
            <strong>Registro de situación</strong> <span className="mx-2">|</span> Análisis estratégico de alternativas
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <article className="font-serif text-gray-800 text-lg leading-relaxed space-y-6">
          <p className="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-gray-900">
            Tuve una conversación larga con mi sobrina sobre su universidad. El domingo va a presentar su ICFES. Estábamos detallando algunos truquitos para la presentación del examen, como llevar el tiempo en un reloj para dedicarle el mismo tiempo a cada pregunta, tomar agua, respirar, buscar calma, aprovechar las salidas al baño para estirar las piernas. Truquitos así: afrontar primero las preguntas de las que tenga más certeza en temas donde sienta más seguridad, y dejar las difíciles para lo último para que no tenga tanto estrés con el manejo del tiempo.
          </p>

          <p>
            Pero luego empezamos a hablar sobre la universidad, y su decisión prácticamente es descartar las universidades privadas por un conflicto familiar al cual no quiere someterse. Es, en sí, perder esas oportunidades o cerrarse a esas universidades por el costo monetario que involucra que los padres se hagan cargo de una transacción larga para tener que pagar esas instituciones tan costosas. La cosa es que, posiblemente, los padres podrían hacerlo, pero la realidad es que sería con mucho esfuerzo. Entonces, no quiere ponerse en la tarea de depender exclusivamente de sus padres para tener una carrera universitaria en paz.
          </p>

          <p>
            Yo pienso que, dado el contexto de la carrera, irse por una universidad pública en Colombia —donde hay tantos abogados— es un error garrafal. Tras el hecho, está esperando el ICFES y tener el resultado en mano para terminar de decidir su postura, porque duda entre estudiar Derecho, Negocios Internacionales, Optometría y hacer un técnico en maquillaje o cosmetología. Yo no tengo ni idea de qué es cosmetología, y me parece a mí que tiene un gran potencial como abogada.
          </p>

          <p>
            Puede estar cerrándose a las universidades donde podría estar mejor posicionada, que son las de negocios, por iniciativa propia (es decir, porque definitivamente no quiere). Y la realidad es que, si accediera a universidades como La Sabana o el Rosario —pienso que tal me parece que La Sabana o la Javeriana serían las mejores—, es muy complicado mantener el flujo de dinero todo el tiempo sin tener que entrar en deudas.
          </p>

          <p>
            Entonces, habría que evaluar hacerle un árbol de ideas diferente en el que contemple todas esas variables y dé una opción más acorde. Tiene en su mente usar la Universidad de Caldas, la de Manizales, la UPTC o la Universidad Distrital, y me parece que ninguna de esas está enfocada en Derecho y Negocios. Habría que buscar primero una universidad privada o una universidad pública a bajo costo que esté enfocada en negocios y que tenga las conexiones fuertes para hacer emprendimientos. E idear un camino en el que pueda usar su interés en cosmetología para articular un negocio desde una muy temprana etapa en su carrera, ya sea que se vaya por Derecho, por Negocios o por lo que sea.
          </p>

          <div className="text-center my-12 text-2xl tracking-[0.5em] text-gray-400 font-sans">***</div>

          <h2 className="font-sans font-bold text-2xl uppercase tracking-wider text-black mt-12 mb-4">
            Desmontaje Estratégico: Diagnóstico y Rutas de Acción
          </h2>

          <div className="p-5 bg-gray-50 border-l-4 border-gray-900 font-sans text-base text-gray-700 italic my-8 leading-relaxed">
            El objetivo central a partir de esta bitácora es diseñar una arquitectura de decisión que resuelva la contradicción operativa entre la aversión al endeudamiento de la estudiante, la fragmentación extrema de sus intereses vocacionales y la necesidad ineludible de capital relacional para escalar en el mercado colombiano.
          </div>

          <h3 className="font-serif font-bold text-xl text-gray-900 mt-8 mb-3">
            El Ángulo Obvio: La vía de la contención
          </h3>
          <p>
            El enfoque convencional ante este escenario es la contención del daño. Implica esperar los resultados del ICFES para que la métrica elimine opciones por simple descarte aritmético. Bajo esta lógica, la ruta dicta matricularse en una universidad pública sólida para neutralizar el conflicto familiar por dinero. Simultáneamente, tomar un técnico en el SENA en cosmetología los fines de semana para saciar ese interés vocacional paralelo y operar un pequeño negocio informal que permita cubrir sus gastos diarios de subsistencia. Es un camino seguro, pero predecible.
          </p>

          <h3 className="font-serif font-bold text-xl text-gray-900 mt-8 mb-3">
            El Ángulo Inverso: La cosmetología como motor financiero, no como hobby
          </h3>
          <p>
            Para romper el estancamiento, es imperativo invertir el orden lógico de las operaciones. No se trata de estudiar Derecho o Negocios para luego &quot;emprender en cosmetología&quot;. La maniobra inversa dicta que debe certificarse como cosmetóloga inmediatamente (mediante cursos intensivos de seis meses) y comenzar a generar flujo de caja de inmediato. En la industria de la belleza en Colombia, los márgenes son altos.
          </p>
          <p>
            El objetivo es usar los ingresos de este negocio base para financiarse ella misma la universidad privada de élite (La Sabana, Javeriana) en horario nocturno o semipresencial. Al hacerlo, entra al ecosistema de élite corporativa sin depender del dinero de sus padres, eliminando de raíz el conflicto familiar y el estrés de la deuda que actualmente la paraliza.
          </p>
          <p>
            Además, existe una ruta de arbitraje geográfico. Si su firme convicción es estudiar en opciones públicas regionales de bajo costo (como Caldas o la UPTC), debe hiper-especializarse desde el semestre uno en el marco legal o comercial de la cosmetología. Que use la educación pública gratuita para volverse la máxima experta en registros INVIMA, propiedad intelectual de marcas de belleza o importación de insumos estéticos. El networking corporativo de Bogotá se vuelve irrelevante si logras convertirte en la única abogada o negociadora en Colombia que domina el nicho regulatorio para cientos de emprendedores del sector cosmético.
          </p>

          <h3 className="font-serif font-bold text-xl text-gray-900 mt-8 mb-3">
            Puntos de Fricción: Errores en la premisa inicial
          </h3>
          <p>
            El primer punto de fricción recae en el diagnóstico del adulto: la insistencia en el ecosistema corporativo es un error estratégico. Se asume que el éxito requiere obligatoriamente las conexiones de universidades costosas. Tu sobrina tiene 16 años, rechaza activamente el conflicto financiero y tiene inclinaciones hacia oficios estéticos. Forzarla hacia universidades de élite tradicional es empujarla a un ecosistema de presión socioeconómica donde se sentirá en desventaja, resentida y con una deuda psicológica hacia su familia. Si ella rechaza el juego del capital corporativo antes de empezar, forzar el entorno es garantizar su deserción académica.
          </p>
          <p>
            El segundo punto de fricción es la dispersión. Contemplar simultáneamente Derecho, Negocios Internacionales, Optometría y Cosmetología revela una falta absoluta de tesis sobre su propio futuro, no un exceso de talento. Son disciplinas diametralmente opuestas en metodología, mercado y estilo de vida. Mezclarlas es una receta garantizada para la mediocridad. No necesita que le construyan un árbol complejo de decisiones universitarias; necesita un ultimátum de enfoque para dejar de disparar al aire.
          </p>

          <h3 className="font-serif font-bold text-xl text-gray-900 mt-8 mb-3">
            El Punto Ciego: La falacia de la empleabilidad pasiva
          </h3>
          <p>
            El verdadero riesgo de este panorama no es la elección de una universidad pública frente a una privada. El punto ciego crítico es <strong className="font-bold text-black">la ilusión de la empleabilidad pasiva</strong>.
          </p>
          <p>
            Existe la falsa creencia de que entrar a una universidad con &quot;conexiones fuertes en negocios&quot; resolverá mágicamente su futuro. En la economía actual, las instituciones tradicionales están perdiendo el monopolio del networking. Si tu sobrina es capaz de articular un negocio de cosmetología hoy, documentarlo, escalar sus ventas y gestionar proveedores reales, obtendrá más conexiones de negocios tangibles en el mercado abierto que sentada pasivamente en un aula escuchando teoría administrativa.
          </p>
          <p>
            El debate actual se está perdiendo en el cascarón (qué universidad elegir) y el costo (quién lo paga), ignorando por completo el motor de la ecuación: <strong className="font-bold text-black">la ejecución temprana</strong>. El vehículo real para su desarrollo no es el aula; el vehículo es registrar una empresa real el próximo mes, intentar vender, cometer errores legales y contables en la práctica, y utilizar la universidad (sea cual sea y cueste lo que cueste) únicamente como una biblioteca gratuita para resolver los problemas de su negocio en tiempo real.
          </p>
        </article>
      </main>

      <footer className="border-t border-gray-200 mt-12 py-10 bg-gray-50 text-center">
        <p className="text-sm font-sans text-gray-500 uppercase tracking-widest">Fin del documento</p>
      </footer>
    </div>
  );
}
