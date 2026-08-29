# Consola de Caza Mapzy - Especificación para Implementación

## Resumen Ejecutivo

La **Consola de Caza Mapzy** es una herramienta operativa de prospección B2B para equipos de ventas. No requiere programación previa para usarla; el radar consulta datos públicos reales del Estado colombiano (SECOP II), el calificador de 5 minutos es puro criterio, y el resto es destino.

**Referencia visual completa**: `/docs/CONSOLA_CAZA_REFERENCIA.html` (prototipo HTML standalone)

## Propósito en Mapzy

Automatizar las primeras 3 fases del embudo de prospección:
1. **Radar**: Encontrar prospectos cualificados en fuentes públicas (SECOP II, ANM, CORTOLIMA, RUES)
2. **Calificador**: Decidir en 5 minutos si vale la pena el primer contacto
3. **Cuña**: Generar mensaje de primer contacto sin vender, solo nombrando el hallazgo

## Doctrina de Caza (5 Reglas)

Estas reglas determinan si un prospecto entra o se descarta:

| Regla | Criterio | Castigo |
|-------|----------|---------|
| **Sin gatillo, no hay prospecto** | Todo debe tener fuente verificable con fecha (SECOP, ANM, CAR, PDF público) | No entra a la hoja |
| **El reloj es el argumento** | Debe haber fecha límite (término legal, cierre de pliego, auditoría) | Se descarta sin reloj |
| **Nunca se menciona portafolio** | Primer mensaje nombra hallazgo + riesgo, pide 15 min, no adjunta PDF | Reduce tasa de respuesta |
| **Cero derechos de petición** | Usar solo datos públicos; se audita en silencio | Genera rechazo defensivo |
| **Ni influencers ni emprendedores** | Solo B2B de alto ticket; mercado fácil consume horas sin margen | Vacía la semana |

## Las 3 Verticales de Prospección

### V1: Cazador Institucional ($18,5M – $120M)
- **Target**: Alcaldías, gobernaciones, ANM, corporaciones autónomas
- **Gatillo**: Documento obligatorio vencido (PMGRD sin actualizar, EMRE inexistente, auto ANM con término, requerimiento CAR)
- **Dónde buscar**: SECOP II, notificaciones ANM, resoluciones CORTOLIMA, PDFs municipales
- **Decisor**: Secretaría de Planeación, Gobierno, gestión del riesgo
- **Mapzy resuelve**: PMGRD, EMRE, PARI, PTO, planes de manejo ambiental

### V2: Cazador Territorial ($2,5M – $32M)
- **Target**: Agroindustria, constructoras, obra vial, mineros de arrastre
- **Gatillo**: Proyecto en marcha que necesita terreno medido (expansión agrícola, licencia construcción, obra vial, título minero con cubicación)
- **Dónde buscar**: SECOP II (obra), Cámara de Comercio (nuevas matrículas), Facebook grupos, voz a voz
- **Decisor**: Gerente de proyecto, director de obra, propietario
- **Mapzy resuelve**: Fotogrametría + MDT, planos CTM12, cubicación ANM, **componente biótico + topográfico en mismo vuelo**

### V3: Cazador Corporativo ($8M – $30M)
- **Target**: Empresas obligadas a certificar ISO 14001
- **Gatillo**: Auditoría de recertificación cerca, cambio de operación sin actualizar matriz de aspectos/impactos, requerimiento ambiental abierto en empresa con sello 14001
- **Dónde buscar**: Cruce: sello ISO 14001 en web + sanción CAR, ofertas de empleo "coordinador HSEQ", proveedores de multinacionales
- **Decisor**: Jefe HSEQ, gerente operaciones
- **Mapzy resuelve**: Diagnóstico brecha 14001, matriz aspectos/impactos, matriz requisitos legales, plan manejo ambiental empresarial

## Componentes de la Consola

### 1. Radar (Búsqueda de Oportunidades)
Herramienta de consulta sobre SECOP II (datos públicos, dataset p6dx-8zbt de datos.gov.co)
- **Campos**: Territorio (Tolima, Huila, etc.), palabra clave del gatillo (PMGRD, topográfico, etc.), número de filas
- **Salida**: CSV descargable con procesos que coinciden
- **Fuentes fijas** (revisar cada lunes):
  1. Notificaciones ANM: https://www.anm.gov.co/notificaciones-anm
  2. Resoluciones CORTOLIMA: https://extranet.cortolima.gov.co/resoluciones
  3. Búsqueda SECOP II: https://www.colombiacompra.gov.co/secop/secop-ii
  4. RUES: https://www.rues.org.co
- **Dorks de Google**: Comandos site: + filetype: para encontrar documentos vencidos en webs municipales

### 2. Calificador (5 Preguntas)
Sistema de puntuación para decidir si escribir o descartar en 5 minutos

| Pregunta | Peso | Criterio |
|----------|------|----------|
| ¿Hay gatillo con fuente y fecha? | 3 pts | Documento, acto administrativo, proceso publicado. No impresión. |
| ¿Hay reloj corriendo? | 3 pts | Término legal, cierre pliego, auditoría, rendición cuentas. |
| ¿Nombre del decisor? | 2 pts | Persona concreta con nombre y cargo, no correo genérico. |
| ¿Mapzy resuelve exactamente eso? | 1 pto | Sin subcontratar, sin aprender nuevo, sin improvisar. |
| ¿Ticket > $5M? | 1 pto | Por debajo, costo de reunión se come margen. |

**Veredictos**:
- **≥ 8 pts**: ▲ CAZA — Escribir hoy. Entra a hoja de caza + mensaje en 24h.
- **5-7 pts**: ◆ VIGILAR — No escribir todavía. Falta reloj o decisor; conseguir antes de gastar primer contacto.
- **< 5 pts**: ✕ DESCARTAR — No entra a hoja. Descartar en 5 min es el trabajo bien hecho.

### 3. Mensaje de Cuña (Plantillas Automáticas)
Genera primer mensaje sin vender. Hay 4 variantes según vertical:

**V1 Plan vencido**: "Viendo documentos públicos de [entidad] noté que [hallazgo]. No escribo para vender; escribo porque cuando llega auditoría eso es lo primero que miran. ¿15 minutos esta semana?"

**V1 Requerimiento ANM**: "Vi que sobre título de [entidad] hay acto donde [hallazgo], término corriendo [fecha]. Trabajo en subsanaciones PTO y conceptos técnicos ANM. Riesgo no es contenido, es término. ¿15 minutos para revisar si alcanza?"

**V2 Proceso SECOP**: "Vi proceso de [entidad] donde [hallazgo], cierre [fecha]. Somos dos: geólogo + biólogo dron. Cubrimos topográfico + biótico en mismo vuelo (donde contratos se parten en dos). ¿Quién ve técnica? Me interesa entender alcance."

**V3 ISO 14001**: "[Entidad] aparece con [hallazgo]. Pregunta puntual: ¿quién sostiene hoy sistema de gestión ambiental? Casi todos hallazgos 14001 salen de matriz de aspectos sin actualizar. ¿2 días para revisión de 1 página, sin costo?"

### 4. Hoja de Caza (Registro)
Una sola hoja compartida (Google Sheets, Excel) sin CRM ni base de datos. Columnas:

- **Fecha registro**: Cuándo entra
- **Cazador**: Quién prospectó
- **Vertical**: V1/V2/V3
- **Entidad o empresa**: Nombre del cliente
- **NIT**: Número de identificación
- **Municipio**: Dónde está
- **Decisor (nombre)**: Quién toma decisión
- **Cargo**: Su título
- **Contacto**: Teléfono o correo
- **Gatillo**: El hecho verificable
- **Fuente**: Enlace exacto
- **Fecha del gatillo**: Cuándo se emitió
- **Reloj**: Fecha límite del cliente
- **Puntaje**: 0-10 del calificador
- **Veredicto**: CAZA/VIGILAR/DESCARTAR
- **Servicio Mapzy**: Qué le vende (PMGRD, fotogrametría, etc.)
- **Ticket estimado**: Rango en pesos
- **Estado**: Cuña enviada, llamada hecha, propuesta armada, etc.
- **Próximo paso**: Qué sigue
- **Fecha próximo paso**: Cuándo ejecutar

**Criterio**: El día que esta hoja no dé abasto porque hay demasiadas reuniones agendadas, ENTONCES se construye software. No antes.

### 5. Embudo del Piloto (Semana 1)
Contrato de resultados para validar el sistema:

- **30 entidades tamizadas** (días 1–3): Aplicar radar + doctrina
- **10 califican** (≥ 7 puntos, día 4): Descartar rápido es el trabajo
- **5 cuñas enviadas** (día 5): Primer contacto
- **2 conversaciones agendadas** (días 6–7): Reuniones
- **1 propuesta armada a mano** (día 7): Documento personalizado

"El día que esa propuesta se arme en 1 hora en lugar de 4, ahí tiene sentido automatizarla. Automatizar antes es fabricar el medidor de agua de un acueducto seco."

## Distribución de Roles

| Rol | Persona | Vertical | Tarea |
|-----|---------|----------|-------|
| **Cierre** | Sergio Fajardo | V1 | No prospecta. Entra cuando hay reunión. Define 3 gatillos lunes. Revisa hoja viernes. |
| **Técnico** | Javier Santiago Fajardo | V2 | Diferencial biótico + topográfico. Credibilidad por páramos/humedales. |
| **Radar** | Danna María Motta | V1, V3 | Leer resoluciones CORTOLIMA, ANM, matrices 14001. Sabe normativa ambiental. |

## Implementación en React/Next.js

### Fase 1 Requerimientos
1. **Componente Radar**: Selector territorio + input palabra clave → llamada API SECOP II → download CSV
2. **Componente Calificador**: 5 preguntas radio buttons → cálculo automático → card de veredicto con color
3. **Componente Cuña**: 4 dropdowns (vertical, nombre, entidad, hallazgo, fecha) → textarea con plantilla → botón copiar
4. **Tabla Hoja de Caza**: Grid de columnas, UI para agregar/editar prospectos
5. **Embudo Visual**: Barras de progreso con números del piloto

### Stack & Librerías
- **Next.js 14**: Framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Estilos (oscuro, tokens: --void #020617, --yellow #facc15)
- **Supabase**: Persistencia de hoja de caza (si se quiere sync)
- **D3 / Recharts**: Gráficos del embudo (opcional fase 1)

### Datos Públicos
- **SECOP II API**: https://www.datos.gov.co/resource/p6dx-8zbt.json
- **Parámetros**: `$limit`, `$select`, `$where` (departamento), `$q` (búsqueda de texto)
- **Auth**: API abierta, sin credenciales requeridas

## Notas de Diseño
- Paleta oscura: fondo #020617, paneles #0b1526, amarillo de acento #facc15
- Tipografía: 'Outfit' (títulos), 'Inter' (body), 'JetBrains Mono' (código/datos)
- Responsive: Funciona en móvil, tablet, desktop
- Performance: CSV para descarga; Sheets para no depender de base de datos propia

## Archivo de Referencia Completo
El prototipo HTML interactivo está en: `/docs/CONSOLA_CAZA_REFERENCIA.html`

Contiene el flujo completo funcional: radar con SECOP II real, calificador interactivo, plantillas de mensajes, tabla y embudo. Usarlo como spec visual durante implementación React.

---

**Creado**: 2026-08-29
**Versión**: 1.0
**Para**: Claude Code (implementación en mapzy-web)
