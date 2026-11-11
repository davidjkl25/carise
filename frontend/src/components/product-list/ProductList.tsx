"use client";

import type { Escena } from "@/domain/catalog";

interface ProductListProps {
  escenas: Escena[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function itemClasses(active: boolean, compact: boolean): string {
  const base = compact
    ? "w-full truncate rounded-brand border px-2 py-2 text-[11px] transition"
    : "w-full rounded-brand border px-4 py-3 text-left transition";

  return active
    ? `${base} border-brand-sand bg-brand-cream text-brand-ink`
    : `${base} border-white/20 bg-black/35 text-brand-cream hover:bg-black/55`;
}

export function ProductList({ escenas, activeIndex, onSelect }: ProductListProps) {
  return (
    <>
      <aside
        className="absolute right-5 top-1/2 z-20 hidden w-64 -translate-y-1/2 md:block"
        aria-label="Prendas de la vitrina"
      >
        <ul className="space-y-2">
          {escenas.map((escena, index) => {
            const active = index === activeIndex;
            return (
              <li key={escena.id}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={active ? "true" : undefined}
                  className={itemClasses(active, false)}
                >
                  <span className="block text-[10px] uppercase tracking-[0.22em] opacity-70">
                    {escena.producto.categoria.nombre}
                  </span>
                  <span className="block font-display text-lg leading-tight">
                    {escena.producto.nombre}
                  </span>
                  {escena.producto.agotado ? (
                    <span
                      className={`mt-1 block text-[9px] uppercase tracking-[0.18em] ${
                        active ? "text-brand-clay" : "text-brand-sand"
                      }`}
                    >
                      Agotado
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div
        className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/55 px-3 py-3 backdrop-blur md:hidden"
        aria-label="Prendas de la vitrina"
      >
        <ul className="grid grid-cols-3 gap-1.5">
          {escenas.map((escena, index) => {
            const active = index === activeIndex;
            return (
              <li key={escena.id}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={active ? "true" : undefined}
                  className={itemClasses(active, true)}
                >
                  <span className="block truncate">{escena.producto.nombre}</span>
                  {escena.producto.agotado ? (
                    <span
                      className={`mt-0.5 block text-[9px] uppercase tracking-[0.14em] ${
                        active ? "text-brand-clay" : "text-brand-sand"
                      }`}
                    >
                      Agotado
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
