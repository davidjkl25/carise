# Marca Carise

Resumen operativo del manual de marca para el frontend. Los archivos fuente del manual no forman
parte de este repositorio.

## Paleta

| Token           | Hex       | Uso principal                        |
| --------------- | --------- | ------------------------------------ |
| Grey Brown      | `#442F2A` | Texto principal, fondos oscuros      |
| Blush           | `#F5CBD7` | Acentos suaves, detalles             |
| Cream           | `#FFF7EC` | Fondo base                           |
| Bubble Pink     | `#F1D2DF` | Paneles, tarjetas y estados suaves   |
| Sky Whip        | `#8F939A` | Acentos neutros y textos secundarios |
| Rose (derivado) | `#9C5B67` | Enlaces y etiquetas con contraste AA |

Los tokens viven en `frontend/src/styles/tokens.css` y se exponen en Tailwind como
`brand-brown`, `brand-blush`, `brand-cream`, `brand-bubble`, `brand-sky`, `brand-rose` y los alias
semánticos `brand-ink`, `brand-sand`, `brand-clay`, `brand-olive`.

## Tipografías

- **Mea Culpa:** acentos caligráficos y logotipo.
- **Fraunces:** títulos y nombres de producto.
- **Myriad Pro:** texto corrido; si no está instalada se usa la pila del sistema.

## Assets

- `frontend/public/brand/monogram.svg`: símbolo para fondos claros.
- `frontend/public/brand/monogram-light.svg`: símbolo para fondos oscuros.
- `frontend/public/brand/wordmark.svg` y `wordmark-light.svg`: logotipo.
- `frontend/public/brand/logo.svg` y `logo-light.svg`: lockup horizontal.
- `frontend/public/brand/favicon.svg`: favicon con el símbolo.
- `frontend/public/brand/og-image.png`: imagen 1200×630 para Open Graph.

## Reglas de uso

- Mantén el área de respeto alrededor del símbolo y del logotipo.
- Tamaño mínimo del símbolo: 5×5 mm en impresión.
- Sobre fondos oscuros usa siempre las versiones `-light`.
- No deformes, rotes ni cambies los colores fuera de la paleta.
- El nombre de marca se escribe **Carise**.
