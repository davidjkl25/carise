"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { formatPrice } from "@/application/whatsapp/buildWhatsAppUrl";
import { VariantSelector } from "@/components/product-detail/VariantSelector";
import { WhatsAppButton } from "@/components/whatsapp-button/WhatsAppButton";
import type { ProductoDetalle } from "@/domain/catalog";

interface ProductDetailProps {
  producto: ProductoDetalle;
  whatsapp: string;
}

export function ProductDetail({ producto, whatsapp }: ProductDetailProps) {
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeMediaId, setActiveMediaId] = useState<number | null>(null);

  const imagenes = useMemo(
    () =>
      producto.multimedia
        .filter((item) => item.tipo === "imagen")
        .sort((a, b) => a.orden - b.orden),
    [producto.multimedia],
  );

  const activeImage = useMemo(
    () => imagenes.find((imagen) => imagen.id === activeMediaId) ?? imagenes[0] ?? null,
    [imagenes, activeMediaId],
  );

  const selectedVariante = useMemo(
    () =>
      producto.variantes.find(
        (variante) => variante.talla === selectedTalla && variante.color === selectedColor,
      ) ?? null,
    [producto.variantes, selectedTalla, selectedColor],
  );

  const handleTalla = (talla: string) => {
    setSelectedTalla(talla);

    if (
      selectedColor !== null &&
      !producto.variantes.some(
        (variante) =>
          variante.talla === talla && variante.color === selectedColor && variante.disponible,
      )
    ) {
      setSelectedColor(null);
    }
  };

  const handleColor = (color: string) => {
    setSelectedColor(color);

    if (
      selectedTalla !== null &&
      !producto.variantes.some(
        (variante) =>
          variante.talla === selectedTalla && variante.color === color && variante.disponible,
      )
    ) {
      setSelectedTalla(null);
    }
  };

  const imagenUrl = activeImage?.url ?? "/brand/placeholder.svg";
  const imagenAlt = activeImage?.alt_texto ?? producto.nombre;

  return (
    <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8">
      <div className="space-y-3">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-brand bg-brand-sand">
          <Image
            src={imagenUrl}
            alt={imagenAlt}
            fill
            sizes="(max-width: 767px) 94vw, 34vw"
            className="object-cover"
            priority={false}
          />
          {producto.agotado ? (
            <span className="absolute left-3 top-3 rounded-full bg-brand-ink/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-cream">
              Agotado
            </span>
          ) : null}
        </div>

        {imagenes.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {imagenes.map((imagen, index) => {
              const selected = activeImage !== null && imagen.id === activeImage.id;

              return (
                <button
                  key={imagen.id}
                  type="button"
                  onClick={() => setActiveMediaId(imagen.id)}
                  aria-label={`Ver imagen ${index + 1} de ${producto.nombre}`}
                  aria-pressed={selected}
                  className={`relative h-20 w-16 overflow-hidden rounded-brand border-2 transition ${
                    selected ? "border-brand-ink" : "border-transparent hover:border-brand-clay"
                  }`}
                >
                  <Image src={imagen.url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.24em] text-brand-clay">
            {producto.categoria.nombre}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id="product-detail-title"
              className="font-display text-3xl leading-tight sm:text-4xl"
            >
              {producto.nombre}
            </h2>
            {producto.agotado ? (
              <span className="rounded-full bg-brand-ink px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-cream">
                Agotado
              </span>
            ) : null}
          </div>
          <p className="font-display text-2xl text-brand-ink">
            {formatPrice(producto.precio, producto.moneda)}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-brand-ink/80">{producto.descripcion}</p>

        <div className="rounded-brand bg-brand-sand/60 p-4">
          <h3 className="text-[10px] uppercase tracking-[0.24em] text-brand-ink/60">
            Cuidado de la prenda
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-brand-ink/80">{producto.cuidado}</p>
        </div>

        <VariantSelector
          variantes={producto.variantes}
          selectedTalla={selectedTalla}
          selectedColor={selectedColor}
          onSelectTalla={handleTalla}
          onSelectColor={handleColor}
        />

        <div className="space-y-2">
          <p aria-live="polite" className="text-xs uppercase tracking-[0.16em] text-brand-ink/60">
            {selectedVariante
              ? `Talla ${selectedVariante.talla} · ${selectedVariante.color}`
              : "Selecciona talla y color para continuar"}
          </p>
          <WhatsAppButton producto={producto} variante={selectedVariante} whatsapp={whatsapp} />
          <p className="text-center text-[11px] leading-relaxed text-brand-ink/55">
            El pago y la entrega se acuerdan directamente por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
