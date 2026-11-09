# Implementation Plan: Landing inmersiva de Carise

**Branch**: `001-immersive-storefront` | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-immersive-storefront/spec.md`

## Summary

Landing inmersiva con video de fondo a pantalla completa controlado por scroll. La prenda
visible se resalta en una lista lateral (tira inferior en celular) y cualquier prenda es
seleccionable para abrir su detalle y comprar por WhatsApp. El frontend se renderiza en
servidor con Next.js (App Router) y la interacción de video se aísla en un componente cliente.
El backend expone una API REST pública de solo lectura con FastAPI sobre PostgreSQL, con
arquitectura limpia en ambos proyectos. El video y las imágenes viven en CDN/almacenamiento
externo; la base de datos solo guarda URLs.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend, Node 20+), Python 3.12+ (backend)

**Primary Dependencies**:
- Frontend: Next.js (App Router), React 19, Tailwind CSS, `next/font` (Fraunces y Mea Culpa),
  `next/image`, Framer Motion (`useScroll`) con GSAP ScrollTrigger como alternativa.
- Backend: FastAPI, Pydantic v2, SQLAlchemy 2 (async), Alembic, `asyncpg`/`psycopg`.

**Storage**: PostgreSQL. Video e imágenes en CDN/almacenamiento externo (solo URLs en BD).
Assets de marca en `frontend/public/brand`.

**Testing**:
- Frontend: Vitest + Testing Library (unidad/componentes), Playwright (e2e y reduced-motion).
- Backend: pytest, `httpx.AsyncClient`, `testcontainers` para PostgreSQL, pruebas de contrato.

**Target Platform**: Navegadores web modernos (móvil primero y escritorio); servidor Linux.

**Project Type**: Web application (frontend + backend en monorepo, proyectos separados).

**Performance Goals**: scroll a 60 fps; arranque de video sin bloquear la interacción;
respuestas de API < 200 ms p95; imágenes optimizadas por `next/image`.

**Constraints**: API pública de solo lectura; CORS limitado al dominio del frontend;
configuración por variables de entorno; video MP4 H.264 (WebM opcional) con keyframes
frecuentes; variante de video más liviana para celular; `prefers-reduced-motion` respetado;
fallback estático si el video falla.

**Scale/Scope**: catálogo pequeño (decenas de prendas), landing única, dos endpoints públicos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Puerta de cumplimiento | Estado |
|-----------|------------------------|--------|
| I. Vitrina inmersiva (video primero) | Video full-screen y avance ligado al scroll en el plan de frontend | PASS |
| II. Selección natural y sincronizada | Lista/tira sincronizada con el tiempo del video y salto por clic | PASS |
| III. Detalle completo | `GET /productos/{id}` incluye fotos, descripción, precio, tallas, colores y cuidado | PASS |
| IV. Compra por WhatsApp | Único canal: enlace `wa.me` con mensaje prellenado; sin carrito ni pagos | PASS |
| V. Degradación elegante | Fallback estático y `prefers-reduced-motion` en el componente de video | PASS |
| VI. Agotado explícito | `agotado` derivado de variantes y bloqueo de compra | PASS |
| VII. Identidad de marca | Tokens de marca en Tailwind, tipografías con `next/font`, assets en `public/brand` | PASS |
| VIII. Móvil primero y rendimiento | Variante de video móvil, precarga controlada, SSR, `next/image` | PASS |
| IX. Experiencia sin cuentas | Sin registro, login, favoritos, admin, búsqueda ni filtros | PASS |

**Resultado**: Sin violaciones. No se requiere justificación en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-immersive-storefront/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md            # generado luego por /speckit.tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domain/
│   │   ├── entities/          # Producto, Variante, Escena, ConfiguracionTienda, ...
│   │   ├── value_objects/     # Precio, RangoDeTiempo, UrlMultimedia
│   │   └── repositories/      # interfaces (ProductoRepository, LandingRepository)
│   ├── application/
│   │   ├── use_cases/         # ObtenerLanding, ObtenerProducto
│   │   └── dto/               # DTOs de salida
│   ├── infrastructure/
│   │   ├── db/                # engine, sesión async, base
│   │   ├── models/            # modelos SQLAlchemy 2
│   │   ├── repositories/      # implementaciones de repositorio
│   │   └── config/            # settings por variables de entorno
│   ├── presentation/
│   │   ├── api/               # routers FastAPI
│   │   └── schemas/           # esquemas Pydantic v2 de respuesta
│   └── main.py                # app, CORS, montaje de routers
├── alembic/
│   ├── versions/
│   └── env.py
├── tests/
│   ├── contract/
│   ├── integration/
│   └── unit/
├── pyproject.toml
└── .env.example

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # next/font, metadata
│   │   ├── page.tsx           # landing renderizada en servidor
│   │   └── globals.css
│   ├── components/
│   │   ├── video-scene/       # componente cliente sticky + scroll sync
│   │   ├── product-list/      # lista lateral / tira inferior
│   │   ├── product-detail/    # detalle y selección talla/color
│   │   ├── whatsapp-button/   # enlace wa.me prellenado
│   │   ├── about/
│   │   ├── faq/
│   │   ├── contact/
│   │   └── footer/
│   ├── domain/                # tipos y entidades del catálogo
│   ├── application/           # hooks: scroll sync, compra WhatsApp, reduced-motion
│   ├── infrastructure/
│   │   ├── api/               # cliente HTTP hacia el backend
│   │   └── config/            # variables de entorno públicas
│   └── styles/
├── public/brand/              # logos, favicon, fuentes de respaldo
├── tests/
│   ├── unit/
│   └── e2e/
├── tailwind.config.ts         # tokens de marca
├── next.config.ts             # remotePatterns de imágenes/CDN
└── .env.example
```

**Structure Decision**: Monorepo con dos proyectos independientes (`frontend/` y `backend/`).
Cada uno organizado en capas de Clean Architecture: dominio, aplicación, infraestructura y
presentación. El frontend renderiza la landing en servidor y aísla el video en un componente
cliente; el backend expone endpoints de solo lectura y mantiene el dominio independiente de
FastAPI y SQLAlchemy.

## Complexity Tracking

Sin violaciones constitucionales; no aplica.
