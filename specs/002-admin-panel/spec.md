# Feature Specification: Panel de administración de Carise

**Feature Branch**: `002-admin-panel`

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Panel de administración interno para que la dueña de Carise pueda gestionar su negocio sin depender de SQL ni del equipo técnico: crear, editar, desactivar y ordenar prendas; cambiar precios; administrar tallas, colores y disponibilidad; gestionar fotos, videos y escenas; actualizar los datos de contacto y, más adelante, consultar métricas de interés. La landing pública sigue siendo anónima y sin cuentas de cliente; el panel es solo para personal autorizado."

## Contexto

La landing de `001-immersive-storefront` es una vitrina pública de solo lectura. Hoy los cambios
de catálogo se hacen con el seed o directamente en la base de datos. Esta feature agrega una
superficie interna de administración para que el negocio opere de forma autónoma, sin exponer
escritura en la API pública ni agregar cuentas para las personas que visitan la tienda.

Principio rector: **la landing sigue siendo anónima y rápida; el panel es interno, autenticado y
auditado**. Los cambios publicados deben reflejarse en la landing sin recompilar ni desplegar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar al panel de forma segura (Priority: P1)

La dueña o una persona autorizada entra a una URL interna del panel con sus credenciales. Si no
tiene sesión, no puede ver ni modificar nada. Puede cerrar sesión y, si olvida su contraseña,
recuperar el acceso por un canal verificado.

**Why this priority**: Sin autenticación no existe panel; es la puerta de entrada y la primera
barrera de seguridad del negocio.

**Independent Test**: Abrir `/admin` sin sesión, comprobar que redirige al login; iniciar sesión
con credenciales válidas, acceder al panel y cerrar sesión.

**Acceptance Scenarios**:

1. **Given** una persona sin sesión, **When** intenta abrir cualquier ruta de `/admin`, **Then**
   es redirigida al login y no ve datos del negocio.
2. **Given** credenciales válidas, **When** la persona inicia sesión, **Then** accede al panel y
   ve su nombre/rol y las secciones permitidas.
3. **Given** una sesión activa, **When** la persona cierra sesión, **Then** la sesión se invalida
   y cualquier intento posterior vuelve al login.
4. **Given** credenciales inválidas repetidas, **When** se supera el límite de intentos,
   **Then** el acceso se bloquea temporalmente y el evento queda registrado.

---

### User Story 2 - Administrar el catálogo y los precios (Priority: P1)

La dueña crea una prenda nueva, edita la existente, cambia su precio, la desactiva para que no
aparezca en la landing o la vuelve a publicar. También ajusta el orden en que se muestra.

**Why this priority**: Cambiar precios y publicar/despublicar prendas es la operación diaria más
frecuente y la que hoy más depende del equipo técnico.

**Independent Test**: Crear una prenda completa, publicarla, verla en la landing, cambiar su
precio, despublicarla y comprobar que desaparece sin desplegar.

**Acceptance Scenarios**:

1. **Given** el panel abierto, **When** la dueña crea una prenda con nombre, categoría,
   descripción, precio, moneda y cuidado, **Then** la prenda queda guardada como borrador o
   publicada según su elección.
2. **Given** una prenda publicada, **When** la dueña cambia el precio, **Then** la landing
   muestra el nuevo precio en la siguiente carga sin recompilar.
3. **Given** una prenda publicada, **When** la dueña la desactiva, **Then** deja de aparecer en la
   landing y en la lista de prendas, sin borrar sus datos.
4. **Given** una prenda desactivada, **When** la dueña la reactiva, **Then** vuelve a aparecer en
   la landing con su contenido previo.
5. **Given** dos prendas publicadas, **When** la dueña cambia su orden, **Then** la landing
   respeta el nuevo orden.
6. **Given** un precio negativo o vacío, **When** la dueña intenta guardarlo, **Then** el sistema
   lo rechaza con un mensaje claro.

---

### User Story 3 - Administrar variantes, tallas, colores y agotados (Priority: P1)

La dueña agrega o quita combinaciones de talla y color, marca una variante como agotada o
disponible y ve el estado "Agotado" calculado automáticamente cuando todas las variantes de una
prenda dejan de estar disponibles.

**Why this priority**: La disponibilidad es la información que más cambia y la que evita vender
algo que no hay.

**Independent Test**: Agregar tallas y colores a una prenda, marcar todas las variantes como no
disponibles y comprobar que la landing muestra "Agotado" y bloquea la compra.

**Acceptance Scenarios**:

1. **Given** una prenda sin variantes, **When** la dueña agrega talla y color, **Then** la
   variante aparece disponible en el detalle de la landing.
2. **Given** una variante existente, **When** la dueña la marca como no disponible, **Then** la
   landing la muestra deshabilitada y no permite seleccionarla.
3. **Given** todas las variantes de una prenda no disponibles, **When** la dueña guarda,
   **Then** la landing muestra la prenda como "Agotado" y sin opción de compra.
4. **Given** una combinación talla/color repetida, **When** la dueña intenta crearla, **Then**
   el sistema la rechaza por duplicada.
5. **Given** una prenda agotada, **When** la dueña marca al menos una variante disponible,
   **Then** la prenda deja de mostrarse como agotada.

---

### User Story 4 - Administrar fotos, videos y escenas (Priority: P2)

La dueña sube o reemplaza fotos de una prenda, define cuál es la imagen principal, agrega el
video de la prenda y ajusta el tramo del video (inicio y fin) que le corresponde en la landing.
También puede actualizar el video de fondo, su versión móvil y el poster.

**Why this priority**: El contenido visual es la vitrina, pero el catálogo y los precios pueden
operar primero con URLs existentes; la gestión de archivos es la siguiente necesidad.

**Independent Test**: Reemplazar la foto principal de una prenda, ajustar su escena de video y
comprobar que la landing usa la nueva imagen y el nuevo tramo.

**Acceptance Scenarios**:

1. **Given** una prenda, **When** la dueña sube una imagen, **Then** la imagen queda asociada,
   ordenada y disponible para la landing.
2. **Given** varias imágenes, **When** la dueña cambia la principal, **Then** la landing usa la
   nueva imagen principal.
3. **Given** una escena existente, **When** la dueña ajusta inicio y fin, **Then** la landing
   reproduce ese tramo para la prenda.
4. **Given** dos escenas con tramos solapados para la misma prenda, **When** la dueña guarda,
   **Then** el sistema rechaza el solapamiento.
5. **Given** un archivo con formato o tamaño no permitido, **When** la dueña intenta subirlo,
   **Then** el sistema lo rechaza con un mensaje claro y no altera el contenido actual.

---

### User Story 5 - Actualizar la información de la tienda (Priority: P2)

La dueña actualiza el número de WhatsApp, correo de contacto, dirección, video de la landing,
versión móvil y poster, sin tocar código.

**Why this priority**: Los datos de contacto cambian poco, pero un error ahí afecta directamente
la conversión por WhatsApp.

**Independent Test**: Cambiar el número de WhatsApp en el panel y comprobar que el botón de
compra de la landing abre el nuevo número.

**Acceptance Scenarios**:

1. **Given** la configuración actual, **When** la dueña cambia el WhatsApp, **Then** la landing
   usa el nuevo número en el enlace de compra.
2. **Given** la configuración actual, **When** la dueña actualiza correo o dirección, **Then**
   la sección de contacto de la landing refleja los nuevos datos.
3. **Given** un WhatsApp con formato inválido, **When** la dueña intenta guardarlo, **Then** el
   sistema lo rechaza con un mensaje claro.

---

### User Story 6 - Consultar métricas básicas (Priority: P3, fase posterior)

La dueña consulta cuántas veces se ve cada prenda y cuántos clics genera el botón de WhatsApp,
para decidir qué destacar y qué retirar. No se recopilan datos personales de las visitantes.

**Why this priority**: Aporta valor de negocio, pero depende de que el catálogo ya se administre
desde el panel y de definir una medición respetuosa de la privacidad.

**Independent Test**: Ver el panel de métricas con datos agregados de vistas y clics por prenda
en un rango de fechas.

**Acceptance Scenarios**:

1. **Given** visitas registradas en la landing, **When** la dueña abre métricas, **Then** ve
   vistas y clics por prenda en el rango elegido.
2. **Given** una prenda sin visitas, **When** la dueña revisa métricas, **Then** aparece con
   cero y sin errores.
3. **Given** cualquier visita, **When** se registra la métrica, **Then** no se almacena
   información personal identificable.

### Edge Cases

- **Sesión expirada durante una edición**: los cambios no se guardan y se pide iniciar sesión de
  nuevo sin perder silenciosamente lo escrito.
- **Dos administradores editan la misma prenda**: se detecta el conflicto y se evita sobrescribir
  cambios ajenos sin aviso.
- **Borrado accidental**: las prendas se desactivan por defecto; el borrado definitivo exige
  confirmación explícita.
- **Prenda desactivada con escena de video**: deja de mostrarse en la landing; la escena se
  conserva para una posible reactivación.
- **Prenda eliminada definitivamente**: sus variantes, multimedia y escenas se eliminan en
  cascada y la landing deja de referenciarla.
- **Todas las variantes no disponibles**: la prenda se muestra como "Agotado" sin intervención
  manual.
- **Slug duplicado**: el sistema lo rechaza o lo ajusta de forma determinista sin romper enlaces.
- **Fallo del almacenamiento de archivos**: la operación se informa como fallida y no se guarda
  una URL rota.
- **Archivo muy grande o formato no soportado**: se rechaza antes de publicar.
- **Cambio de precio con la landing abierta**: la siguiente carga o refresco muestra el valor
  vigente; no se requiere tiempo real.
- **Sin conexión**: el panel muestra un error claro y no deja la edición en un estado ambiguo.
- **Acceso desde celular**: las tareas críticas (precio, disponibilidad) son usables en pantalla
  pequeña, aunque el panel se optimiza para escritorio.

## Requirements *(mandatory)*

### Functional Requirements

**Acceso y seguridad**

- **FR-001**: El panel MUST requerir autenticación para cualquier lectura o escritura de datos
  internos.
- **FR-002**: El sistema MUST soportar al menos un rol administrador con acceso total y permitir
  agregar roles de solo lectura o edición limitada sin rediseñar el modelo.
- **FR-003**: Las sesiones MUST usar cookies `HttpOnly`, `Secure` y `SameSite` y expirar por
  inactividad.
- **FR-004**: El sistema MUST limitar intentos de inicio de sesión fallidos y registrar los
  eventos de seguridad.
- **FR-005**: Las contraseñas MUST almacenarse con un hash seguro y nunca en texto plano.
- **FR-006**: El panel MUST ofrecer recuperación de acceso por un canal verificado.
- **FR-007**: La API pública de la landing MUST permanecer de solo lectura; ninguna ruta de
  escritura puede quedar expuesta sin autenticación.
- **FR-008**: Las acciones de escritura MUST validar autorización en el servidor, no solo en la
  interfaz.

**Catálogo**

- **FR-009**: La persona administradora MUST poder crear, editar y desactivar prendas.
- **FR-010**: La prenda MUST incluir nombre, slug, categoría, descripción, precio, moneda y
  cuidado antes de publicarse.
- **FR-011**: El precio MUST ser un valor no negativo con dos decimales y una moneda válida.
- **FR-012**: La persona administradora MUST poder cambiar el precio de una prenda publicada y
  verlo reflejado en la landing sin recompilar.
- **FR-013**: La persona administradora MUST poder publicar, despublicar y reordenar prendas.
- **FR-014**: El sistema MUST permitir crear, editar y ordenar categorías.
- **FR-015**: El sistema MUST rechazar slugs duplicados o resolverlos de forma determinista.

**Variantes y disponibilidad**

- **FR-016**: La persona administradora MUST poder crear, editar y eliminar variantes de talla y
  color.
- **FR-017**: El sistema MUST impedir combinaciones duplicadas de talla y color por prenda.
- **FR-018**: La persona administradora MUST poder marcar cada variante como disponible o no
  disponible.
- **FR-019**: El estado "Agotado" MUST calcularse automáticamente cuando ninguna variante esté
  disponible, sin edición manual.

**Multimedia y video**

- **FR-020**: La persona administradora MUST poder asociar imágenes y videos a una prenda,
  mediante carga de archivo o URL.
- **FR-021**: El sistema MUST permitir ordenar la multimedia y definir la imagen principal.
- **FR-022**: La persona administradora MUST poder crear y ajustar escenas de video con inicio,
  fin y orden.
- **FR-023**: El sistema MUST rechazar escenas solapadas para una misma prenda y tramos
  inválidos.
- **FR-024**: La persona administradora MUST poder actualizar el video de fondo, la versión
  móvil y el poster de la landing.
- **FR-025**: El sistema MUST validar formato y tamaño de archivos antes de publicarlos.

**Configuración y auditoría**

- **FR-026**: La persona administradora MUST poder actualizar WhatsApp, correo, dirección y URLs
  de video de la tienda.
- **FR-027**: El sistema MUST validar el formato internacional del WhatsApp y las URLs `https`.
- **FR-028**: Cada cambio MUST registrar quién lo hizo, cuándo, qué entidad y los valores antes y
  después.
- **FR-029**: La landing MUST reflejar los cambios publicados en la siguiente carga, sin
  recompilar ni desplegar.
- **FR-030**: El sistema MUST proteger el borrado definitivo con confirmación explícita y
  conservar la opción de desactivar como acción por defecto.
- **FR-031**: El sistema MUST detectar ediciones concurrentes y evitar sobrescribir cambios sin
  aviso.

**Métricas (fase posterior)**

- **FR-032**: El sistema MUST registrar vistas de prenda y clics en "Comprar por WhatsApp" de
  forma agregada.
- **FR-033**: Las métricas MUST NOT almacenar datos personales identificables.
- **FR-034**: El panel MUST mostrar métricas por prenda y por rango de fechas.

### Key Entities

- **Usuario administrador**: persona autorizada con credenciales, estado y rol.
- **Rol**: conjunto de permisos (administrador, editor, solo lectura).
- **Registro de auditoría**: evento inmutable con actor, acción, entidad, valores y fecha.
- **Producto**: prenda con nombre, slug, categoría, descripción, precio, moneda, cuidado, estado
  de publicación y orden.
- **Variante**: combinación de talla y color con disponibilidad.
- **Categoría**: agrupación ordenada de prendas.
- **Multimedia de producto**: imagen o video con URL, texto alternativo y orden.
- **Escena de video**: tramo del video asociado a una prenda.
- **Configuración de tienda**: datos públicos y URLs de video de la landing.
- **Evento de métrica** (fase posterior): registro agregado de vista o clic, sin datos
  personales.

## Alcance por fases

### Fase 1 — MVP operativo

- Autenticación, sesión, rol administrador y auditoría básica.
- CRUD de categorías, prendas y variantes; precio, moneda, cuidado, publicación y orden.
- Disponibilidad por variante y estado "Agotado" automático.
- Configuración de la tienda (WhatsApp, correo, dirección, URLs de video).
- Multimedia por URL (sin carga de archivos todavía).
- La landing refleja los cambios sin recompilar.

**Criterio de salida**: la dueña puede operar el catálogo y los datos de contacto sin ayuda
técnica.

### Fase 2 — Contenido y video

- Carga de imágenes y videos a almacenamiento externo.
- Orden de multimedia, imagen principal y textos alternativos.
- Gestión de escenas de video (inicio, fin, orden, validación de solapamientos).
- Poster y variante móvil del video de la landing.
- Validaciones de formato y tamaño.

**Criterio de salida**: la dueña puede renovar la vitrina visual completa desde el panel.

### Fase 3 — Métricas

- Registro agregado de vistas de prenda y clics de WhatsApp.
- Panel de métricas por prenda y rango de fechas.
- Sin datos personales ni cookies de seguimiento publicitario.

**Criterio de salida**: la dueña toma decisiones de exhibición con datos propios.

### Fase 4 — Cuentas de clientes y favoritos (fuera de esta spec)

No forma parte de esta feature. Requiere una spec y una enmienda constitucional propias. Como
paso intermedio de bajo costo, los favoritos pueden implementarse sin cuenta con
almacenamiento local en el navegador.

## Out of Scope

- Cuentas, registro o inicio de sesión para clientes de la tienda.
- Favoritos persistentes entre dispositivos.
- Pagos en línea, carrito o checkout.
- Gestión de pedidos, envíos o inventario en tiempo real más allá de la disponibilidad publicada.
- Multi-tienda o múltiples sucursales con catálogos separados.
- Aplicación móvil nativa.
- Facturación, contabilidad o integraciones con transportadoras.
- Campañas de marketing o correo masivo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La dueña puede cambiar un precio y verlo en la landing en menos de 2 minutos, sin
  ayuda técnica.
- **SC-002**: La dueña puede marcar una variante como agotada en menos de 30 segundos.
- **SC-003**: El 100% de las escrituras del panel requiere autenticación y queda auditado.
- **SC-004**: El 0% de los endpoints públicos permite escritura.
- **SC-005**: El 100% de las prendas publicadas cumple los campos obligatorios (fotos,
  descripción, precio, tallas, colores y cuidado) antes de aparecer en la landing.
- **SC-006**: Los cambios publicados se reflejan en la landing en la siguiente carga, sin
  recompilar ni desplegar.
- **SC-007**: Las tareas críticas (precio, disponibilidad, publicación) se completan en 3
  acciones o menos desde el panel.
- **SC-008**: El 100% de los intentos de acceso no autorizado a `/admin` se bloquea y registra.
- **SC-009**: Las métricas no contienen datos personales identificables.

## Impacto constitucional y enmienda propuesta

La constitución vigente (`v1.0.0`) declara fuera de alcance el panel de administración y las
cuentas (Principio IX y Restricciones). Esta feature requiere una enmienda explícita **antes de
implementarse**, según la gobernanza.

**Enmienda propuesta (v1.1.0)**:

- Renombrar el Principio IX a **"Experiencia de cliente sin cuentas"**: la persona que visita la
  tienda sigue navegando y comprando sin registro, inicio de sesión ni favoritos; se permite un
  panel de administración interno, autenticado y auditado para el personal autorizado.
- Actualizar las restricciones: retirar "panel de administración" de "Fuera de alcance" y
  mantener fuera de alcance las cuentas de cliente, los favoritos persistentes y el comercio
  electrónico con pago en línea.
- Agregar un principio **X. Administración segura y auditable**: el panel es interno, no forma
  parte de la experiencia pública, la API pública permanece de solo lectura y toda escritura se
  autentica y se audita.

## Assumptions

- Existe una sola tienda y un número reducido de personas administradoras.
- La landing de `001-immersive-storefront` y su API pública de solo lectura se mantienen.
- El esquema actual de catálogo, variantes, multimedia, escenas y configuración se reutiliza; se
  agregan usuarios, roles y auditoría.
- El almacenamiento de archivos será externo (S3, Cloudinary u equivalente); la base solo guarda
  URLs, como define la constitución.
- El panel se optimiza para escritorio, con tareas críticas usables en celular.
- La interfaz y los mensajes estarán en español.
- Las métricas se agregarán sin datos personales y sin cookies publicitarias.
- El correo para recuperación de acceso y notificaciones ya está disponible o se define en el
  plan técnico.

## Preguntas abiertas (con valor por defecto sugerido)

1. **Método de autenticación**: correo y contraseña con recuperación por correo (por defecto);
   alternativa: enlace mágico o proveedor externo.
2. **Roles**: un solo rol administrador en la fase 1 (por defecto); roles adicionales después.
3. **Proveedor de almacenamiento**: Cloudinary o S3 compatible (se decide en el plan técnico).
4. **Carga de archivos**: por URL en la fase 1 y carga directa en la fase 2 (por defecto).
5. **Métricas**: conteo agregado propio, sin terceros ni cookies (por defecto).
6. **Favoritos sin cuenta**: `localStorage` como mejora independiente, no incluida aquí (por
   defecto).
