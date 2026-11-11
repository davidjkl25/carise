# Carise

Landing inmersiva para la tienda de ropa Carise. El frontend reproduce una vitrina en video que
avanza con el scroll, permite abrir el detalle de cada prenda y cerrar la compra por WhatsApp. El
backend expone una API pública de solo lectura con la tienda, las escenas y el detalle de producto.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, next/image.
- **Backend:** FastAPI, SQLAlchemy async, Alembic, Pydantic Settings.
- **Base de datos:** PostgreSQL 16+.
- **Gestión Python:** `uv`.

## Estructura

```text
frontend/   Aplicación Next.js (landing, componentes y assets de marca)
backend/    API FastAPI, modelos, migraciones y seed
docs/       Guías de operación (encoding de video, marca)
specs/      Especificación, contrato OpenAPI y quickstart del proyecto
```

## Requisitos

- Node.js 20+ y npm.
- Python 3.12+ y `uv`.
- PostgreSQL 16+ (local o Docker).

## Backend

### 1. Variables de entorno

```bash
cd backend
cp .env.example .env
```

| Variable           | Descripción                                 | Ejemplo                                                    |
| ------------------ | ------------------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`     | Cadena async de SQLAlchemy hacia PostgreSQL | `postgresql+asyncpg://carise:carise@localhost:5432/carise` |
| `CORS_ORIGINS`     | Orígenes permitidos, separados por coma     | `http://localhost:3000,http://127.0.0.1:3000`              |
| `WHATSAPP_DEFAULT` | Número de WhatsApp de respaldo              | `573001234567`                                             |

Si PostgreSQL corre en otro puerto, actualiza `DATABASE_URL` (por ejemplo `localhost:5433`).

### 2. Base de datos

Con Docker:

```bash
docker run --name carise-db \
  -e POSTGRES_USER=carise \
  -e POSTGRES_PASSWORD=carise \
  -e POSTGRES_DB=carise \
  -p 5432:5432 \
  -d postgres:16
```

O crea manualmente la base y el usuario equivalentes en tu PostgreSQL local.

### 3. Dependencias, migraciones y seed

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run python scripts/seed.py
```

El seed es idempotente: si ya existe la configuración de la tienda, no vuelve a insertar datos.

### 4. Servidor

```bash
uv run uvicorn src.main:app --reload --port 8000
```

- API: `http://localhost:8000`
- Documentación interactiva: `http://localhost:8000/docs`

### Migraciones

```bash
uv run alembic revision --autogenerate -m "descripcion_del_cambio"
uv run alembic upgrade head
uv run alembic downgrade -1
```

## Frontend

### 1. Variables de entorno

```bash
cd frontend
cp .env.example .env.local
```

| Variable               | Descripción                                    | Ejemplo                 |
| ---------------------- | ---------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`  | URL base del backend                           | `http://localhost:8000` |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (canonical y Open Graph) | `http://localhost:3000` |

### 2. Instalación y desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

### 3. Build de producción

```bash
npm run build
npm run start
```

### 4. Calidad

```bash
npx tsc --noEmit
npm run lint
npm run format:check
```

## Marca

El manual de marca vive fuera del repositorio. Los assets derivados están en
`frontend/public/brand/`:

- `monogram.svg` / `monogram-light.svg`: símbolo caligráfico.
- `wordmark.svg` / `wordmark-light.svg`: logotipo “Carise”.
- `logo.svg` / `logo-light.svg`: lockup horizontal.
- `favicon.svg`, `placeholder.svg` y `og-image.png`.

Paleta: marrón `#442F2A`, blush `#F5CBD7`, crema `#FFF7EC`, bubble pink `#F1D2DF`, sky whip
`#8F939A`. Tipografías: Fraunces y Myriad Pro para texto, Mea Culpa para acentos caligráficos.
Ver [docs/brand.md](docs/brand.md).

## Documentación

- [Quickstart y escenarios de validación](specs/001-immersive-storefront/quickstart.md)
- [Contrato de API](specs/001-immersive-storefront/contracts/openapi.yaml)
- [Guía de encoding de video](docs/video-encoding.md)
- [Guía de marca](docs/brand.md)

## Estado de pruebas

Las carpetas `backend/tests/` y `frontend/tests/` están preparadas para pruebas unitarias,
integración y e2e, pero todavía no contienen suites automatizadas. La validación actual se realiza
con los escenarios de `quickstart.md`.
