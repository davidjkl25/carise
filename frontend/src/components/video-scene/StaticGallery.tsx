"use client";

import Image from "next/image";

import { formatPrice } from "@/application/whatsapp/buildWhatsAppUrl";
import type { Escena } from "@/domain/catalog";

interface StaticGalleryProps {
  escenas: Escena[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function StaticGallery({ escenas, activeIndex, onSelect }: StaticGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {escenas.map((escena, index) => {
        const active = index === activeIndex;
        const imagen = escena.producto.imagen_principal;

        return (
          <button
            key={escena.id}
            type="button"
            data-scene-index={index}
            onClick={() => onSelect(index)}
            aria-current={active ? "true" : undefined}
            aria-label={`Abrir ${escena.producto.nombre}`}
            className={`group relative block overflow-hidden rounded-brand border-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand ${
              active ? "border-brand-sand" : "border-transparent hover:border-brand-clay"
            }`}
          >
            <span className="relative block aspect-[3/4] w-full overflow-hidden bg-brand-sand">
              <Image
                src={imagen?.url ?? "/brand/placeholder.svg"}
                alt={imagen?.alt_texto ?? `Prenda ${escena.producto.nombre}`}
                fill
                sizes="(max-width: 767px) 45vw, 22vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </span>

            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 text-brand-cream">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-brand-sand">
                {escena.producto.categoria.nombre}
              </span>
              <span className="block font-display text-sm leading-tight md:text-lg">
                {escena.producto.nombre}
              </span>
              <span className="mt-0.5 block text-[11px] opacity-80">
                {formatPrice(escena.producto.precio, escena.producto.moneda)}
              </span>
              {escena.producto.agotado ? (
                <span className="mt-1 inline-block rounded-full bg-brand-cream px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-brand-ink">
                  Agotado
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
