import { describe, expect, it } from "vitest";

import { buildWhatsAppUrl, formatPrice } from "@/application/whatsapp/buildWhatsAppUrl";

const producto = {
  nombre: "Vestido Lino",
  precio: 189900,
  moneda: "COP",
};

const variante = {
  talla: "M",
  color: "Arena",
};

describe("formatPrice", () => {
  it("formatea COP sin decimales", () => {
    expect(formatPrice(189900, "COP")).toBe("$\u00a0189.900");
  });
});

describe("buildWhatsAppUrl", () => {
  it("genera un enlace wa.me con el número limpio", () => {
    const url = new URL(buildWhatsAppUrl({ whatsapp: "57 300 123 4567", producto, variante }));

    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/573001234567");
  });

  it("incluye prenda, talla, color y precio en el mensaje", () => {
    const url = new URL(buildWhatsAppUrl({ whatsapp: "573001234567", producto, variante }));
    const mensaje = url.searchParams.get("text") ?? "";

    expect(mensaje).toContain("Vestido Lino");
    expect(mensaje).toContain("Talla: M");
    expect(mensaje).toContain("Color: Arena");
    expect(mensaje).toContain(formatPrice(producto.precio, producto.moneda));
  });
});
