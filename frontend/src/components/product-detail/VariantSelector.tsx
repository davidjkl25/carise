"use client";

import type { Variante } from "@/domain/catalog";

interface VariantSelectorProps {
  variantes: Variante[];
  selectedTalla: string | null;
  selectedColor: string | null;
  onSelectTalla: (talla: string) => void;
  onSelectColor: (color: string) => void;
}

const swatches: Record<string, string> = {
  Arena: "#F5CBD7",
  Terracota: "#9C5B67",
  Blanco: "#FFF7EC",
  Oliva: "#8F939A",
  Café: "#442F2A",
  Multicolor: "linear-gradient(135deg, #F5CBD7 0 33%, #FFF7EC 33% 66%, #8F939A 66% 100%)",
};

function optionClasses(selected: boolean, disabled: boolean): string {
  const base =
    "inline-flex min-w-12 items-center justify-center gap-2 rounded-brand border px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-clay";

  if (disabled) {
    return `${base} cursor-not-allowed border-brand-ink/10 bg-brand-ink/5 text-brand-ink/35 line-through`;
  }

  return selected
    ? `${base} border-brand-ink bg-brand-ink text-brand-cream`
    : `${base} border-brand-ink/25 text-brand-ink hover:border-brand-ink`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function VariantSelector({
  variantes,
  selectedTalla,
  selectedColor,
  onSelectTalla,
  onSelectColor,
}: VariantSelectorProps) {
  const tallas = unique(variantes.map((variante) => variante.talla));
  const colores = unique(variantes.map((variante) => variante.color));
  const todoAgotado = variantes.every((variante) => !variante.disponible);

  const tallaDisponible = (talla: string): boolean =>
    variantes.some(
      (variante) =>
        variante.talla === talla &&
        (selectedColor === null || variante.color === selectedColor) &&
        variante.disponible,
    );

  const colorDisponible = (color: string): boolean =>
    variantes.some(
      (variante) =>
        variante.color === color &&
        (selectedTalla === null || variante.talla === selectedTalla) &&
        variante.disponible,
    );

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-[10px] uppercase tracking-[0.24em] text-brand-ink/60">
          Talla
        </legend>
        <div className="flex flex-wrap gap-2">
          {tallas.map((talla) => {
            const disabled = !tallaDisponible(talla);
            const selected = talla === selectedTalla;

            return (
              <button
                key={talla}
                type="button"
                onClick={() => onSelectTalla(talla)}
                disabled={disabled}
                aria-pressed={selected}
                className={optionClasses(selected, disabled)}
              >
                {talla}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[10px] uppercase tracking-[0.24em] text-brand-ink/60">
          Color
        </legend>
        <div className="flex flex-wrap gap-2">
          {colores.map((color) => {
            const disabled = !colorDisponible(color);
            const selected = color === selectedColor;

            return (
              <button
                key={color}
                type="button"
                onClick={() => onSelectColor(color)}
                disabled={disabled}
                aria-pressed={selected}
                className={optionClasses(selected, disabled)}
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full border border-brand-ink/20"
                  style={{ background: swatches[color] ?? "#F5CBD7" }}
                />
                {color}
              </button>
            );
          })}
        </div>
      </fieldset>

      {todoAgotado ? (
        <p className="text-xs uppercase tracking-[0.18em] text-brand-clay">
          Todas las tallas están agotadas
        </p>
      ) : null}
    </div>
  );
}
