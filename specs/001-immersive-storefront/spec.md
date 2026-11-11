# Feature Specification: Landing inmersiva de Carise

**Feature Branch**: `001-immersive-storefront`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Landing page inmersiva de la tienda de ropa Carise. La página abre con un video de fondo a pantalla completa en el que se muestran las prendas, una tras otra. Mientras la persona hace scroll, el video avanza y la prenda que se está mostrando se resalta en una lista a un lado del video (en celular, en una tira inferior). La persona puede hacer clic en cualquier prenda de esa lista, en cualquier momento, para saltar a ella y ver su detalle: fotos, descripción, precio, tallas y colores disponibles y cuidado de la prenda. Desde el detalle, el botón 'Comprar por WhatsApp' abre WhatsApp con un mensaje prellenado con prenda, talla, color y precio: no hay pagos en línea ni carrito, y el pago y la entrega se acuerdan por WhatsApp. Al final del scroll hay una sección sobre nosotros junto con ayuda (preguntas frecuentes y contacto) y un footer con redes sociales. Si el video no carga o la persona prefiere menos movimiento, se muestra una versión estática con las imágenes de las prendas. Las prendas agotadas se indican como agotadas. El video y las imágenes viven en almacenamiento externo o CDN y en la base solo se guarda la URL. Por qué: que la marca se sienta como una vitrina y que elegir una prenda sea tan natural como mirar el video. Fuera de alcance: registro, inicio de sesión, favoritos, panel de administración y búsqueda y filtros de catálogo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recorrer la vitrina en video y saltar a una prenda (Priority: P1)

La persona abre la landing y ve un video a pantalla completa donde las prendas aparecen una tras otra. Al hacer scroll, el video avanza y la prenda visible queda resaltada en una lista lateral (o en una tira inferior en celular). En cualquier momento puede tocar una prenda de la lista para saltar directamente a ella.

**Why this priority**: Es el corazón de la experiencia y el diferenciador de marca: sin este recorrido no existe la vitrina.

**Independent Test**: Abrir la landing, hacer scroll y verificar que el video avanza, que la prenda activa se resalta en la lista y que al tocar cualquier prenda se salta a su escena.

**Acceptance Scenarios**:

1. **Given** la landing cargada con video disponible, **When** la persona hace scroll, **Then** el video avanza y la prenda mostrada se resalta en la lista.
2. **Given** la lista de prendas visible, **When** la persona toca una prenda, **Then** la vista salta a la escena de esa prenda y la resalta como activa.
3. **Given** la persona está en cualquier punto del recorrido, **When** toca una prenda de la lista, **Then** el salto ocurre sin ambigüedad sobre qué prenda quedó activa.

---

### User Story 2 - Ver el detalle de una prenda y comprar por WhatsApp (Priority: P1)

Desde la escena o la lista, la persona abre el detalle de una prenda y consulta fotos, descripción, precio, tallas y colores disponibles y cuidado de la prenda. Elige talla y color y pulsa "Comprar por WhatsApp", que abre WhatsApp con un mensaje prellenado con prenda, talla, color y precio.

**Why this priority**: Es el único camino de conversión. Sin detalle ni compra por WhatsApp la vitrina no vende.

**Independent Test**: Abrir el detalle de una prenda, elegir talla y color, pulsar "Comprar por WhatsApp" y comprobar que WhatsApp se abre con el mensaje correcto.

**Acceptance Scenarios**:

1. **Given** una prenda con todos sus datos, **When** la persona abre su detalle, **Then** se muestran fotos, descripción, precio, tallas, colores y cuidado.
2. **Given** una prenda con talla y color elegidos, **When** la persona pulsa "Comprar por WhatsApp", **Then** se abre WhatsApp con prenda, talla, color y precio en el mensaje.
3. **Given** una prenda agotada, **When** la persona abre su detalle, **Then** se indica claramente "Agotado" y no se ofrece el mensaje de compra.

---

### User Story 3 - Ver la vitrina sin video o con menos movimiento (Priority: P2)

Si el video de una escena no carga, esa escena muestra la imagen de la prenda y la landing sigue en modo video. La persona también puede elegir ver toda la vitrina sin movimiento desde el interruptor del encabezado, que muestra una versión estática con las imágenes de las prendas, manteniendo la posibilidad de seleccionar una prenda y ver su detalle.

**Why this priority**: Garantiza que la experiencia no se rompa por red, dispositivo o preferencia de accesibilidad.

**Independent Test**: Bloquear el video de una escena y verificar que aparece su imagen sin cambiar de modo; alternar el interruptor Movimiento y verificar la galería estática y el detalle.

**Acceptance Scenarios**:

1. **Given** el video de una escena no carga, **When** la persona llega a esa escena, **Then** se muestra la imagen de la prenda y se mantiene el modo video.
2. **Given** la landing abierta en modo video, **When** la persona apaga el interruptor Movimiento, **Then** la página cambia a la versión estática sin recargar.
3. **Given** la versión estática, **When** la persona selecciona una prenda, **Then** puede ver su detalle igual que en la versión con video.
4. **Given** la versión estática, **When** la persona enciende el interruptor Movimiento, **Then** vuelve la vitrina en video.

---

### User Story 4 - Conocer la marca y resolver dudas (Priority: P3)

Al final del scroll la persona encuentra la sección "Sobre nosotros", ayuda con preguntas frecuentes y contacto, y un footer con redes sociales.

**Why this priority**: Completa la confianza de marca y el soporte, pero no bloquea la compra.

**Independent Test**: Llegar al final de la landing y comprobar que existen "Sobre nosotros", preguntas frecuentes, contacto y redes sociales, y que contacto y redes funcionan.

**Acceptance Scenarios**:

1. **Given** la persona llega al final del scroll, **When** revisa la página, **Then** ve "Sobre nosotros", preguntas frecuentes, contacto y footer con redes sociales.
2. **Given** la sección de contacto, **When** la persona usa el medio de contacto, **Then** se abre el canal correspondiente con los datos de la tienda.

### Edge Cases

- **Video no disponible o error de carga**: la escena afectada muestra su imagen principal; el modo video no cambia automáticamente y la navegación sigue funcionando.
- **Modo sin movimiento**: la landing inicia en video; el interruptor del encabezado alterna a la galería estática sin recargar y mantiene un solo scroll de página.
- **Prenda agotada**: se muestra como "Agotado" en la lista y en el detalle; no genera mensaje de compra.
- **Prenda sin talla o color seleccionado**: "Comprar por WhatsApp" no se habilita hasta elegir una opción disponible.
- **Variante no disponible**: la talla/color no seleccionable se muestra deshabilitada.
- **Producto sin multimedia**: el detalle muestra un estado de imagen no disponible sin romper la vista.
- **Scroll muy rápido o salto entre prendas**: la prenda activa siempre corresponde a la escena visible.
- **Conexión lenta**: la landing es usable antes de que el video termine de cargar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La landing MUST abrir con un video de fondo a pantalla completa que muestra las prendas en secuencia.
- **FR-002**: El avance del video MUST sincronizarse con el scroll de la persona.
- **FR-003**: La prenda mostrada en el video MUST resaltarse en una lista de prendas (lateral en escritorio, tira inferior en celular).
- **FR-004**: La persona MUST poder seleccionar cualquier prenda de la lista en cualquier momento y saltar a su escena.
- **FR-005**: El detalle de una prenda MUST mostrar fotos, descripción, precio, tallas y colores disponibles y cuidado de la prenda.
- **FR-006**: La persona MUST poder elegir talla y color entre las variantes disponibles.
- **FR-007**: "Comprar por WhatsApp" MUST abrir WhatsApp con un mensaje prellenado que incluya prenda, talla, color y precio.
- **FR-008**: La landing MUST NOT ofrecer pagos en línea ni carrito de compras.
- **FR-009**: El pago y la entrega MUST acordarse por WhatsApp.
- **FR-010**: Si el video de una escena no carga, el sistema MUST mostrar la imagen principal de esa prenda sin cambiar automáticamente el modo de la landing.
- **FR-011**: La landing MUST iniciar en modo video y MUST permitir alternar a la versión estática mediante un interruptor visible en el encabezado, sin recargar la página.
- **FR-012**: Las prendas agotadas MUST indicarse como "Agotado" en la lista y en el detalle.
- **FR-013**: Una prenda agotada MUST NOT generar un mensaje de compra por WhatsApp.
- **FR-014**: Al final del scroll MUST existir una sección "Sobre nosotros".
- **FR-015**: La landing MUST incluir ayuda con preguntas frecuentes y contacto.
- **FR-016**: La landing MUST incluir un footer con redes sociales.
- **FR-017**: La información mostrada de prendas, precios, variantes y contacto MUST provenir de una fuente única de datos de la tienda.
- **FR-018**: La landing MUST ser usable y legible en celular y en escritorio.
- **FR-019**: La experiencia MUST NOT requerir registro, inicio de sesión ni cuenta.
- **FR-020**: La landing MUST NOT incluir favoritos, panel de administración, búsqueda ni filtros de catálogo.

### Key Entities *(include if feature involves data)*

- **Categoría**: agrupación de prendas de la tienda.
- **Producto (prenda)**: prenda mostrada en la vitrina; incluye nombre, descripción, precio, categoría y cuidado.
- **Variante**: combinación de talla y color de una prenda, con su disponibilidad.
- **Multimedia de producto**: fotos asociadas a una prenda, con tipo, ubicación y orden.
- **Escena de video**: tramo del video asociado a una prenda, con inicio, fin y orden.
- **Configuración de tienda**: datos públicos de la tienda (WhatsApp, correo de contacto, dirección y video de la landing).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 90% de las personas identifica la prenda activa durante el scroll sin ayuda.
- **SC-002**: La persona puede pasar de ver una prenda a abrir WhatsApp en 3 acciones o menos (seleccionar prenda, elegir talla/color, comprar).
- **SC-003**: El 95% de las visitas puede abrir el detalle de una prenda en menos de 2 segundos tras elegirla.
- **SC-004**: El 100% de las prendas agotadas se muestran como "Agotado" y sin opción de compra.
- **SC-005**: El 100% de los intentos de compra por WhatsApp incluye prenda, talla, color y precio en el mensaje.
- **SC-006**: La landing sigue siendo navegable y permite abrir el detalle en el 100% de los casos sin video o con movimiento reducido.
- **SC-007**: La landing es usable en una pantalla de celular sin desplazamiento horizontal.

## Assumptions

- La tienda cuenta con un video de la secuencia de prendas y fotos de cada prenda disponibles en un almacenamiento externo o CDN.
- Cada prenda mostrada en el video tiene una escena definida y al menos una foto.
- Los precios se muestran en una única moneda definida por la tienda.
- El número de WhatsApp, correo y redes sociales son datos públicos de la tienda.
- La persona accede desde un navegador moderno con soporte de video.
- No se requiere gestión de inventario en tiempo real más allá de la disponibilidad de variantes publicada.
- El contenido de "Sobre nosotros", preguntas frecuentes y redes sociales lo provee la tienda.
