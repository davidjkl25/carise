---

description: "Task list for landing inmersiva de Carise"
---

# Tasks: Landing inmersiva de Carise

**Input**: Design documents from `/specs/001-immersive-storefront/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: No se generan tareas de prueba formales porque la especificación no las solicita explícitamente. El stack de pruebas del plan (pytest, Vitest, Playwright) queda disponible para añadirlas después.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementación y validación independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[Story]**: historia de usuario asociada (US1, US2, US3, US4)
- Rutas de archivo exactas en cada descripción

## Path Conventions

- Monorepo: `backend/src/` y `frontend/src/`
- Contratos: `specs/001-immersive-storefront/contracts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización de los dos proyectos y estructura base.

- [ ] T001 Crear la estructura de monorepo `backend/` y `frontend/` según `plan.md` (capas domain/application/infrastructure/presentation)
- [ ] T002 Inicializar el backend en `backend/pyproject.toml` con FastAPI, Pydantic v2, SQLAlchemy 2 async, Alembic y `asyncpg`
- [ ] T003 [P] Inicializar el frontend en `frontend/package.json` con Next.js App Router, TypeScript, Tailwind CSS y Framer Motion
- [ ] T004 [P] Configurar lint y formato: `backend/ruff.toml` + `mypy.ini`, `frontend/.eslintrc.json` + `.prettierrc`
- [ ] T005 [P] Crear `backend/.env.example` y `frontend/.env.example` con las variables del plan
- [ ] T006 [P] Configurar tokens de marca en `frontend/tailwind.config.ts` (color, espaciado, radios) y variables CSS
- [ ] T007 [P] Configurar `next/font/google` (Fraunces y Mea Culpa) como variables en `frontend/src/app/layout.tsx`
- [ ] T008 [P] Configurar `frontend/next.config.ts` con `images.remotePatterns` para el CDN y los dominios de multimedia
- [ ] T009 [P] Crear `frontend/public/brand/` con logo, favicon y placeholders de assets de marca

**Checkpoint**: Ambos proyectos inicializados; sin lógica de negocio aún.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura compartida que bloquea todas las historias.

**CRITICAL**: Ninguna historia puede empezar hasta completar esta fase.

- [ ] T010 [P] Implementar settings por entorno en `backend/src/infrastructure/config/settings.py` con `pydantic-settings` (`DATABASE_URL`, `CORS_ORIGINS`, `WHATSAPP_DEFAULT`)
- [ ] T011 [P] Configurar engine y sesión async en `backend/src/infrastructure/db/session.py` y `backend/src/infrastructure/db/base.py`
- [ ] T012 [P] Inicializar Alembic en `backend/alembic/` con `env.py` apuntando a las settings y a los metadatos de SQLAlchemy 2
- [ ] T013 [P] Definir entidades de dominio en `backend/src/domain/entities/`: `Categoria`, `Producto`, `Variante`, `MultimediaProducto`, `EscenaVideo`, `ConfiguracionTienda`
- [ ] T014 [P] Definir puertos de repositorio en `backend/src/domain/repositories/`: `ProductoRepository` y `LandingRepository`
- [ ] T015 Crear modelos SQLAlchemy 2 en `backend/src/infrastructure/models/` respetando el modelo de datos: `productos.precio` numeric(12,2) CHECK >= 0; `productos.moneda` char(3) DEFAULT 'COP'; `variantes` UNIQUE (`producto_id`, `talla`, `color`); `multimedia_producto.tipo` IN ('imagen','video'); `escenas_video.fin_seg` > `inicio_seg` e `inicio_seg` >= 0; `configuracion_tienda` singleton CHECK (`id` = 1)
- [ ] T016 Crear la migración inicial en `backend/alembic/versions/` con tablas, FKs, checks, índices `(producto_id, disponible)`, `(producto_id, orden)` y `(orden)` en `escenas_video`
- [ ] T017 [P] Crear la app FastAPI y CORS con lista blanca en `backend/src/main.py` (solo dominio del frontend y local en desarrollo)
- [ ] T018 [P] Definir esquemas Pydantic v2 de respuesta en `backend/src/presentation/schemas/` según `contracts/openapi.yaml`
- [ ] T019 [P] Crear el cliente HTTP y la configuración pública en `frontend/src/infrastructure/api/client.ts` y `frontend/src/infrastructure/config/env.ts`
- [ ] T020 [P] Definir tipos de dominio del catálogo en `frontend/src/domain/` (`Producto`, `Variante`, `Escena`, `ConfiguracionTienda`)
- [ ] T021 [P] Crear el layout raíz en `frontend/src/app/layout.tsx` con fuentes, metadata y estilos globales
- [ ] T022 [P] Crear estilos base y tokens en `frontend/src/app/globals.css` y `frontend/src/styles/`
- [ ] T023 Crear el script de seed en `backend/scripts/seed.py` con configuración de tienda, 2-3 categorías, 6-10 productos, variantes (incluida una prenda toda no disponible) e imágenes

**Checkpoint**: Infraestructura lista; las historias pueden comenzar en paralelo.

---

## Phase 3: User Story 1 - Recorrer la vitrina en video y saltar a una prenda (Priority: P1) MVP

**Goal**: Video full-screen controlado por scroll con lista sincronizada y salto a la escena de cualquier prenda.

**Independent Test**: Abrir la landing, hacer scroll y verificar que el video avanza, la prenda activa se resalta y tocar una prenda salta a su escena.

### Implementation for User Story 1

- [ ] T024 [P] [US1] Implementar el caso de uso `ObtenerLanding` y su DTO en `backend/src/application/use_cases/obtener_landing.py` (tienda + escenas ordenadas, `agotado` derivado de variantes disponibles, `imagen_principal` = primera imagen por `orden`)
- [ ] T025 [P] [US1] Implementar `LandingRepository` en `backend/src/infrastructure/repositories/landing_repository.py` con query de configuración, escenas y productos
- [ ] T026 [US1] Exponer `GET /landing` en `backend/src/presentation/api/landing.py` y montarlo en `backend/src/main.py`
- [ ] T027 [US1] Obtener los datos de la landing en servidor en `frontend/src/app/page.tsx` (fetch a `NEXT_PUBLIC_API_URL`)
- [ ] T028 [P] [US1] Crear `frontend/src/components/product-list/ProductList.tsx`: lista lateral en escritorio y tira inferior en celular
- [ ] T029 [US1] Crear `frontend/src/components/video-scene/VideoScene.tsx` como componente cliente con sección `sticky` y contenedor de altura según la secuencia
- [ ] T030 [US1] Implementar la sincronización scroll-video con Framer Motion `useScroll` + `requestAnimationFrame` en `frontend/src/application/hooks/useScrollVideo.ts`
- [ ] T031 [US1] Sincronizar el tiempo del video con la prenda activa y el resaltado de la lista en `frontend/src/components/video-scene/VideoScene.tsx`
- [ ] T032 [US1] Implementar el salto por clic desde la lista a la escena de la prenda en `frontend/src/components/product-list/ProductList.tsx`
- [ ] T033 [US1] Configurar el elemento `<video>` con `muted`, `playsInline`, `poster`, `preload="metadata"` y fuente móvil liviana en `frontend/src/components/video-scene/VideoScene.tsx`
- [ ] T034 [US1] Ajustar el comportamiento responsive (lista lateral vs tira inferior, sin scroll horizontal) en `frontend/src/components/`
- [ ] T035 [US1] Manejar scroll rápido y saltos para que la prenda activa siempre corresponda a la escena visible en `frontend/src/application/hooks/useScrollVideo.ts`

**Checkpoint**: US1 funcional y validable de forma independiente.

---

## Phase 4: User Story 2 - Ver el detalle de una prenda y comprar por WhatsApp (Priority: P1)

**Goal**: Detalle completo con selección de talla/color y compra por WhatsApp con mensaje prellenado.

**Independent Test**: Abrir el detalle, elegir talla y color, pulsar "Comprar por WhatsApp" y verificar el mensaje con prenda, talla, color y precio.

### Implementation for User Story 2

- [ ] T036 [P] [US2] Implementar el caso de uso `ObtenerProducto` y su DTO en `backend/src/application/use_cases/obtener_producto.py` (detalle completo y `agotado` derivado)
- [ ] T037 [P] [US2] Implementar `ProductoRepository` en `backend/src/infrastructure/repositories/producto_repository.py`
- [ ] T038 [US2] Exponer `GET /productos/{id}` en `backend/src/presentation/api/productos.py` con `404` cuando no exista
- [ ] T039 [P] [US2] Crear `frontend/src/components/product-detail/ProductDetail.tsx` con fotos, descripción, precio, tallas, colores y cuidado
- [ ] T040 [P] [US2] Crear el selector de variantes en `frontend/src/components/product-detail/VariantSelector.tsx` (variantes no disponibles deshabilitadas)
- [ ] T041 [P] [US2] Implementar el constructor de enlace `wa.me` con mensaje prellenado (prenda, talla, color, precio) en `frontend/src/application/whatsapp/buildWhatsAppUrl.ts`
- [ ] T042 [US2] Crear `frontend/src/components/whatsapp-button/WhatsAppButton.tsx` que se habilita solo con talla y color elegidos
- [ ] T043 [US2] Mostrar "Agotado" en lista y detalle y bloquear la compra en `frontend/src/components/product-list/ProductList.tsx` y `ProductDetail.tsx`
- [ ] T044 [US2] Integrar el detalle como diálogo accesible disparado desde la lista y la escena en `frontend/src/components/product-detail/ProductDetailDialog.tsx`

**Checkpoint**: US1 y US2 funcionan de forma independiente.

---

## Phase 5: User Story 3 - Ver la vitrina sin video o con menos movimiento (Priority: P2)

**Goal**: Fallback estático con imágenes cuando el video falla o se prefiere menos movimiento.

**Independent Test**: Bloquear el video o activar movimiento reducido y verificar la galería estática, la selección y el detalle.

### Implementation for User Story 3

- [ ] T045 [P] [US3] Crear `frontend/src/application/hooks/useReducedMotion.ts` basado en `prefers-reduced-motion`
- [ ] T046 [P] [US3] Detectar el error de carga del video (`onError`/`loadeddata`) y activar el modo estático en `frontend/src/components/video-scene/VideoScene.tsx`
- [ ] T047 [US3] Crear `frontend/src/components/video-scene/StaticGallery.tsx` con `next/image` y las imágenes de las prendas
- [ ] T048 [US3] Garantizar selección y apertura de detalle en modo estático en `frontend/src/components/product-list/ProductList.tsx` y `ProductDetailDialog.tsx`
- [ ] T049 [US3] Desactivar la reproducción y saltar al modo estático cuando `prefers-reduced-motion` está activo en `frontend/src/components/video-scene/VideoScene.tsx`

**Checkpoint**: La experiencia es completa sin video y con movimiento reducido.

---

## Phase 6: User Story 4 - Conocer la marca y resolver dudas (Priority: P3)

**Goal**: Secciones de cierre: sobre nosotros, FAQ, contacto y footer con redes.

**Independent Test**: Llegar al final del scroll y comprobar las secciones y enlaces funcionales.

### Implementation for User Story 4

- [ ] T050 [P] [US4] Crear la sección "Sobre nosotros" en `frontend/src/components/about/AboutSection.tsx`
- [ ] T051 [P] [US4] Crear preguntas frecuentes en `frontend/src/components/faq/FaqSection.tsx` (acordeón accesible)
- [ ] T052 [P] [US4] Crear contacto en `frontend/src/components/contact/ContactSection.tsx` usando WhatsApp, correo y dirección de la tienda
- [ ] T053 [P] [US4] Crear el footer con redes sociales en `frontend/src/components/footer/Footer.tsx`
- [ ] T054 [US4] Componer las secciones de cierre al final de la página en `frontend/src/app/page.tsx`

**Checkpoint**: Las cuatro historias están completas.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras transversales y validación final.

- [ ] T055 [P] Optimizar rendimiento: `sizes` de `next/image`, precarga del video al entrar en viewport y documentar el encoding con keyframes frecuentes en `docs/video-encoding.md`
- [ ] T056 [P] Accesibilidad: `alt` en imágenes, roles `aria` en lista/diálogo, foco visible y anuncio de "Agotado"
- [ ] T057 [P] QA responsive: verificar sin scroll horizontal y con tira inferior usable en celular
- [ ] T058 [P] SEO y metadata social (Open Graph) en `frontend/src/app/layout.tsx`
- [ ] T059 [P] Documentar variables de entorno, migraciones y seed en `README.md` y `docs/`
- [ ] T060 Ejecutar los 7 escenarios de `quickstart.md` y corregir desviaciones

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Phase 1; bloquea todas las historias.
- **User Stories (Phase 3-6)**: dependen de Phase 2; pueden ir en paralelo.
- **Polish (Phase 7)**: depende de las historias deseadas.

### User Story Dependencies

- **US1 (P1)**: inicia tras Phase 2; sin dependencias de otras historias.
- **US2 (P1)**: inicia tras Phase 2; se integra con US1 pero es validable sola.
- **US3 (P2)**: inicia tras Phase 2; reutiliza lista/detalle de US1/US2.
- **US4 (P3)**: inicia tras Phase 2; independiente.

### Within Each User Story

- Dominio → repositorio → caso de uso → endpoint → UI.
- Modelos antes que servicios; servicios antes que endpoints.
- Completar una historia antes de pasar a la siguiente prioridad.

### Parallel Opportunities

- Tareas [P] de Setup y Foundational.
- Tras Phase 2, US1/US2/US3/US4 pueden ir en paralelo si hay equipo.
- Dentro de US2: T039, T040, T041 son paralelizables.
- Dentro de US4: T050-T053 son paralelizables.

---

## Parallel Example: User Story 2

```bash
# Componentes y utilidades en archivos distintos:
Task: "Crear ProductDetail.tsx con fotos, descripción, precio, tallas, colores y cuidado"
Task: "Crear VariantSelector.tsx con variantes no disponibles deshabilitadas"
Task: "Implementar buildWhatsAppUrl.ts con mensaje prellenado"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Phase 1 (Setup).
2. Completar Phase 2 (Foundational).
3. Completar Phase 3 (US1).
4. **STOP and VALIDATE**: probar US1 de forma independiente.
5. Desplegar/demostrar si está listo.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → validar → demo (MVP).
3. US2 → validar → demo (compra por WhatsApp).
4. US3 → validar → demo (sin video / reduced motion).
5. US4 → validar → demo (cierre de marca).

### Parallel Team Strategy

1. Equipo completa Setup + Foundational.
2. Luego: Dev A → US1, Dev B → US2, Dev C → US3 + US4.
3. Integrar y validar por historia.

---

## Notes

- [P] = archivos distintos, sin dependencias.
- [Story] traza la tarea a la historia de usuario.
- Cada historia es independientemente completable y validable.
- No se incluyeron tareas de prueba formales (no solicitadas); el stack de pruebas del plan queda disponible.
- Evitar tareas vagas, conflictos de archivo y dependencias cruzadas que rompan la independencia.
