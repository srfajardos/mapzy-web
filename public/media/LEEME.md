# Carpeta de medios

Aquí van **solo** los archivos que forman parte de la estructura del sitio y
cambian rara vez. Todo lo que sea contenido editorial —fotos de proyectos,
mapas de casos, imágenes de artículos— va en **Sanity**, no aquí.

La regla para decidir: si para cambiarlo hay que tocar código, va aquí. Si
debería poder cambiarlo alguien del equipo sin programar, va en Sanity.

## Estructura

    public/media/
      equipo/     Retratos del equipo. WebP cuadrado, 800x800.
                  Nombres exactos que espera el código:
                    sergio-fajardo.webp
                    javier-fajardo.webp
      hero/       Video de portada y su imagen de póster.
                    sobrevuelo.mp4
                    sobrevuelo.webm   (opcional, pesa menos)
                    sobrevuelo.jpg    (póster, mismo encuadre)
      proyectos/  Solo si algún proyecto necesita un archivo fijo fuera de
                  Sanity. En general no hace falta.

## Importante sobre el peso

Todo lo que entre aquí queda en el historial de git **para siempre**, aunque
después se borre. Por eso conviene comprimir antes de subir y no dejar aquí
originales de cámara. Guarda los originales en tu disco o en Drive.

Ver `docs/GUIA_MEDIOS.md` para los comandos de conversión.
