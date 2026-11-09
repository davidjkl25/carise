# Research: Landing inmersiva de Carise

## 1. Sincronización scroll-video

- **Decision**: Usar Framer Motion `useScroll` para mapear el progreso del contenedor sticky al
  `currentTime` del video, con actualizaciones limitadas por `requestAnimationFrame`. GSAP
  ScrollTrigger queda como alternativa si la escritura de `currentTime` no alcanza fluidez.
- **Rationale**: Framer Motion ya es parte del stack React, evita introducir otra dependencia de
  animación y permite declarar el mapeo de forma idiomática. El control por `requestAnimationFrame`
  evita saturar el decoder de video con seeks excesivos.
- **Alternatives considered**: GSAP ScrollTrigger con `scrub` (más control y mejor soporte de
  pinning, pero añade peso y complejidad); `IntersectionObserver` (no ofrece progreso continuo).

## 2. Patrón de sección sticky

- **Decision**: Contenedor de scroll con altura igual a la duración de la secuencia; dentro, una
  sección `position: sticky` de altura de viewport que contiene el video y la lista.
- **Rationale**: Es el patrón estándar de "scrollytelling" y funciona sin JS para el layout; el JS
  solo actualiza el tiempo del video y el estado activo.
- **Alternatives considered**: Scroll hijacking con `scroll-snap` forzado (peor accesibilidad y
  peor comportamiento en trackpads).

## 3. Codificación y entrega del video

- **Decision**: MP4 H.264 como formato principal, WebM opcional; `poster`, `preload="metadata"`
  hasta que la sección entra en viewport y luego `preload="auto"`; keyframes cada ~0.5-1 s para
  que el seek por scroll sea fluido; variante móvil de menor resolución/bitrate servida por
  `matchMedia` o `src` alternativo.
- **Rationale**: H.264 es el códec con mayor compatibilidad; keyframes frecuentes reducen el
  costo de decodificación al hacer seek; la variante móvil reduce datos y mejora el arranque.
- **Alternatives considered**: Video por HLS (innecesario para una secuencia corta); animación
  por canvas/frames (mucho peso y complejidad).

## 4. Fallback estático y movimiento reducido

- **Decision**: Detectar `prefers-reduced-motion` y errores de `loadeddata`/`error` del video;
  en ambos casos renderizar una galería estática de imágenes con la misma lista y detalle.
- **Rationale**: Cumple el principio V y mantiene la funcionalidad completa sin video.
- **Alternatives considered**: Solo mostrar el poster (pierde la navegación entre prendas).

## 5. Tipografías y tokens de marca

- **Decision**: Fraunces (display/títulos) y Mea Culpa (acentos) vía `next/font/google` con
  `variable` CSS; tokens de color, espaciado y radios en `tailwind.config.ts` y variables CSS.
- **Rationale**: `next/font` evita requests a Google en runtime y elimina FOUT; los tokens
  centralizan la identidad de marca.
- **Alternatives considered**: Cargar fuentes por `<link>` (peor rendimiento y privacidad).

## 6. Imágenes desde CDN

- **Decision**: `next/image` con dominios del CDN declarados en `remotePatterns`; tamaños
  responsivos y `sizes` según la lista y el detalle.
- **Rationale**: Optimización y lazy loading automáticos; las URLs viven en la BD y el CDN
  entrega el binario.
- **Alternatives considered**: `<img>` sin optimización (peor LCP y sin control de tamaños).

## 7. Compra por WhatsApp

- **Decision**: Enlace `https://wa.me/<numero>?text=<mensaje>` con mensaje prellenado que incluye
  prenda, talla, color y precio; se construye en el cliente tras validar talla/color.
- **Rationale**: No requiere backend ni pagos, y funciona en móvil y escritorio.
- **Alternatives considered**: Deep link `whatsapp://` (menos portable); backend de mensajería
  (fuera de alcance).

## 8. Clean Architecture en backend

- **Decision**: Entidades y puertos de repositorio en `domain`; casos de uso en `application`;
  SQLAlchemy/Alembic en `infrastructure`; FastAPI/Pydantic en `presentation`. Inyección de
  dependencias por función de FastAPI.
- **Rationale**: El dominio no depende de frameworks; facilita pruebas unitarias y cambios de
  persistencia.
- **Alternatives considered**: Estructura por tipo de archivo (models/routers/services) sin
  fronteras de capas (más rápida al inicio, más difícil de mantener).

## 9. Clean Architecture en frontend

- **Decision**: Tipos/entidades en `domain`; hooks y lógica de presentación en `application`;
  cliente HTTP y configuración en `infrastructure`; componentes en `components`. Los componentes
  de servidor consumen datos; solo el video y la selección son cliente.
- **Rationale**: Mantiene la landing SSR y aísla la interacción, siguiendo el principio VIII.
- **Alternatives considered**: Todo cliente (peor LCP/SEO) o todo servidor (no permite sincronizar
  el video con el scroll).

## 10. CORS, configuración y seguridad

- **Decision**: Variables de entorno validadas con Pydantic Settings; CORS con una lista blanca
  de orígenes (dominio del frontend, local en desarrollo). API de solo lectura, sin datos
  personales.
- **Rationale**: Evita exponer el backend a orígenes no autorizados y mantiene configuración
  fuera del código.
- **Alternatives considered**: CORS abierto (inseguro); secretos en el repositorio (prohibido).

## 11. Estrategia de pruebas

- **Decision**: Unitarias de casos de uso y utilidades (pytest/Vitest); integración de
  repositorios con PostgreSQL en contenedor; contrato del OpenAPI; e2e de scroll, fallback,
  reduced-motion y enlace de WhatsApp con Playwright.
- **Rationale**: Cubre las puertas de aceptación de la constitución y los escenarios de usuario.
- **Alternatives considered**: Solo pruebas manuales (no verificable ni repetible).
