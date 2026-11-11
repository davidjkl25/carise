"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import { ProductDetail } from "@/components/product-detail/ProductDetail";
import type { ProductoDetalle } from "@/domain/catalog";
import { apiGet } from "@/infrastructure/api/client";

interface ProductDetailDialogProps {
  open: boolean;
  productoId: number | null;
  whatsapp: string;
  onClose: () => void;
}

export function ProductDetailDialog({
  open,
  productoId,
  whatsapp,
  onClose,
}: ProductDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [producto, setProducto] = useState<ProductoDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || productoId === null) {
      setProducto(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProducto(null);

    apiGet<ProductoDetalle>(`/productos/${productoId}`)
      .then((detalle) => {
        if (!cancelled) {
          setProducto(detalle);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("No pudimos cargar esta prenda. Intenta de nuevo.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, productoId]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={producto ? "product-detail-title" : undefined}
      aria-label={producto ? undefined : "Detalle de la prenda"}
      className="m-auto max-h-[92vh] w-[min(94vw,72rem)] overflow-y-auto rounded-brand border border-brand-sand bg-brand-cream p-0 text-brand-ink shadow-2xl"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar detalle de la prenda"
        className="fixed right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand-ink/15 bg-brand-cream/95 text-xl leading-none text-brand-ink shadow-md transition hover:bg-brand-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-clay"
      >
        ×
      </button>

      {loading ? (
        <p role="status" className="p-10 text-center text-sm text-brand-ink/70">
          Cargando prenda…
        </p>
      ) : null}

      {error !== null ? (
        <div role="alert" className="space-y-3 p-10 text-center">
          <p className="text-sm text-brand-ink/80">{error}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-brand border border-brand-ink/25 px-4 py-2 text-xs uppercase tracking-[0.18em]"
          >
            Cerrar
          </button>
        </div>
      ) : null}

      {producto !== null ? (
        <ProductDetail key={producto.id} producto={producto} whatsapp={whatsapp} />
      ) : null}
    </dialog>
  );
}
