"use client";

import { buildWhatsAppUrl } from "@/application/whatsapp/buildWhatsAppUrl";
import type { ProductoDetalle, Variante } from "@/domain/catalog";

interface WhatsAppButtonProps {
  producto: ProductoDetalle;
  variante: Variante | null;
  whatsapp: string;
}

const buttonClasses =
  "inline-flex w-full items-center justify-center rounded-brand bg-brand-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-cream transition hover:bg-brand-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-clay";

export function WhatsAppButton({ producto, variante, whatsapp }: WhatsAppButtonProps) {
  if (producto.agotado) {
    return (
      <p
        role="status"
        className="rounded-brand border border-brand-clay/40 bg-brand-sand px-4 py-3 text-center text-sm text-brand-ink"
      >
        Producto agotado. Escríbenos por WhatsApp para avisarte cuando vuelva.
      </p>
    );
  }

  if (variante === null || !variante.disponible) {
    return (
      <button
        type="button"
        disabled
        className={`${buttonClasses} cursor-not-allowed bg-brand-sand text-brand-ink/60 hover:bg-brand-sand`}
      >
        Elige talla y color
      </button>
    );
  }

  return (
    <a
      href={buildWhatsAppUrl({ whatsapp, producto, variante })}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses}
    >
      Comprar por WhatsApp
    </a>
  );
}
