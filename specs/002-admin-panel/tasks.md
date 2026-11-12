# Tasks: Panel de administración de Carise (Fase 1)

**Input**: Design documents from `/specs/002-admin-panel/`

**Prerequisites**: `plan.md`, `spec.md`

**Alcance**: Fase 1 (MVP operativo). Las tareas de multimedia/video (Fase 2) y métricas (Fase 3)
no se incluyen aquí.

**Tests**: se incluyen como parte de la calidad del panel porque maneja autenticación y
escrituras del negocio. Escribir las pruebas antes de la implementación correspondiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[Story]**: historia de `spec.md` a la que pertenece la tarea (`US1`, `US2`, `US3`, `US5`)
- Las rutas son relativas a la raíz del repositorio

## Path Conventions

- Backend: `backend/src/`, `backend/tests/`, `backend/alembic/`, `backend/scripts/`
- Frontend: `frontend/src/`, `frontend/tests/`
- Documentación: `specs/002-admin-panel/`, `README.md`, `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar dependencias, configuración y esqueletos del panel.

- [ ] T001 Agregar dependencias backend en `backend/pyproject.toml`: `argon2-cffi`,
  `email-validator`, `aiosmtplib`, `slowapi`; actualizar `backend/uv.lock` con `uv lock`.
- [ ] T002 [P] Extender `backend/src/infrastructure/config/settings.py` con variables de
  administración (`admin_enabled`, TTL de sesión y reset, cookie segura, bootstrap y SMTP).
- [ ] T003 [P] Documentar las variables nuevas en `backend/.env.example`.
- [ ] T004 [P] Agregar `API_INTERNAL_URL` en `frontend/.env.example` y el rewrite
  `/api/admin/:path*` → `${API_INTERNAL_URL}/admin/:path*` en `frontend/next.config.ts`.
- [ ] T005 [P] Crear `frontend/src/middleware.ts` para redirigir `/admin/*` sin cookie de sesión
  a `/admin/login` (la autorización real queda en el backend).
- [ ] T006 [P] Crear el esqueleto del route group `frontend/src/app/admin/` con `layout.tsx`,
  `page.tsx`, `login/page.tsx`, `productos/page.tsx`, `categorias/page.tsx`,
  `configuracion/page.tsx` y `auditoria/page.tsx`.
- [ ] T007 [P] Crear directorios y fixtures base de pruebas en
  `backend/tests/{unit,integration,contract}/admin/` y `frontend/tests/{unit,e2e}/admin/`.

**Checkpoint**: dependencias y esqueletos listos.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: infraestructura que debe existir antes de cualquier historia.

**⚠️ CRITICAL**: ninguna historia puede comenzar hasta completar esta fase.

- [ ] T008 Crear la migración `backend/alembic/versions/0002_admin_panel.py` con las tablas
  `roles`, `usuarios_admin`, `sesiones_admin`, `reset_tokens_admin` y `auditoria`, y las columnas
  `version`, `activo` y `updated_at` definidas en `plan.md`.
- [ ] T009 [P] Crear los modelos SQLAlchemy en `backend/src/infrastructure/models/admin.py`.
- [ ] T010 [P] Crear entidades de dominio en `backend/src/domain/entities/`:
  `usuario_admin.py`, `rol.py`, `sesion_admin.py`, `registro_auditoria.py`.
- [ ] T011 [P] Crear el value object `backend/src/domain/value_objects/slug.py` con
  normalización, generación y resolución determinista de duplicados.
- [ ] T012 [P] Definir interfaces de repositorio en
  `backend/src/domain/repositories/{usuario_admin_repository,sesion_admin_repository,auditoria_repository}.py`.
- [ ] T013 [P] Implementar repositorios en
  `backend/src/infrastructure/repositories/admin_repositories.py`.
- [ ] T014 [P] Implementar `backend/src/infrastructure/security/passwords.py` con Argon2id
  (hash y verificación).
- [ ] T015 [P] Implementar `backend/src/infrastructure/security/sessions.py` (token opaco,
  SHA-256, cookie `HttpOnly`/`SameSite=Lax`/`Secure` configurable y expiración).
- [ ] T016 [P] Implementar `backend/src/infrastructure/security/csrf.py` con verificación de
  `Origin`/`Referer` para métodos de escritura.
- [ ] T017 Implementar la dependencia `get_current_admin` y el guard de roles en
  `backend/src/presentation/dependencies/auth.py` (depende de T012–T015).
- [ ] T018 Implementar el servicio de auditoría con redacción de campos sensibles en
  `backend/src/application/use_cases/admin/auditar.py` o `backend/src/infrastructure/audit.py`
  (depende de T013).
- [ ] T019 Crear el router base de administración en `backend/src/presentation/api/admin/__init__.py`
  y montarlo en `backend/src/main.py` bajo `/admin` (sin tocar las rutas públicas).
- [ ] T020 Crear `backend/scripts/create_admin.py` (roles + primer administrador idempotente) y
  `backend/scripts/reset_admin_password.py`.
- [ ] T021 [P] Crear `frontend/src/domain/admin/types.ts` con tipos de usuario, producto,
  variante, categoría, configuración y errores.
- [ ] T022 [P] Crear `frontend/src/application/admin/adminClient.ts` con `fetch` same-origin,
  `credentials: "include"`, mapeo de `401/403/409/422/429` y errores legibles.
- [ ] T023 [P] Crear `frontend/src/application/admin/validation.ts` con validaciones de precio,
  WhatsApp, URLs y campos obligatorios.
- [ ] T024 Crear `frontend/src/components/admin/AdminShell.tsx` y usarlo en
  `frontend/src/app/admin/layout.tsx` con navegación y cierre de sesión.
- [ ] T025 [P] Crear componentes base reutilizables del panel (tabla, campo de formulario,
  diálogo de confirmación) en `frontend/src/components/admin/`, reutilizando tokens de
  `frontend/src/styles/tokens.css`.
- [ ] T026 Configurar fixtures de pruebas: base de datos de prueba, cliente admin autenticado y
  datos mínimos en `backend/tests/integration/admin/conftest.py`.

**Checkpoint**: base de datos, seguridad, auditoría, router y shell listos. Las historias pueden
comenzar.

---

## Phase 3: User Story 1 - Entrar al panel de forma segura (Priority: P1) 🎯 MVP

**Goal**: login, sesión, logout y recuperación de acceso con auditoría y límite de intentos.

**Independent Test**: abrir `/admin` sin sesión y comprobar redirección; iniciar sesión, ver el
tablero y cerrar sesión; verificar bloqueo tras intentos fallidos.

### Tests for User Story 1

- [ ] T027 [P] [US1] Pruebas unitarias de hash/verificación y tokens en
  `backend/tests/unit/admin/test_passwords_sessions.py`.
- [ ] T028 [P] [US1] Pruebas de integración de login, logout, `me`, cookie y `401` en
  `backend/tests/integration/admin/test_auth.py`.
- [ ] T029 [P] [US1] Prueba de integración de límite de intentos y bloqueo en
  `backend/tests/integration/admin/test_auth_rate_limit.py`.
- [ ] T030 [P] [US1] Prueba e2e de login/logout en `frontend/tests/e2e/admin/auth.spec.ts`.

### Implementation for User Story 1

- [ ] T031 [US1] Implementar casos de uso `iniciar_sesion.py`, `cerrar_sesion.py` y
  `recuperar_contrasena.py` en `backend/src/application/use_cases/admin/`.
- [ ] T032 [US1] Crear DTOs y esquemas de auth en
  `backend/src/application/dto/admin/auth.py` y `backend/src/presentation/schemas/admin/requests.py`.
- [ ] T033 [US1] Implementar `backend/src/presentation/api/admin/auth.py` con login, logout, me,
  solicitud y confirmación de recuperación.
- [ ] T034 [US1] Integrar `slowapi` para limitar intentos fallidos y registrar eventos de
  seguridad en auditoría.
- [ ] T035 [US1] Implementar `frontend/src/app/admin/login/page.tsx` con formulario, errores y
  estados de carga.
- [ ] T036 [US1] Implementar `frontend/src/app/admin/recuperar/page.tsx` (solicitud y
  confirmación por token).
- [ ] T037 [US1] Implementar cierre de sesión y datos de sesión en `AdminShell.tsx`.

**Checkpoint**: el panel solo es accesible con sesión válida y el acceso queda auditado.

---

## Phase 4: User Story 2 - Administrar el catálogo y los precios (Priority: P1)

**Goal**: CRUD de categorías y productos, precio, publicación/despublicación y orden.

**Independent Test**: crear una prenda completa, publicarla, verla en la landing, cambiar el
precio, despublicarla y comprobar que desaparece sin recompilar.

### Tests for User Story 2

- [ ] T038 [P] [US2] Pruebas de integración de CRUD de productos, publicación, validaciones,
  `409` de versión y auditoría en `backend/tests/integration/admin/test_productos.py`.
- [ ] T039 [P] [US2] Pruebas unitarias de slug y regla de publicación en
  `backend/tests/unit/admin/test_producto_rules.py`.
- [ ] T040 [P] [US2] Pruebas de integración de categorías y borrado con productos en
  `backend/tests/integration/admin/test_categorias.py`.
- [ ] T041 [P] [US2] Prueba e2e de cambio de precio visible en la landing en
  `frontend/tests/e2e/admin/productos.spec.ts`.

### Implementation for User Story 2

- [ ] T042 [US2] Crear DTOs y esquemas de producto/categoría en
  `backend/src/application/dto/admin/{producto,categoria}.py` y
  `backend/src/presentation/schemas/admin/requests.py`.
- [ ] T043 [US2] Implementar casos de uso `listar_productos.py`, `crear_producto.py`,
  `actualizar_producto.py`, `publicar_producto.py`, `eliminar_producto.py` y
  `gestionar_categorias.py` en `backend/src/application/use_cases/admin/`.
- [ ] T044 [US2] Implementar los routers `productos.py` y `categorias.py` en
  `backend/src/presentation/api/admin/`.
- [ ] T045 [US2] Implementar la lista de productos con filtros y paginación en
  `frontend/src/app/admin/productos/page.tsx`.
- [ ] T046 [US2] Implementar el formulario de producto (crear/editar, precio, publicación,
  orden, imagen por URL) en `frontend/src/app/admin/productos/[id]/page.tsx` y
  `frontend/src/components/admin/ProductForm.tsx`.
- [ ] T047 [US2] Implementar la página de categorías en
  `frontend/src/app/admin/categorias/page.tsx` y `frontend/src/components/admin/CategoryForm.tsx`.
- [ ] T048 [US2] Manejar `409` de versión en el formulario con aviso de conflicto y recarga del
  estado actual.

**Checkpoint**: la dueña puede operar el catálogo y los precios sin ayuda técnica.

---

## Phase 5: User Story 3 - Administrar variantes, tallas, colores y agotados (Priority: P1)

**Goal**: CRUD de variantes, disponibilidad y estado "Agotado" automático.

**Independent Test**: agregar tallas/colores, marcar todas como no disponibles y comprobar
"Agotado" y bloqueo de compra en la landing.

### Tests for User Story 3

- [ ] T049 [P] [US3] Pruebas de integración de variantes, duplicado `409`, disponibilidad y
  `agotado` derivado en `backend/tests/integration/admin/test_variantes.py`.
- [ ] T050 [P] [US3] Prueba e2e de marcar agotado y verlo en la landing en
  `frontend/tests/e2e/admin/variantes.spec.ts`.

### Implementation for User Story 3

- [ ] T051 [US3] Implementar DTOs y esquemas de variante en
  `backend/src/application/dto/admin/variante.py` y
  `backend/src/presentation/schemas/admin/requests.py`.
- [ ] T052 [US3] Implementar el caso de uso `gestionar_variantes.py` con validación de
  combinación única y disponibilidad.
- [ ] T053 [US3] Implementar `backend/src/presentation/api/admin/variantes.py` con listar, crear,
  editar y eliminar.
- [ ] T054 [US3] Implementar `frontend/src/components/admin/VariantEditor.tsx` dentro del
  formulario de producto, con talla, color, disponibilidad y eliminación confirmada.
- [ ] T055 [US3] Mostrar en el formulario el estado derivado "Agotado" cuando no queden variantes
  disponibles.

**Checkpoint**: la disponibilidad se administra y la landing refleja "Agotado" correctamente.

---

## Phase 6: User Story 5 - Actualizar la información de la tienda (Priority: P2)

**Goal**: editar WhatsApp, correo, dirección y URLs de video de la landing.

**Independent Test**: cambiar el WhatsApp en el panel y comprobar que el botón de compra de la
landing abre el nuevo número.

### Tests for User Story 5

- [ ] T056 [P] [US5] Pruebas de integración de `GET/PUT /admin/configuracion`, validaciones y
  auditoría en `backend/tests/integration/admin/test_configuracion.py`.
- [ ] T057 [P] [US5] Prueba e2e de cambio de WhatsApp reflejado en la landing en
  `frontend/tests/e2e/admin/configuracion.spec.ts`.

### Implementation for User Story 5

- [ ] T058 [US5] Implementar el caso de uso `actualizar_configuracion.py`, DTOs y esquemas con
  validación de WhatsApp y URLs.
- [ ] T059 [US5] Implementar `backend/src/presentation/api/admin/configuracion.py` con `GET` y
  `PUT` y bloqueo optimista.
- [ ] T060 [US5] Implementar `frontend/src/app/admin/configuracion/page.tsx` y
  `frontend/src/components/admin/StoreConfigForm.tsx`.

**Checkpoint**: la dueña actualiza los datos de contacto y la landing los usa.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: auditoría visible, seguridad, documentación y validación final.

- [ ] T061 [P] Implementar `GET /admin/auditoria` y la página
  `frontend/src/app/admin/auditoria/page.tsx` con filtros por entidad y fecha.
- [ ] T062 [P] Endurecer seguridad: flags de cookie por entorno, verificación de `Origin`,
  cabeceras de seguridad, redacción de secretos y límites de tasa.
- [ ] T063 [P] Actualizar `README.md` con acceso al panel, variables de entorno, migración y
  scripts de administración.
- [ ] T064 [P] Agregar escenarios del panel a `specs/002-admin-panel/quickstart.md` o al
  `quickstart.md` de la landing.
- [ ] T065 Ejecutar `uv run pytest`, `uv run ruff check .` y `uv run mypy src` en `backend/`.
- [ ] T066 Ejecutar `npx tsc --noEmit`, `npm run lint`, `npm run test` y `npm run build` en
  `frontend/`.
- [ ] T067 Verificar la regresión de la API pública (`GET /landing`, `GET /productos/{id}`) y de
  la landing sin sesión.
- [ ] T068 Validar manualmente el criterio de salida de la Fase 1: operar catálogo, precios,
  variantes y configuración sin ayuda técnica.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup y bloquea todas las historias.
- **US1 (Phase 3)**: depende de Foundational; habilita el acceso al panel.
- **US2 (Phase 4)**: depende de Foundational y de US1 para autenticación en la interfaz.
- **US3 (Phase 5)**: depende de US2 (necesita producto existente).
- **US5 (Phase 6)**: depende de US1; puede hacerse en paralelo con US2/US3 si hay capacidad.
- **Polish (Phase 7)**: depende de las historias incluidas en la Fase 1.

### Within Each User Story

- Pruebas primero y deben fallar antes de implementar.
- Modelos/DTOs antes de casos de uso.
- Casos de uso antes de routers.
- Routers antes de la interfaz.
- Cierre de historia antes de pasar a la siguiente prioridad.

### Parallel Opportunities

- T002–T007 pueden ir en paralelo.
- T009–T016 pueden ir en paralelo (modelos, entidades, repositorios y seguridad).
- T021–T025 pueden ir en paralelo (tipos, cliente, validaciones y componentes base).
- Las pruebas marcadas `[P]` de cada historia pueden ejecutarse en paralelo.
- US5 puede avanzar en paralelo con US2/US3 una vez completada US1.

---

## Implementation Strategy

### MVP First

1. Completar Fase 1 (Setup).
2. Completar Fase 2 (Foundational).
3. Completar US1 (auth).
4. Completar US2 (catálogo y precios).
5. Completar US3 (variantes y agotados).
6. Completar US5 (configuración).
7. Validar el criterio de salida de la Fase 1 y desplegar.

### Incremental Delivery

1. Auth + shell → el panel existe y es seguro.
2. Catálogo y precios → la dueña opera sin SQL.
3. Variantes y agotados → la disponibilidad queda al día.
4. Configuración → los datos de contacto se actualizan sin código.
5. Auditoría y endurecimiento → operación confiable.

### Futuras fases

- **Fase 2**: carga de archivos, multimedia, escenas de video y poster.
- **Fase 3**: métricas agregadas de vistas y clics de WhatsApp.

---

## Notes

- `[P]` indica archivos distintos sin dependencias.
- Cada historia debe quedar independientemente probable y demostrable.
- No modificar la API pública ni la experiencia de la landing.
- No incluir secretos ni contraseñas en el repositorio.
- Hacer commit por tarea o grupo lógico.
