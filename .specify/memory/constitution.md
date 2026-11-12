# Constitución de Carise

Landing page inmersiva para la tienda de ropa **Carise**. La marca debe sentirse como una
vitrina: elegir una prenda debe ser tan natural como mirar el video.

## Principios fundamentales

### I. Vitrina inmersiva (video primero)

La página abre con un video de fondo a pantalla completa que muestra las prendas una tras
otra. El scroll de la persona controla el avance del video: la prenda visible en el video se
corresponde con el estado de la página. El video es el eje narrativo, no un adorno de fondo.

### II. Selección natural y sincronizada

Junto al video hay una lista de prendas (en celular, una tira inferior). La prenda que se está
mostrando en el video se resalta automáticamente en esa lista. La persona puede hacer clic en
cualquier prenda, en cualquier momento, para saltar a su detalle. La sincronización video-lista
debe sentirse inmediata y sin ambigüedad de qué prenda está activa.

### III. Detalle completo de la prenda

Todo detalle de prenda debe incluir: fotos, descripción, precio, tallas disponibles, colores
disponibles y cuidado de la prenda. No se considera una prenda "completa" si falta cualquiera
de estos campos.

### IV. Compra sin fricción por WhatsApp

El único camino de compra es el botón "Comprar por WhatsApp", que abre WhatsApp con un mensaje
prellenado con prenda, talla, color y precio. No hay pagos en línea ni carrito. El pago y la
entrega se acuerdan por WhatsApp. Ninguna funcionalidad debe introducir un flujo de pago o un
carrito.

### V. Degradación elegante y movimiento controlable

Si el video de una escena no carga, se muestra la imagen principal de esa prenda sin cambiar
automáticamente el modo ni saltar de posición. La landing inicia en video y ofrece un interruptor
visible para pasar a la galería estática y volver, con la misma capacidad de selección y de acceso
al detalle. La preferencia `prefers-reduced-motion` desactiva los desplazamientos animados.

### VI. Estado de agotado explícito

Las prendas agotadas se indican claramente como agotadas, tanto en la lista como en el detalle.
Una prenda agotada no debe poder generar un mensaje de compra por WhatsApp.

### VII. Identidad de marca

La experiencia visual sigue la identidad de marca de Carise definida en la constitución.
Tipografía, color, tono y fotografía deben ser coherentes en todos los estados de la página.

### VIII. Móvil primero y rendimiento

La experiencia se diseña y valida primero en celular (incluida la tira inferior de prendas).
El video y las imágenes deben cargar de forma progresiva y no bloquear la interacción.

### IX. Experiencia de cliente sin cuentas

La persona que visita la tienda navega y compra sin registro, inicio de sesión, favoritos ni
cuenta. Se permite un panel de administración interno, autenticado y auditado para el personal
autorizado; el panel no forma parte de la experiencia pública.

### X. Administración segura y auditable

Toda gestión interna del negocio ocurre en un panel separado de la landing, protegido por
autenticación y autorización. La API pública permanece de solo lectura, ninguna escritura queda
expuesta sin autenticación y cada cambio registra actor, fecha y valores antes/después.

## Restricciones del proyecto

- **Fuera de alcance:** cuentas de cliente, registro público, favoritos persistentes, búsqueda y
  filtros de catálogo, y comercio electrónico con pago en línea.
- **Panel interno:** el panel de administración es para personal autorizado; no se expone como
  experiencia pública ni reemplaza el flujo de compra por WhatsApp.
- **Un solo canal de conversión:** WhatsApp. Sin pasarela de pago, sin carrito, sin checkout.
- **Sin datos personales de clientes:** la identidad y la conversación viven en WhatsApp. El
  panel solo almacena credenciales del personal autorizado.
- **Contenido de prendas:** cada prenda requiere fotos, descripción, precio, tallas, colores y
  cuidado antes de publicarse.

## Flujo esperado

1. La página abre con el video a pantalla completa mostrando prendas en secuencia.
2. Al hacer scroll, el video avanza y se resalta la prenda activa en la lista lateral o tira inferior.
3. Un clic en cualquier prenda salta a su detalle (fotos, descripción, precio, tallas, colores, cuidado).
4. En el detalle, "Comprar por WhatsApp" abre WhatsApp con prenda, talla, color y precio prellenados.
5. Al final del scroll: sección "Sobre nosotros", ayuda (preguntas frecuentes y contacto) y footer
   con redes sociales.

## Flujo de administración

1. La persona autorizada inicia sesión en `/admin` con sus credenciales.
2. Gestiona catálogo, precios, variantes, multimedia, escenas y datos de la tienda.
3. Cada cambio queda auditado y se refleja en la landing sin recompilar.
4. Las cuentas de cliente, los favoritos persistentes y el pago en línea siguen fuera de alcance.

## Criterios de calidad (puertas de aceptación)

- La prenda resaltada en la lista coincide siempre con la prenda mostrada en el video.
- Cualquier prenda es alcanzable en cualquier momento desde la lista.
- El detalle muestra todos los campos obligatorios y refleja el estado de agotado.
- El mensaje de WhatsApp incluye prenda, talla, color y precio correctos.
- La versión estática funciona sin video, se alterna manualmente y no hay cambios automáticos de modo por fallos de video.
- La experiencia es usable y legible en celular y en escritorio.
- Ninguna escritura del panel queda accesible sin autenticación y toda escritura queda auditada.
- La landing pública sigue siendo de solo lectura y no requiere cuenta.

## Enmiendas

### v1.1.0 — 2026-11-11

- Se permite un panel de administración interno, autenticado y auditado (feature
  `002-admin-panel`), manteniendo a las clientas sin cuentas.
- Se retira "panel de administración" de las restricciones de fuera de alcance.
- Se agrega el Principio X de administración segura y auditable.

## Gobernanza

Esta constitución prevalece sobre decisiones de diseño o implementación que la contradigan.
Toda funcionalidad nueva debe evaluarse contra estos principios; cualquier excepción debe
justificarse explícitamente y registrarse antes de implementarse. Las enmiendas requieren
actualizar este documento y revisar su impacto en el flujo, el alcance y los criterios de
aceptación.

**Versión:** 1.1.0
**Ratificada:** 2026-11-08
**Última enmienda:** 2026-11-11
