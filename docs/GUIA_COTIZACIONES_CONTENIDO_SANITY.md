# 📘 GUÍA MAESTRA: Cotizaciones, Formatos Ejecutivos y Sanity CMS

Esta guía consolida la metodología estandarizada para la generación de propuestas comerciales, la redacción de artículos editoriales y la administración de contenidos en Mapzy S.A.S.

---

## 🗺️ 1. Cotizaciones Comerciales e Impresión PDF

### 🎨 Tokens de Color Obligatorios
- **Azul Oscuro Corporativo**: `#1a2a44`
- **Amarillo Acento**: `#facc15`
- **Gris de Fondo**: `#f8fafc`

### 🖨️ Preservación de Colores al Exportar a PDF (`@media print`)
Para asegurar que los navegadores no eliminen los fondos azul y amarillo al imprimir o guardar en PDF, se debe incluir la siguiente regla CSS:

```css
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
```

---

## 📊 2. Matriz de Tarifas por Hectárea (Colombia 2025/2026)

| Rango de Área (Ha) | 🟢 Tipo 1: Reconocimiento Aéreo | 🔵 Tipo 2: Linderos & Catastro | 🟡 Tipo 3: Alta Precisión & Cubaje ANM |
| :--- | :--- | :--- | :--- |
| **0 a 30 Ha** | $ 2.000.000 – $ 2.800.000 | $ 3.000.000 – $ 4.200.000 | $ 4.000.000 – $ 5.500.000 |
| **31 a 50 Ha** | $ 2.800.000 – $ 3.800.000 | $ 4.200.000 – $ 5.800.000 | $ 5.500.000 – $ 7.500.000 |
| **51 a 100 Ha** | $ 4.000.000 – $ 5.500.000 | $ 6.000.000 – $ 8.500.000 | $ 8.500.000 – $ 11.500.000 |
| **101 a 200 Ha** | $ 6.000.000 – $ 8.000.000 | $ 9.000.000 – $ 12.000.000 | $ 13.000.000 – $ 16.500.000 |
| **201 a 500 Ha** | $ 9.500.000 – $ 13.000.000 | $ 14.000.000 – $ 18.000.000 | $ 18.000.000 – $ 24.000.000 |

---

## 🛠️ 3. Herramienta Conversor de PDF a Markdown

El proyecto incluye la herramienta ejecutable en Python:
📁 [`scripts/convert_pdf_to_md.py`](file:///c:/Users/srfaj/Escritorio/Mapzy/mapzy-web/scripts/convert_pdf_to_md.py)

**Uso**:
```bash
python scripts/convert_pdf_to_md.py "ruta/del/archivo.pdf"
```

---

## 💻 4. Micro-App Cotizador Interactivo

La aplicación web interna está disponible localmente en:
👉 **`http://localhost:3000/herramientas/cotizador`**

Permite seleccionar tipos de trabajo, ajustar hectáreas mediante un slider interactivo, aplicar descuentos comerciales y generar la propuesta ejecutiva lista para exportar a PDF.
