# Guía de medios de Mapzy Web

Cómo entra el material propio —fotos y video de dron, animaciones de modelos,
mapas, retratos del equipo— al sitio, en qué formato y a qué peso.

---

## 1. La decisión de fondo: repositorio o Sanity

No todo va al mismo sitio, y meterlo todo en el repositorio sería un error caro.

| Va en **Sanity** | Va en el **repositorio** (`public/media/`) |
| :--- | :--- |
| Imágenes de proyectos | Video de portada y su póster |
| Mapas y planos de cada caso | Retratos del equipo |
| Imágenes de artículos del blog | El marcador de marca |
| Animaciones de modelos por proyecto | |

**La regla:** si para cambiarlo hay que tocar código, va en el repositorio. Si
debería poder cambiarlo alguien del equipo sin programar, va en Sanity.

Tres razones para preferir Sanity en todo lo editorial:

1. **Se cambia sin desplegar.** Subes una foto en `mapzy.com.co/studio` y el
   sitio la toma en 60 segundos. Si estuviera en el repositorio haría falta un
   commit y un despliegue por cada foto.
2. **Redimensiona sola.** Sanity sirve la imagen al tamaño y formato que pide
   cada dispositivo. Una foto de dron de 8 MB llega al celular como 120 KB.
3. **El repositorio no engorda.** Todo lo que entra a git **queda en su
   historial para siempre**, aunque después lo borres. Cien fotos de dron
   convierten un clon de 2 segundos en uno de varios minutos, para siempre.

> Guarda siempre los originales de cámara fuera del repositorio: tu disco,
> Drive, donde sea. Aquí solo entran versiones comprimidas para web.

---

## 2. Fotos de dron y mapas (van a Sanity)

Súbelas desde **`mapzy.com.co/studio`** → *Proyecto de Portafolio* → campo
*Imagen Principal*.

No hace falta comprimirlas mucho: Sanity guarda el original y genera las
versiones. Solo conviene no subir el archivo crudo de 40 MP.

**Prepararlas antes de subir** (tope de 3000 px de ancho, buena calidad):

```bash
ffmpeg -i DJI_0042.JPG -vf "scale='min(3000,iw)':-2" -q:v 2 proyecto-cocora-01.jpg
```

Para procesar una carpeta entera:

```bash
for f in *.JPG; do ffmpeg -i "$f" -vf "scale='min(3000,iw)':-2" -q:v 2 "web-$f"; done
```

**Qué buscar en las fotos.** El análisis del sector es explícito: los lectores
técnicos penalizan lo que parece de catálogo. Vale más una foto real del
equipo en campo, con los elementos de protección puestos correctamente y el
equipo reconocible, que una toma bonita y genérica. Una foto de un topógrafo
sin casco en una mina le resta credibilidad al sitio entero ante un jefe de
seguridad industrial.

---

## 3. Video de portada (va al repositorio)

Es el único video que se descarga en la primera pantalla, así que es el que
más cuidado necesita. Va en `public/media/hero/`.

**Objetivo: por debajo de 4 MB.** Va detrás de un degradado oscuro y sin
sonido, así que puede comprimirse mucho más de lo que parecería.

Elige entre 10 y 14 segundos que se puedan repetir sin corte brusco.

**MP4 (obligatorio, lo entienden todos los navegadores):**

```bash
ffmpeg -i original.mp4 -t 12 -an \
  -vf "scale=1920:-2,fps=24" \
  -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
  -movflags +faststart \
  public/media/hero/sobrevuelo.mp4
```

Qué hace cada parte, por si quieres ajustar:

- `-t 12` recorta a 12 segundos.
- `-an` **elimina el audio**. El video va en silencio de todos modos, y sin
  pista de audio pesa menos y iOS lo reproduce solo sin problemas.
- `-crf 28` es la calidad. Más alto pesa menos: sube a 30 o 32 si aún no baja
  de 4 MB, baja a 25 si lo ves con bloques.
- `-pix_fmt yuv420p` es lo que exige Safari. Sin esto, en iPhone se ve negro.
- `-movflags +faststart` mueve el índice al principio para que empiece a verse
  mientras descarga, en vez de esperar al archivo completo.

**WebM (opcional, pesa cerca de un 40 % menos):**

```bash
ffmpeg -i original.mp4 -t 12 -an \
  -vf "scale=1920:-2,fps=24" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
  public/media/hero/sobrevuelo.webm
```

**Póster** (lo que se ve mientras carga, y lo único que se descarga en celular):

```bash
ffmpeg -i public/media/hero/sobrevuelo.mp4 -ss 00:00:01 -frames:v 1 -q:v 3 \
  public/media/hero/sobrevuelo.jpg
```

**Comprobar el peso antes de subir:**

```bash
ls -lh public/media/hero/
```

Si el MP4 pasa de 5 MB, sube el `-crf` y repite. No lo subas por encima de eso.

### Activarlo

Cuando los archivos estén en su sitio, en `src/data/medios.ts`:

```ts
export const HERO_VIDEO  = '/media/hero/sobrevuelo.mp4';
export const HERO_POSTER = '/media/hero/sobrevuelo.jpg';
```

En celular **no se descarga el video**, solo el póster. Un visitante con datos
móviles no debe pagar 4 MB por una decoración.

---

## 4. Animaciones de modelos y mapas

Trátalas como el video de portada pero más cortas y más pequeñas, porque van
dentro del contenido y no a pantalla completa:

```bash
ffmpeg -i animacion.mp4 -t 8 -an \
  -vf "scale=1280:-2,fps=24" \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart \
  animacion-web.mp4
```

**No uses GIF.** Un GIF de 8 segundos pesa entre 10 y 20 veces más que el mismo
clip en MP4, y se ve peor.

Si la animación pertenece a un proyecto concreto, lo natural es que viva en
Sanity junto al resto del caso. Hoy el esquema de proyecto no tiene campo para
video; añadirlo es un cambio pequeño y conviene hacerlo antes de cargar
material, para no tener que reorganizarlo después.

---

## 5. Retratos del equipo (van al repositorio)

Cuadrados, 800×800, en `public/media/equipo/`. El código espera estos nombres
exactos:

- `sergio-fajardo.webp`
- `javier-fajardo.webp`

**Recorte cuadrado centrado y conversión, en un solo paso:**

```bash
ffmpeg -i foto-sergio.jpg \
  -vf "crop=min(iw\,ih):min(iw\,ih),scale=800:800" \
  -c:v libwebp -quality 82 \
  public/media/equipo/sergio-fajardo.webp
```

Deberían quedar por debajo de 80 KB cada una.

Si el recorte automático te corta mal la cabeza, recorta a mano antes y pasa
solo la conversión:

```bash
ffmpeg -i recortada.jpg -vf "scale=800:800" -c:v libwebp -quality 82 \
  public/media/equipo/sergio-fajardo.webp
```

Mientras el archivo no exista, la tarjeta muestra el ícono genérico. No se ve
una imagen rota.

---

## 6. Resumen de pesos

| Qué | Formato | Tamaño | Peso objetivo |
| :--- | :--- | :--- | :--- |
| Video de portada | MP4 H.264 sin audio | 1920×1080 | **< 4 MB** |
| Póster de portada | JPEG | 1920×1080 | < 250 KB |
| Retrato de equipo | WebP | 800×800 | < 80 KB |
| Foto de proyecto | JPEG a Sanity | máx. 3000 px | < 5 MB |
| Animación de modelo | MP4 H.264 sin audio | 1280 px | < 2 MB |

---

## 7. Orden sugerido para llenarlo

1. **Retratos del equipo.** Dos archivos, efecto inmediato, cero riesgo.
2. **Video de portada.** Es lo que más cambia la percepción del sitio.
3. **Tres proyectos en Sanity** con foto, metodología y resultados. El análisis
   del sector insiste en que cada caso siga la estructura contexto →
   metodología → resultados cuantificables; sin eso el portafolio no rinde
   en buscadores.
4. **Animaciones**, cuando el esquema de proyecto tenga campo para video.
