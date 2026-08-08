import os
import sys
import fitz  # PyMuPDF

def convert_pdf_to_markdown(pdf_path, output_md_path=None):
    """
    Convierte un archivo PDF a formato Markdown (.md) extrayendo el texto por páginas.
    """
    if not os.path.exists(pdf_path):
        print(f"Error: El archivo {pdf_path} no existe.")
        return

    if not output_md_path:
        output_md_path = pdf_path.rsplit('.', 1)[0] + '.md'

    print(f"Procesando PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"Total de páginas: {total_pages}")

    md_content = []
    file_title = os.path.basename(pdf_path).rsplit('.', 1)[0]
    md_content.append(f"# Documento Extraído: {file_title}\n\n")
    md_content.append(f"- **Páginas totales**: {total_pages}\n")
    md_content.append(f"- **Ruta original**: `{pdf_path}`\n\n---\n\n")

    for page_num in range(total_pages):
        page = doc.load_page(page_num)
        text = page.get_text("text")

        md_content.append(f"## Página {page_num + 1}\n\n")
        if text.strip():
            md_content.append(text.strip() + "\n\n")
        else:
            md_content.append("*[Página vacía o contiene solo imágenes]*\n\n")
        md_content.append("---\n\n")

    os.makedirs(os.path.dirname(os.path.abspath(output_md_path)), exist_ok=True)
    with open(output_md_path, 'w', encoding='utf-8') as f:
        f.writelines(md_content)

    print(f"OK: Convertido con éxito a {output_md_path}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
        if os.path.isdir(target_path):
            files = [f for f in os.listdir(target_path) if f.lower().endswith('.pdf')]
            for pdf_file in files:
                pdf_full = os.path.join(target_path, pdf_file)
                convert_pdf_to_markdown(pdf_full)
        else:
            convert_pdf_to_markdown(target_path)
    else:
        # Por defecto procesa la carpeta de Descargas y consultas de la web
        default_dir = r"c:\Users\srfaj\Escritorio\Mapzy\Descargas y consultas de la web"
        if os.path.exists(default_dir):
            files = [f for f in os.listdir(default_dir) if f.lower().endswith('.pdf')]
            for pdf_file in files:
                convert_pdf_to_markdown(os.path.join(default_dir, pdf_file))
        else:
            print("Uso: python convert_pdf_to_md.py <ruta_del_pdf_o_carpeta>")
