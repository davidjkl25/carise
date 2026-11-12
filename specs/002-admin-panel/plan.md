# Implementation Plan: Panel de administración de Carise (Fase 1)

**Branch**: `002-admin-panel` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-admin-panel/spec.md`

**Alcance de este plan**: Fase 1 (MVP operativo). Las fases 2 (contenido y video) y 3 (métricas)
se planifican al cerrar esta fase.

## Summary

Panel interno en `/admin` para que la dueña gestione catálogo, precios, variantes,
disponibilidad y datos de la tienda sin tocar SQL ni recompilar. La landing pública y su API de
solo lectura no cambian. La Fase 1 incluye autenticación con sesión, roles básicos, CRUD de
categorías, productos y variantes, publicación/despublicación, configuración de tienda y
auditoría de cada escritura. La multimedia se administra por URL; la carga de archivos y las
escenas de video quedan para la Fase 2. Las métricas quedan para la Fase 3.

Decisiones clave:

- **Mismo monorepo, superficie separada**: el panel vive en `frontend/src/app/admin` y la API de
  administración en `backend/src/presentation/api/admin`, montada bajo `/admin`.
- **Proxy same-origin**: Next.js reescribe `/api/admin/*` hacia el backend para que la cookie de
  sesión sea same-origin y no dependa de CORS ni de cookies de terceros.
- **API pública intacta**: `GET /landing` y `GET /productos/{id}` siguen siendo de solo lectura.
- **Sesiones opacas en base de datos**: token aleatorio en cookie `HttpOnly`; en la base solo se
  guarda su hash, lo que permite revocar sesiones.
- **Auditoría obligatoria**: toda escritura registra actor, entidad, valores antes/después y
  fecha, sin almacenar contraseñas ni tokens.
- **Bloqueo optimista**: las entidades editables incluyen `version` para evitar que dos personas
  se sobrescriban cambios sin aviso.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend, Node 20+), Python 3.12+ (backend)

**Primary Dependencies**:

- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS, `next/font`, `next/image`.
  Sin librería nueva de UI: se reutilizan tokens y componentes existentes.
- Backend: FastAPI, Pydantic v2, SQLAlchemy 2 (async), Alembic, `asyncpg`.
- Nuevas dependencias backend: `argon2-cffi` (hash de contraseñas), `email-validator` (correo),
  `aiosmtplib` (recuperación por correo) y `slowapi` (límite de intentos de login).
- Seguridad de sesión: token opaco con `secrets.token_urlsafe`; en base se guarda SHA-256.

**Storage**: PostgreSQL. La multimedia sigue siendo URLs; no se suben binarios en la Fase 1.

**Testing**:

- Backend: pytest, `httpx.AsyncClient`, pruebas de integración contra PostgreSQL de prueba y
  pruebas de contrato de los endpoints de administración.
- Frontend: Vitest para validaciones y cliente de API; Playwright para el flujo de login y
  edición de precio.

**Target Platform**: Navegadores web modernos; panel optimizado para escritorio con tareas
críticas usables en celular. Servidor Linux.

**Project Type**: Web application (frontend + backend en monorepo, proyectos separados).

**Performance Goals**: respuestas de administración < 300 ms p95; login percibido < 1 s; la
landing pública conserva sus objetivos actuales (API < 200 ms p95, scroll a 60 fps).

**Constraints**:

- La API pública permanece de solo lectura; ninguna escritura sin autenticación.
- Cookie de sesión `HttpOnly`, `Secure` en producción, `SameSite=Lax`, `Path=/`.
- Verificación de `Origin`/`Referer` en métodos de escritura, además de `SameSite`.
- Límite de intentos fallidos de login y bloqueo temporal.
- Auditoría de toda escritura, con datos sensibles redactados.
- Sin datos personales de clientes; solo credenciales del personal autorizado.
- Sin carga de archivos ni métricas en esta fase.

**Scale/Scope**: 1–5 personas administradoras, catálogo de decenas a cientos de prendas, volumen
de escritura bajo. Una sola tienda.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Puerta de cumplimiento | Estado |
|-----------|------------------------|--------|
| I. Vitrina inmersiva (video primero) | La landing y su experiencia de video no se modifican | PASS |
| II. Selección natural y sincronizada | Sin cambios en la lista ni en el salto a prendas | PASS |
| III. Detalle completo | El panel valida los campos obligatorios antes de publicar | PASS |
| IV. Compra por WhatsApp | Único canal de conversión; el panel no agrega pagos ni carrito | PASS |
| V. Degradación elegante | Sin cambios en el fallback estático ni en reduced-motion | PASS |
| VI. Agotado explícito | La disponibilidad por variante sigue derivando `agotado` | PASS |
| VII. Identidad de marca | El panel reutiliza tokens y tipografías existentes | PASS |
| VIII. Móvil primero y rendimiento | La landing no cambia; el panel prioriza escritorio y tareas críticas en móvil | PASS |
| IX. Experiencia de cliente sin cuentas | Enmendado en v1.1.0: clientes sin cuentas; panel interno permitido | PASS |
| X. Administración segura y auditable | Auth, autorización, API pública read-only y auditoría en el diseño | PASS |

**Resultado**: Sin violaciones. La enmienda v1.1.0 ya está ratificada en
`.specify/memory/constitution.md`; no se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-panel/
├── spec.md              # Especificación (existe)
├── plan.md              # Este archivo
└── tasks.md             # Generado a partir de este plan
```

`data-model.md`, `contracts/` y `quickstart.md` se pueden generar al iniciar la implementación si
se requiere el detalle formal; este plan ya fija las tablas, endpoints y flujos de la Fase 1.

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── usuario_admin.py
│   │   │   ├── rol.py
│   │   │   ├── sesion_admin.py
│   │   │   └── registro_auditoria.py
│   │   ├── value_objects/
│   │   │   └── slug.py
│   │   └── repositories/
│   │       ├── usuario_admin_repository.py
│   │       ├── sesion_admin_repository.py
│   │       └── auditoria_repository.py
│   ├── application/
│   │   ├── use_cases/admin/
│   │   │   ├── iniciar_sesion.py
│   │   │   ├── cerrar_sesion.py
│   │   │   ├── recuperar_contrasena.py
│   │   │   ├── listar_productos.py
│   │   │   ├── crear_producto.py
│   │   │   ├── actualizar_producto.py
│   │   │   ├── publicar_producto.py
│   │   │   ├── eliminar_producto.py
│   │   │   ├── gestionar_variantes.py
│   │   │   ├── gestionar_categorias.py
│   │   │   └── actualizar_configuracion.py
│   │   └── dto/admin/
│   │       ├── auth.py
│   │       ├── producto.py
│   │       ├── variante.py
│   │       ├── categoria.py
│   │       └── configuracion.py
│   ├── infrastructure/
│   │   ├── models/
│   │   │   └── admin.py
│   │   ├── repositories/
│   │   │   └── admin_repositories.py
│   │   └── security/
│   │       ├── passwords.py
│   │       ├── sessions.py
│   │       └── csrf.py
│   ├── presentation/
│   │   ├── api/admin/
│   │   │   ├── auth.py
│   │   │   ├── productos.py
│   │   │   ├── variantes.py
│   │   │   ├── categorias.py
│   │   │   ├── configuracion.py
│   │   │   └── auditoria.py
│   │   ├── dependencies/
│   │   │   └── auth.py
│   │   └── schemas/admin/
│   │       ├── requests.py
│   │       └── responses.py
│   └── main.py                    # monta el router admin y sus middlewares
├── alembic/versions/
│   └── 0002_admin_panel.py
├── scripts/
│   ├── create_admin.py            # alta inicial idempotente
│   └── reset_admin_password.py    # recuperación por consola
└── tests/
    ├── unit/admin/
    ├── integration/admin/
    └── contract/admin/

frontend/
├── src/
│   ├── app/
│   │   └── admin/
│   │       ├── layout.tsx         # shell, navegación y guardia de sesión
│   │       ├── page.tsx           # tablero con accesos rápidos
│   │       ├── login/page.tsx
│   │       ├── recuperar/page.tsx
│   │       ├── productos/page.tsx
│   │       ├── productos/[id]/page.tsx
│   │       ├── categorias/page.tsx
│   │       ├── configuracion/page.tsx
│   │       └── auditoria/page.tsx
│   ├── components/admin/
│   │   ├── AdminShell.tsx
│   │   ├── ProductForm.tsx
│   │   ├── VariantEditor.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── StoreConfigForm.tsx
│   │   └── AuditTable.tsx
│   ├── application/admin/
│   │   ├── adminClient.ts         # fetch same-origin con credenciales
│   │   └── validation.ts
│   ├── domain/admin/
│   │   └── types.ts
│   └── middleware.ts              # redirige /admin sin cookie al login
├── tests/
│   ├── unit/admin/
│   └── e2e/admin.spec.ts
├── next.config.ts                 # rewrite /api/admin/* → backend /admin/*
└── .env.example                   # API_INTERNAL_URL
```

**Structure Decision**: se conserva el monorepo y la Clean Architecture existente. El panel es
una superficie de presentación nueva: routers y casos de uso de administración en el backend,
route group `admin` en el frontend. La landing y sus componentes no se tocan salvo para
confirmar que sigue leyendo datos frescos.

## Diseño de la Fase 1

### 1. Autenticación y sesión

- Login con correo y contraseña. Hash con Argon2id (`argon2-cffi`).
- Token de sesión opaco (`secrets.token_urlsafe(32)`); se guarda `sha256(token)` en
  `sesiones_admin`. Cookie `carise_admin_session` con `HttpOnly`, `SameSite=Lax`, `Secure` en
  producción, `Path=/`, expiración absoluta de 8 h y renovación por actividad.
- `POST /admin/auth/login`, `POST /admin/auth/logout`, `GET /admin/auth/me`.
- Recuperación: `POST /admin/auth/password-reset/request` (siempre 202 para no revelar cuentas) y
  `POST /admin/auth/password-reset/confirm`. Token de un solo uso con expiración de 30 min.
- Límite de intentos: 5 fallos por correo+IP en 15 min; bloqueo temporal y evento de auditoría.
- Autorización por rol en el servidor: `administrador`, `editor`, `lector`. La Fase 1 crea el rol
  administrador; los otros quedan sembrados para uso futuro.
- Verificación de `Origin`/`Referer` en `POST`, `PATCH`, `PUT` y `DELETE`; `SameSite=Lax` como
  segunda barrera. No se requiere token CSRF adicional en la Fase 1, pero la dependencia queda
  preparada para agregarlo.

### 2. Modelo de datos (migración `0002_admin_panel`)

Nuevas tablas:

```text
roles
  id smallint PK, nombre varchar(40) UNIQUE, descripcion varchar(160), created_at timestamptz

usuarios_admin
  id bigint PK, nombre varchar(120), email varchar(160) UNIQUE, password_hash text,
  rol_id smallint FK → roles.id, activo boolean DEFAULT true,
  ultimo_acceso timestamptz NULL, created_at timestamptz, updated_at timestamptz

sesiones_admin
  id bigint PK, usuario_id bigint FK → usuarios_admin.id ON DELETE CASCADE,
  token_hash char(64) UNIQUE, expira_at timestamptz, created_at timestamptz,
  ip varchar(45) NULL, user_agent varchar(255) NULL

reset_tokens_admin
  id bigint PK, usuario_id bigint FK → usuarios_admin.id ON DELETE CASCADE,
  token_hash char(64) UNIQUE, expira_at timestamptz, usado boolean DEFAULT false,
  created_at timestamptz

auditoria
  id bigint PK, usuario_id bigint NULL FK → usuarios_admin.id ON DELETE SET NULL,
  accion varchar(40), entidad varchar(40), entidad_id varchar(64) NULL,
  datos_antes jsonb NULL, datos_despues jsonb NULL, ip varchar(45) NULL,
  created_at timestamptz
```

Cambios a tablas existentes:

- `productos`: agregar `version integer NOT NULL DEFAULT 1`.
- `variantes`: agregar `version integer NOT NULL DEFAULT 1` y `updated_at timestamptz`.
- `categorias`: agregar `activo boolean NOT NULL DEFAULT true`, `version integer NOT NULL
  DEFAULT 1` y `updated_at timestamptz`.
- `configuracion_tienda`: agregar `version integer NOT NULL DEFAULT 1`.

Índices: `sesiones_admin(token_hash)`, `sesiones_admin(expira_at)`,
`auditoria(entidad, entidad_id, created_at)`, `auditoria(usuario_id, created_at)`.

Reglas: el correo se normaliza a minúsculas; el slug se genera desde el nombre si no se informa
(minúsculas, sin acentos, guiones) y ante duplicado se agrega sufijo numérico determinista. Las
contraseñas nunca se guardan en claro ni se incluyen en auditoría.

### 3. API de administración (Fase 1)

Base en el backend: `/admin`. El frontend la consume como `/api/admin/*` mediante rewrite
same-origin.

| Método | Ruta | Propósito |
|--------|------|-----------|
| POST | `/admin/auth/login` | Iniciar sesión y emitir cookie |
| POST | `/admin/auth/logout` | Cerrar sesión y revocar token |
| GET | `/admin/auth/me` | Usuario, rol y permisos de la sesión |
| POST | `/admin/auth/password-reset/request` | Solicitar recuperación |
| POST | `/admin/auth/password-reset/confirm` | Confirmar nueva contraseña |
| GET | `/admin/categorias` | Listar categorías |
| POST | `/admin/categorias` | Crear categoría |
| PATCH | `/admin/categorias/{id}` | Editar u ordenar categoría |
| DELETE | `/admin/categorias/{id}` | Eliminar si no tiene productos |
| GET | `/admin/productos` | Listar con filtros y paginación |
| POST | `/admin/productos` | Crear producto |
| GET | `/admin/productos/{id}` | Detalle editable |
| PATCH | `/admin/productos/{id}` | Editar con `version` (409 si cambió) |
| POST | `/admin/productos/{id}/publicar` | Publicar |
| POST | `/admin/productos/{id}/despublicar` | Despublicar |
| DELETE | `/admin/productos/{id}?confirm=true` | Borrado definitivo explícito |
| GET | `/admin/productos/{id}/variantes` | Listar variantes |
| POST | `/admin/productos/{id}/variantes` | Crear variante |
| PATCH | `/admin/variantes/{id}` | Editar talla/color/disponibilidad |
| DELETE | `/admin/variantes/{id}` | Eliminar variante |
| GET | `/admin/configuracion` | Leer configuración de tienda |
| PUT | `/admin/configuracion` | Actualizar configuración con `version` |
| GET | `/admin/auditoria` | Consultar auditoría paginada |

Códigos: `200/201/204` éxito; `400` regla de negocio; `401` sin sesión; `403` sin permiso; `404`
no existe; `409` conflicto de versión o duplicado; `422` validación de esquema; `429` límite de
intentos.

La API pública (`/landing`, `/productos/{id}`) no se modifica. El CORS actual sigue limitado a
`GET`; el panel usa el proxy same-origin, por lo que no se habilitan credenciales CORS.

### 4. Reglas de negocio

- Publicar exige nombre, slug, categoría, descripción, precio, moneda, cuidado, al menos una
  imagen y al menos una variante. Si falta algo, `400` con detalle por campo.
- Precio `>= 0` con dos decimales; moneda ISO de 3 letras; WhatsApp solo dígitos en formato
  internacional; URLs `https` (o `/media/...` para los assets locales existentes).
- Variante única por (`producto_id`, `talla`, `color`); duplicado devuelve `409`.
- `agotado` se calcula, no se edita: sin variantes o con todas no disponibles.
- Despublicar conserva datos y variantes; el borrado definitivo exige `confirm=true` y elimina en
  cascada variantes, multimedia y escenas.
- Bloqueo optimista: `PATCH`/`PUT` reciben `version`; si no coincide, `409` con el estado actual
  para que la persona recargue.
- Toda escritura genera un registro de auditoría con valores antes/después; se redactan
  `password_hash` y tokens.

### 5. Frontend del panel

- Route group `admin` con `layout.tsx` que valida sesión contra `/api/admin/auth/me` y redirige a
  `/admin/login` si no hay sesión. `middleware.ts` hace una comprobación temprana de la cookie
  para evitar parpadeos; la autorización real siempre es del backend.
- Pantallas: login, recuperación, tablero, productos (lista + formulario), variantes dentro del
  producto, categorías, configuración y auditoría.
- Formularios con validación en cliente para retroalimentación y validación de servidor como
  fuente de verdad. Errores `409` muestran un aviso de conflicto con opción de recargar.
- Reutiliza los tokens de `frontend/src/styles/tokens.css` y la tipografía existente; no se
  modifica la landing.
- Tras una escritura exitosa, el panel refresca sus datos. La landing usa `cache: "no-store"` en
  su cliente actual, por lo que la siguiente carga ya ve los cambios; si en el futuro se agrega
  caché, se revalidará la ruta `/` tras cada escritura.

### 6. Migración, datos iniciales y operación

- `alembic upgrade head` aplica `0002_admin_panel`.
- `python scripts/create_admin.py` crea roles y el primer administrador de forma idempotente,
  leyendo `ADMIN_BOOTSTRAP_EMAIL` y `ADMIN_BOOTSTRAP_PASSWORD` o pidiéndolos de forma interactiva.
- `python scripts/reset_admin_password.py` permite recuperar acceso por consola si el correo no
  está configurado.
- Variables nuevas en `backend/.env.example`: `ADMIN_ENABLED`, `ADMIN_SESSION_TTL_MINUTES`,
  `ADMIN_RESET_TOKEN_TTL_MINUTES`, `ADMIN_COOKIE_SECURE`, `ADMIN_BOOTSTRAP_EMAIL`,
  `ADMIN_BOOTSTRAP_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`,
  `SMTP_FROM`, `PUBLIC_APP_URL`.
- Variable nueva en `frontend/.env.example`: `API_INTERNAL_URL` (por defecto
  `http://127.0.0.1:8000`), usada solo por el rewrite del servidor.

### 7. Estrategia de pruebas

- **Unitarias backend**: hash/verificación de contraseña, generación y hash de tokens, slug,
  regla de publicación y bloqueo optimista.
- **Integración backend**: login/logout/me, 401 sin cookie, 403 por rol, CRUD de productos y
  variantes, duplicado `409`, conflicto de versión `409`, auditoría creada, límite de intentos.
- **Contrato**: rutas y códigos de la tabla anterior contra la app FastAPI.
- **Frontend unitarias**: validaciones de formulario y mapeo de errores del cliente admin.
- **E2E**: login → cambiar precio → ver el nuevo precio en la landing; marcar todas las
  variantes como no disponibles → ver "Agotado"; intentar `/admin` sin sesión → login.
- **Regresión**: `GET /landing` y `GET /productos/{id}` conservan su contrato y la landing sigue
  funcionando sin sesión.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Cookie bloqueada por CORS o `SameSite` | Proxy same-origin `/api/admin/*` y pruebas de login en navegador |
| Bloqueo fuera del panel | Script de recuperación por consola y correo de recuperación |
| Pérdida de datos por borrado | Desactivar por defecto, confirmación explícita, auditoría y respaldos |
| Dos personas sobrescriben cambios | `version` + `409` con estado actual |
| Fuga de credenciales en logs/auditoría | Redacción de campos sensibles y pruebas específicas |
| Crecimiento del alcance | Fases cerradas: sin uploads ni métricas en Fase 1 |

## Complexity Tracking

Sin violaciones constitucionales; no aplica.
