# Data Model: Landing inmersiva de Carise

Base de datos PostgreSQL. Solo se almacenan URLs de multimedia; los binarios viven en CDN o
almacenamiento externo. Convención: `snake_case`, claves primarias `bigint` salvo la configuración
(singleton), marcas de tiempo en `timestamptz`.

## Relaciones

```text
categorias 1 ──< productos 1 ──< variantes
                        1 ──< multimedia_producto
                        1 ──< escenas_video
configuracion_tienda (singleton)
```

## Tablas

### `categorias`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| nombre | varchar(120) | NOT NULL |
| slug | varchar(140) | NOT NULL, UNIQUE |
| orden | integer | NOT NULL, DEFAULT 0 |
| created_at | timestamptz | NOT NULL, DEFAULT now() |

### `productos`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| categoria_id | bigint | NOT NULL, FK → `categorias.id`, ON DELETE RESTRICT |
| nombre | varchar(160) | NOT NULL |
| slug | varchar(180) | NOT NULL, UNIQUE |
| descripcion | text | NOT NULL |
| precio | numeric(12,2) | NOT NULL, CHECK (`precio` >= 0) |
| moneda | char(3) | NOT NULL, DEFAULT `'COP'` |
| cuidado | text | NOT NULL |
| activo | boolean | NOT NULL, DEFAULT true |
| orden | integer | NOT NULL, DEFAULT 0 |
| created_at | timestamptz | NOT NULL, DEFAULT now() |
| updated_at | timestamptz | NOT NULL, DEFAULT now() |

Índice: `(activo, orden)`, `(categoria_id)`.

### `variantes`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| producto_id | bigint | NOT NULL, FK → `productos.id`, ON DELETE CASCADE |
| talla | varchar(20) | NOT NULL |
| color | varchar(40) | NOT NULL |
| disponible | boolean | NOT NULL, DEFAULT true |
| orden | integer | NOT NULL, DEFAULT 0 |

Restricción: UNIQUE (`producto_id`, `talla`, `color`). Índice: `(producto_id, disponible)`.

### `multimedia_producto`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| producto_id | bigint | NOT NULL, FK → `productos.id`, ON DELETE CASCADE |
| tipo | varchar(20) | NOT NULL, CHECK (`tipo` IN ('imagen','video')) |
| url | text | NOT NULL |
| alt_texto | varchar(255) | NULL |
| orden | integer | NOT NULL, DEFAULT 0 |

Índice: `(producto_id, orden)`.

### `escenas_video`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| producto_id | bigint | NOT NULL, FK → `productos.id`, ON DELETE CASCADE |
| inicio_seg | numeric(8,3) | NOT NULL, CHECK (`inicio_seg` >= 0) |
| fin_seg | numeric(8,3) | NOT NULL, CHECK (`fin_seg` > `inicio_seg`) |
| orden | integer | NOT NULL |

Índice: `(orden)`. Convención: una escena por producto activo de la landing; `orden` define la
secuencia del video.

### `configuracion_tienda`

Registro singleton (`id = 1`) con los datos públicos de la tienda.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | smallint | PK, CHECK (`id` = 1) |
| whatsapp | varchar(30) | NOT NULL |
| correo_contacto | varchar(160) | NOT NULL |
| direccion | varchar(255) | NOT NULL |
| video_landing_url | text | NOT NULL |
| video_landing_url_mobile | text | NULL |
| video_landing_poster_url | text | NULL |
| updated_at | timestamptz | NOT NULL, DEFAULT now() |

`video_landing_url_mobile` y `video_landing_poster_url` son extensiones para cumplir la variante
móvil liviana y el poster exigidos por la constitución (VIII). Si no se informan, se usa
`video_landing_url` y el primer `multimedia_producto` como poster.

## Reglas de validación

- `productos.precio` no negativo y con dos decimales.
- `variantes` única por combinación (`producto_id`, `talla`, `color`).
- `escenas_video.fin_seg` estrictamente mayor que `inicio_seg`; sin solapamientos para un mismo
  producto.
- `multimedia_producto.tipo` limitado a `imagen` o `video`.
- `configuracion_tienda.whatsapp` en formato internacional sin `+` (solo dígitos).
- URLs de `multimedia_producto.url`, `video_landing_url` y variantes deben ser `https`.

## Campos derivados

- **`producto.agotado`**: `true` cuando no existe ninguna `variante` con `disponible = true`
  (incluye productos sin variantes). No se persiste; se calcula en el caso de uso.
- **`producto.imagen_principal`**: primer `multimedia_producto` de tipo `imagen` según `orden`.

## Datos de ejemplo (seed)

- 1 `configuracion_tienda` con WhatsApp, correo, dirección y URLs del video.
- 2-3 `categorias` (p. ej. "Vestidos", "Blusas", "Accesorios").
- 6-10 `productos` con una escena de video cada uno y al menos una imagen.
- Varias `variantes` por producto, incluyendo al menos un producto con todas las variantes
  `disponible = false` para validar el estado "Agotado".
