# Quickstart: Landing inmersiva de Carise

Guía de validación de extremo a extremo. No contiene implementación; el detalle de tareas vive en
`tasks.md` y los contratos en [contracts/openapi.yaml](./contracts/openapi.yaml).

## Prerrequisitos

- Node.js 20+ y un gestor de paquetes (npm/pnpm).
- Python 3.12+ y `uv`.
- PostgreSQL 16+ o Docker para levantar la base.
- Acceso a las URLs del video e imágenes (CDN) o archivos locales para pruebas.

## Configuración

Variables de entorno (ver `.env.example` de cada proyecto):

- Backend: `DATABASE_URL`, `CORS_ORIGINS` (dominio del frontend), `WHATSAPP_DEFAULT`.
- Frontend: `NEXT_PUBLIC_API_URL`.

## Puesta en marcha

Backend:

```bash
cd backend
uv sync
alembic upgrade head
# cargar datos de ejemplo (seed)
uvicorn src.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Escenarios de validación

### 1. Vitrina con video y scroll (US1)

1. Abrir la landing en escritorio.
2. Hacer scroll lentamente por la secuencia.
3. Verificar que el video avanza y que la prenda mostrada se resalta en la lista lateral.
4. Hacer clic en una prenda de la lista y verificar que el video salta a su escena.
5. Repetir en ancho de celular y verificar la tira inferior y la ausencia de scroll horizontal.

Resultado esperado: la prenda activa coincide siempre con la escena visible (SC-001, SC-007).

### 2. Detalle y compra por WhatsApp (US2)

1. Abrir el detalle de una prenda.
2. Verificar fotos, descripción, precio, tallas, colores y cuidado.
3. Elegir talla y color.
4. Pulsar "Comprar por WhatsApp".
5. Verificar que WhatsApp abre con prenda, talla, color y precio en el mensaje.

Resultado esperado: mensaje completo y correcto; sin carrito ni pagos (SC-002, SC-005).

### 3. Prenda agotada (US2 / VI)

1. Abrir el detalle de una prenda con todas sus variantes no disponibles.
2. Verificar que se muestra "Agotado" en la lista y en el detalle.
3. Verificar que no se ofrece el mensaje de compra.

Resultado esperado: estado "Agotado" explícito y compra bloqueada (SC-004).

### 4. Fallback sin video (US3)

1. Bloquear la URL del video desde las herramientas de red o usar un `src` inválido.
2. Recargar la landing.
3. Verificar que se muestra la versión estática con imágenes.
4. Seleccionar una prenda y abrir su detalle.

Resultado esperado: experiencia navegable sin video (SC-006).

### 5. Movimiento reducido (US3)

1. Activar `prefers-reduced-motion: reduce` en el navegador o sistema.
2. Recargar la landing.
3. Verificar que el video no se reproduce y se usa la versión estática.

Resultado esperado: se respeta la preferencia sin perder funcionalidad (SC-006).

### 6. Cierre de página (US4)

1. Llegar al final del scroll.
2. Verificar "Sobre nosotros", preguntas frecuentes, contacto y footer con redes sociales.
3. Probar el enlace de contacto y una red social.

Resultado esperado: secciones presentes y enlaces funcionales.

### 7. Contrato de API

1. `GET /landing` devuelve `tienda` y `escenas` con la forma del contrato.
2. `GET /productos/{id}` devuelve el detalle completo.
3. `GET /productos/{id}` con un id inexistente devuelve `404`.
4. Una petición desde un origen no permitido no recibe cabeceras CORS.

Resultado esperado: respuestas conformes a [contracts/openapi.yaml](./contracts/openapi.yaml).

## Comandos de prueba sugeridos

- Frontend: `npm run test` (unidad), `npm run e2e` (Playwright).
- Backend: `uv run pytest` (unitarias, integración y contrato).

## Referencias

- Especificación: [spec.md](./spec.md)
- Modelo de datos: [data-model.md](./data-model.md)
- Contrato de API: [contracts/openapi.yaml](./contracts/openapi.yaml)
