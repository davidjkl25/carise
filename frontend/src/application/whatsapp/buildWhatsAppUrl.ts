import type { Producto, Variante } from "@/domain/catalog";

interface BuildWhatsAppUrlInput {
  whatsapp: string;
  producto: Pick<Producto, "nombre" | "precio" | "moneda">;
  variante: Pick<Variante, "talla" | "color">;
}

export function formatPrice(precio: number, moneda: string): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(precio);
}

export function buildWhatsAppUrl({ whatsapp, producto, variante }: BuildWhatsAppUrlInput): string {
  const numero = whatsapp.replace(/\D/g, "");
  const mensaje = [
    "Hola Carise, quiero comprar:",
    producto.nombre,
    `Talla: ${variante.talla}`,
    `Color: ${variante.color}`,
    `Precio: ${formatPrice(producto.precio, producto.moneda)}`,
  ].join("\n");

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
