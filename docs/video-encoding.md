# Encoding de video para la vitrina

La landing hace _scrubbing_ del video: el `currentTime` del elemento `<video>` se mueve con el
scroll. Para que la reproducción se sienta fluida, el archivo debe tener **keyframes frecuentes** y
un tamaño razonable para red.

## Formato recomendado

| Propiedad        | Escritorio             | Móvil                  |
| ---------------- | ---------------------- | ---------------------- |
| Contenedor       | MP4                    | MP4                    |
| Video            | H.264 High, `yuv420p`  | H.264 Main, `yuv420p`  |
| Resolución       | 1920×1080              | 1080×1920              |
| FPS              | 30                     | 30                     |
| Keyframe (GOP)   | 30 frames (~1 s)       | 30 frames (~1 s)       |
| Bitrate objetivo | 4–6 Mbps               | 2–3 Mbps               |
| Audio            | Sin audio (`-an`)      | Sin audio (`-an`)      |
| Fast start       | `-movflags +faststart` | `-movflags +faststart` |

Evita clips largos: idealmente cada producto tiene una escena de 10–20 segundos. Si el video es
muy pesado, baja el bitrate antes que la resolución.

## Comandos ffmpeg

Escritorio (16:9):

```bash
ffmpeg -i origen.mov \
  -vf "scale=1920:-2:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 23 -g 30 -keyint_min 30 -sc_threshold 0 \
  -movflags +faststart -an landing-desktop.mp4
```

Móvil (9:16) desde el mismo origen:

```bash
ffmpeg -i origen.mov \
  -vf "scale=1080:-2:flags=lanczos,fps=30,crop=1080:1920" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -crf 24 -g 30 -keyint_min 30 -sc_threshold 0 \
  -movflags +faststart -an landing-mobile.mp4
```

Si el origen ya viene en vertical, usa `scale=1080:1920:force_original_aspect_ratio=increase` y
recorta el sobrante.

## Verificación

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,profile,width,height,r_frame_rate,bit_rate,pix_fmt \
  -show_entries format=duration,size \
  -of default=noprint_wrappers=1 landing-desktop.mp4
```

Comprueba también que el primer keyframe esté al inicio y que el archivo abra rápido en el
navegador.

## Uso en la aplicación

- Los videos se cargan desde la API (`video_principal.url`) o desde `tienda.video_landing_url`.
- `VideoScene` precarga la escena activa, la anterior y la siguiente; el resto permanece con
  `preload="none"` hasta acercarse.
- Siempre define un `poster` (imagen principal de la prenda) para evitar un frame negro mientras
  carga o si el video falla.
- Si el video de una escena falla, esa escena muestra su imagen principal y la landing permanece en
  modo video; no cambia de modo ni salta de posición. El interruptor **Movimiento** sigue disponible
  para pasar a la galería estática.
- La landing inicia en modo video. El interruptor **Movimiento** del encabezado permite pasar a la
  galería estática y volver al video sin recargar; el modo elegido no se guarda entre visitas.
- Si el sistema prefiere movimiento reducido, los saltos entre escenas usan scroll instantáneo en
  lugar de animado.

## Almacenamiento

Sube los archivos a un CDN o a `frontend/public/` solo para pruebas. En producción conviene servir
desde un CDN con cache largo y soporte de `Range` requests para el scrubbing.
