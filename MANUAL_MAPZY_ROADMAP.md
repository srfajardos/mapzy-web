# 📖 Manual de Administración, Arquitectura y Roadmap de Mapzy

---

## 🟢 1. Unificación Tecnológica y Arquitectura

Todo el código de la plataforma **Mapzy** está **100% unificado** bajo un estándar moderno, robusto y escalable. No existen lenguajes o librerías en conflicto.

### 🛠️ Stack Tecnológico Unificado:
- **Framework Principal**: Next.js 14 (App Router).
- **Lenguaje**: TypeScript (Tipado estricto sin errores de compilación).
- **Librería UI**: React 18 (Componentización modular).
- **Estilos**: Tailwind CSS + Lucide Icons + Google Fonts (Inter).
- **Motor de Mapas y Cartografía**: Leaflet.js + OpenStreetMap / Stamen / CartoDB tiles.
- **Visualización Conceptual Interactiva**: D3.js v7 (Animaciones vectoriales SVG).
- **Gestión de Estado**: Zustand (`useMapStore` para el editor de pósters).
- **Gestor de Contenidos (CMS)**: Sanity.io Studio v3 (Blog y Noticias).

---

## 📝 2. Cómo Administrar el Blog en Sanity CMS

La plataforma cuenta con un panel administrativo interno **Sanity Studio** incrustado directamente en Next.js.

### 🚀 Pasos para Ingresar al Studio:
1. Inicia el servidor local de desarrollo (`npm run dev`).
2. Abre en tu navegador la URL: **`http://localhost:3000/studio`** (o en producción `https://tu-dominio.com/studio`).
3. Inicia sesión con la cuenta de correo/Google vinculada al proyecto de Sanity (`bekkfxya`).

### ✍️ Publicar y Editar Entradas del Blog:
1. En el panel lateral de Sanity Studio, verás los tipos de contenido: **Post**, **Author**, y **Category**.
2. Haz clic en **Post** > **`+ Create`**.
3. Diligencia los campos:
   - **Title**: Título del artículo.
   - **Slug**: Haz clic en *Generate* para crear la URL amigable.
   - **Main Image**: Sube la imagen de portada.
   - **Summary**: Resumen corto para tarjetas y vista previa SEO (máx. 200 caracteres).
   - **Body**: Editor de texto enriquecido (*Portable Text*) para el cuerpo de la noticia.
4. Presiona el botón verde **`Publish`** en la esquina inferior derecha. El artículo aparecerá instantáneamente en `/blog` y `/blog/[slug]`.

---

## 📚 3. Cómo Agregar Nuevos Artículos e Investigaciones Estáticas

Para incluir ensayos, documentos técnicos o guías que **no pasan por Sanity** (como *El Dilema Vocacional* o *SGR Andino*):

1. **Crear la Ruta**: Crea una carpeta dentro de `src/app/articulos/` con el nombre de la URL (ejemplo: `src/app/articulos/mi-nuevo-estudio/page.tsx`).
2. **Estructura del Componente**:
```tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Mi Nuevo Estudio | Mapzy Artículos',
  description: 'Descripción breve para motores de búsqueda.',
};

export default function MiNuevoEstudioPage() {
  return (
    <article className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-black text-[#1a2a44] mb-4">Título del Artículo</h1>
        <p className="text-slate-600 leading-relaxed">Contenido del artículo...</p>
      </div>
    </article>
  );
}
```
3. **Indexar en el Hub**: Agrega la tarjeta correspondiente en la lista del archivo [`src/app/articulos/page.tsx`](file:///c:/Users/srfaj/Escritorio/Mapzy/mapzy-web/src/app/articulos/page.tsx).

---

## 🧰 4. Guía de Funcionamiento de las Herramientas (`/herramientas`)

Todas las herramientas se encuentran integradas en la suite `/herramientas`:

1. **🎨 Studio Editor de Mapas (Mapzy Genesis)** (`/herramientas/editor-mapas`):
   - **Propósito**: Generador de pósters cartográficos de estilo museo.
   - **Funcionamiento**: Permite buscar cualquier ciudad de Colombia, ajustar coordenadas de latitud/longitud, seleccionar temas visuales (Light, Dark, Blueprint, Hackerman) y descargar el mapa listo para impresión.
2. **🏛️ Árbol Atómico del Estado Colombiano** (`/herramientas/estado-colombiano`):
   - **Propósito**: Mapa conceptual de la estructura del poder público (Constitución de 1991).
   - **Funcionamiento**: Desarrollado en D3.js. Permite abrir/cerrar ramas con animaciones de 400ms, hacer Zoom/Pan con el mouse y consultar información detallada en el panel lateral. Incluye botones de *Expandir Todo*, *Contraer Todo* y *Centrar Mapa*.
3. **📋 Matriz de Exclusión Geoespacial** (`/herramientas/matriz-exclusion`):
   - **Propósito**: Evaluador de viabilidad territorial para proyectos mineros/ambientales.
   - **Funcionamiento**: Permite marcar criterios de Veto Absoluto, Fricción y Atractores Financieros. Calcula el puntaje de viabilidad en tiempo real, guarda el estado en `localStorage` del navegador y permite exportar e importar la evaluación en formato JSON.
4. **🌋 GeoRisk Colombia Monitor** (`/herramientas/geo-risk`):
   - **Propósito**: Portal de inteligencia de riesgo sismológico y vial.
   - **Funcionamiento**: Mapa Leaflet interactivo que renderiza capas de eventos sísmicos recientes y corredores viales críticos del país.

---

## 🔮 5. Roadmap de Próximas Mejoras

Queda documentado el plan técnico para las futuras etapas de desarrollo:

### 📥 A. Integración de Base de Datos para el Formulario de Contacto
- **Objetivo**: Almacenar las consultas de clientes que diligencian el formulario en `/#contacto`.
- **Tecnología Recomendada**: **Supabase** (PostgreSQL) o **Prisma ORM** + Neon.
- **Implementación**: Crear un endpoint API Route `src/app/api/contacto/route.ts` que reciba el nombre, correo, tipo de consulta y guarde el registro en la BD.

### ✉️ B. Envío de Correos Automáticos y Notificaciones
- **Objetivo**: Enviar una notificación por correo al equipo de Mapzy cuando alguien solicite una *Consulta SIG*, y un correo de confirmación al cliente.
- **Tecnología Recomendada**: **Resend** o **Nodemailer**.
- **Implementación**: Integrar la clave API de Resend en el API route de contacto para despachar un email HTML personalizado.

### 🔐 C. Sistema de Autenticación y Cuentas de Usuario (Login / Register)
- **Objetivo**: Permitir a los usuarios registrarse, guardar sus diseños de pósters de Mapzy Genesis en su perfil y guardar matrices de exclusión personalizadas.
- **Tecnología Recomendada**: **NextAuth.js (Auth.js)** o **Supabase Auth**.
- **Implementación**: Habilitar inicio de sesión social (Google, GitHub) y credenciales de email/contraseña, protegiendo rutas privadas bajo `/dashboard`.
