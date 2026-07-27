# 🗺️ MAPZY S.A.S. — Guía de Arquitectura, Contenido y Desarrollo (Anti-Drift Manual)

Esta guía sirve como **manual técnico, sistema de diseño y matriz de prompts estrictos anti-desviación (*anti-drift*)** para desarrolladores, redactores y asistentes de Inteligencia Artificial que trabajen en el ecosistema **Mapzy** (`mapzy.com.co`).

---

## 1. 🏗️ Arquitectura Técnica y Stack Tecnológico

La plataforma unificada de Mapzy opera sobre las siguientes especificaciones:

- **Framework Core**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS.
- **CMS de Contenidos**: Sanity.io (Project ID: `bekkfxya`, Dataset: `production`, Schema: `post`, `author`, `category`).
- **Sistema de Contacto & Infraestructura**:
  - **Email Engine**: Resend API (despacha correos HTML ejecutivos a `contacto@mapzy.com.co` y `srfajardos@gmail.com`).
  - **GIS Cloud Storage**: Google Drive API (sube automáticamente `.KMZ`, `.SHP`, `.DWG`, `.DXF` a la carpeta `1-99UYE-9h0tutEHeCjK1ojiaOAnB9AAa`).
  - **Anti-Bot Shield**: Cloudflare Turnstile Captcha (modo `Managed` para `mapzy.com.co` y `www.mapzy.com.co`).
- **Hosting & DNS**: Vercel + Namecheap.

---

## 2. 🎨 Sistema de Diseño Estricto (Tokens Visuales Mapzy)

Para evitar desviaciones de diseño (*design drift*), **todos** los desarrolladores y generadores de IA deben utilizar únicamente la siguiente paleta de tokens:

| Token | Código HEX / Clase | Uso Exclusivo |
| :--- | :--- | :--- |
| **Azul Oscuro Mapzy** | `#1a2a44` | Fondos de navegación, encabezados principales, botones primarios. |
| **Amarillo Acento Mapzy** | `#facc15` / `yellow-400` | Botones de llamados a la acción (CTA), bordes de citas, indicadores. |
| **Fondo Oscuro App** | `#020617` / `slate-950` | Modales, herramientas interactivas, dashboards. |
| **Fondo Lectura Blog** | `#ffffff` / `bg-white` | Páginas de artículos de blog e informes técnicos. |
| **Texto Principal** | `#1e293b` / `slate-800` | Párrafos de lectura y contenido extenso. |
| **Bordes Industriales** | `border-slate-800` | Separadores de herramientas y formularios. |

---

## 3. ✍️ PROMPT A: Generador de Artículos de Blog (Anti-Drift Editorial)

*Utiliza este prompt cuando le pidas a una IA (ChatGPT, Gemini, Claude) que redacte un nuevo artículo para publicar en Sanity Studio o en el Blog de Mapzy. Este prompt previene la desviación de tono, evita términos inventados y garantiza el formato Medium exacto.*

```text
ROL Y CONTEXTO:
Actúa como un Especialista en Geociencias, Sistemas de Información Geográfica (SIG) y Ordenamiento Territorial en Colombia, redactando para la firma consultora Mapzy (https://mapzy.com.co).

OBJETIVO:
Redactar un artículo de blog técnico, preciso y divulgativo sobre el siguiente tema:
[INSERTAR TEMA AQUÍ, Ej: "Impacto del Esquema de Ordenamiento Territorial (EOT) en la Minería de Materiales de Construcción"]

REGLAS STRICTAS ANTI-DESVIACIÓN (ANTI-DRIFT):

1. VOCABULARIO TÉCNICO Y MARCO LEGAL COLOMBIANO:
   - Utilizar únicamente terminología oficial colombiana: POT (Plan de Ordenamiento Territorial), EOT (Esquema de Ordenamiento), PBOT, ANLA, ANM (Agencia Nacional de Minería), SGR (Sistema General de Regalías), CTM12, IGAC, Caracterización de Cuencas (POMCA), Licenciamiento Ambiental.
   - PROHIBIDO inventar leyes, decretos ficticios o usar terminología genérica de otros países.

2. ESTRUCTURA Y ESTÉTICA MEDIUM:
   - TÍTULO: Entre 6 y 12 palabras. Debe ser atractivo, profesional e incluir la palabra clave técnica principal.
   - COPETE/RESUMEN: Exactamente un párrafo de 2 a 3 oraciones en cursiva (este resumen se renderizará con el borde lateral amarillo distintivo de Mapzy).
   - SUBTÍTULOS (H2 y H3): Usar encabezados claros sin numeración informal. Minimo 3 subtítulos H2.
   - PÁRRAFOS: Máximo 4 a 5 líneas por párrafo para garantizar legibilidad fluida.
   - CITA DESTACADA (BLOCKQUOTE): Incluir exactamente una cita relevante citando una cifra, artículo de ley o hallazgo geológico crítico.

3. CIERRE OBLIGATORIO:
   - El último apartado del artículo DEBE llevar el siguiente texto literal de cierre metodológico:
     "Metodología e Inteligencia Territorial Mapzy: En Mapzy combinamos análisis de sensores remotos, cartografía geoespacial y normatividad técnica ambiental para garantizar viabilidad y continuidad en cada proyecto territorial en Colombia."

4. FORMATO DE SALIDA:
   - Entrega exclusivamente el contenido en formato Markdown estructurado limpio (compatible con PortableText de Sanity Studio).
```

---

## 4. 💻 PROMPT B: Desarrollo de Componentes Frontend (Anti-Drift de Código)

*Utiliza este prompt cuando vayas a programar una nueva sección, herramienta o formulario nativo dentro de Next.js para Mapzy.*

```text
ROL Y CONTEXTO:
Actúa como un Ingeniero Frontend Senior especializado en Next.js 14 (App Router), TypeScript estricto y Tailwind CSS. Vas a desarrollar un nuevo componente para la plataforma unificada Mapzy (https://mapzy.com.co).

REQUERIMIENTO:
[INSERTAR REQUERIMIENTO AQUÍ, Ej: "Componente de Calculadora de Tarifas de Consultoría SIG"]

REGLAS STRICTAS ANTI-DESVIACIÓN DE CÓDIGO:

1. STACK Y COMPATIBILIDAD:
   - Usar Next.js 14 App Router con la directiva 'use client' en la parte superior si maneja estado local (React hooks).
   - Usar lucide-react para la iconografía y framer-motion para micro-animaciones.
   - PROHIBIDO importar librerías CSS externas que no sean Tailwind CSS.
   - PROHIBIDO usar la etiqueta <img> directamente de HTML si se puede optimizar, o usar 'next/image'.

2. SISTEMA DE DISEÑO MAPZY:
   - Color de acento primario: Azul Oscuro (#1a2a44) y Amarillo (#facc15 / yellow-400).
   - Tarjetas y contenedores: rounded-3xl, border border-slate-800, bg-slate-950 (si es herramienta oscura) o bg-white (si es lectura).
   - Botones primarios: bg-yellow-400 text-[#1a2a44] font-bold hover:bg-yellow-300 transition-all rounded-xl.

3. TIPADO Y CALIDAD (ESLINT ZERO ERRORS):
   - TypeScript estricto. Cero tipos 'any' explícitos. Definir interfaces para todas las props e inputs.
   - PROHIBIDO dejar variables o parámetros declarados sin usar (evitar errores 'no-unused-vars' en 'next build').
   - Manejar siempre estados de carga (loading), error y éxito (success) en componentes interactivos.

4. RESPONSIVIDAD Y ACCESIBILIDAD:
   - Diseño Mobile-First funcional en pantallas de 320px hasta 4K.
   - Incluir atributación aria y IDs únicos para pruebas de navegación.
```

---

## 5. 🕹️ PROMPT C: Integración de Herramientas Complejas / WebGL (Estrategia Mapzy Genesis)

*Utiliza este prompt cuando tengas una aplicación web interactiva compleja construida en otro entorno (Vite, WebGL, Three.js, Canvas pesado) que necesites vincular a Mapzy.*

```text
ROL Y ARQUITECTURA:
Actúa como un Arquitecto de Software Web. Necesitamos vincular una herramienta web compleja basada en Canvas/Vite (como Mapzy Genesis) con la plataforma principal Next.js de Mapzy (https://mapzy.com.co).

REGLA DE ORO DE INTEGRACIÓN (ESTRATEGIA MAPZY GENESIS):
Para prevenir problemas de rendimiento, cortes de dimensiones y distorsión de interfaz en dispositivos móviles:
1. NO incrustar la herramienta en iFrames apretados dentro del layout principal.
2. Desplegar la herramienta interactiva en su propio dominio/subdominio independiente en Vercel (ej. https://mapzy-genesis.vercel.app).
3. En la web principal de Mapzy, construir una página de aterrizaje (Landing) bajo la ruta /herramientas/[nombre-herramienta] que contenga:
   - Título y descripción ejecutiva del alcance técnico de la herramienta.
   - Lista de características principales con iconos Lucide.
   - Botón CTA prominente con redirección directa al enlace externo de la app independiente.
```
